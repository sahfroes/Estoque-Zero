import express from 'express';
import path from 'path';
import cors from 'cors';
import axios from 'axios';
import { fileURLToPath } from 'url';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Configuração necessária para simular __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialização do Firebase Admin SDK
if (!getApps().length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("A variável FIREBASE_SERVICE_ACCOUNT não foi configurada no ambiente.");
  }
  
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Corrige formatação de quebras de linha na chave privada se necessário
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();
const auth = getAuth();

const app = express();

app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta www (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'www'), { index: false }));

// --- ROTAS DO SITE ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'Frontend', 'View', 'abertura.html'));
});

app.post('/processar-qr', (req, res) => {
  const { codigo } = req.body;
  res.json({
    sucesso: true,
    restante: 85.50,
    nomeProduto: "Item Escaneado",
    dadosGrafico: [70, 50, 20]
  });
});

// --- OPERAÇÕES CRUD DO FIREBASE ---

app.post('/cadastrar', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password: senha,
      displayName: nome,
    });

    await db.collection('usuarios').doc(userRecord.uid).set({
      nome,
      email,
      criadoEm: FieldValue.serverTimestamp()
    });

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', uid: userRecord.uid });
  } catch (error) {
    console.error('Erro no Firebase:', error);

    let mensagemTraduzida = "Erro ao realizar o cadastro.";

    if (error.code === 'auth/email-already-exists') {
      mensagemTraduzida = "Este e-mail já está sendo usado por outra conta.";
    } else if (error.code === 'auth/invalid-email') {
      mensagemTraduzida = "O endereço de e-mail informado é inválido.";
    } else if (error.code === 'auth/weak-password') {
      mensagemTraduzida = "A senha deve ter pelo menos 6 caracteres.";
    } else if (error.message && error.message.includes('configuration')) {
      mensagemTraduzida = "Configuração do projeto inválida ou não encontrada.";
    }

    return res.status(400).json({ erro: mensagemTraduzida });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha e-mail e senha!' });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;

  if (!apiKey) {
    console.error("A variável FIREBASE_WEB_API_KEY não foi configurada.");
    return res.status(500).json({ erro: 'Erro de configuração no servidor (chave de API ausente).' });
  }

  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const response = await axios.post(url, {
      email,
      password: senha,
      returnSecureToken: true
    });

    const { localId, idToken } = response.data;
    const userDoc = await db.collection('usuarios').doc(localId).get();

    return res.json({
      mensagem: 'Login realizado com sucesso!',
      token: idToken,
      usuario: userDoc.exists ? userDoc.data() : { email }
    });
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error.message);
    return res.status(401).json({ erro: 'E-mail ou senha inválidos!' });
  }
});

app.put('/editar/:uid', async (req, res) => {
  const { uid } = req.params;
  const { nome, email, senha } = req.body;

  try {
    const dadosAuth = {};
    const dadosFirestore = {};

    if (nome) {
      dadosAuth.displayName = nome;
      dadosFirestore.nome = nome;
    }
    if (email) {
      dadosAuth.email = email;
      dadosFirestore.email = email;
    }
    if (senha) {
      dadosAuth.password = senha;
    }

    if (Object.keys(dadosAuth).length > 0) {
      await auth.updateUser(uid, dadosAuth);
      if (Object.keys(dadosFirestore).length > 0) {
        await db.collection('usuarios').doc(uid).update(dadosFirestore);
      }
    }

    return res.json({ mensagem: 'Dados atualizados com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

app.delete('/deletar/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    await auth.deleteUser(uid);
    await db.collection('usuarios').doc(uid).delete();

    return res.json({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

// Execução local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

export default app;
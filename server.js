import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Configuração necessária para simular __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialização do Firebase Admin SDK (Compatível com Vercel e Local)
if (!getApps().length) {
  let serviceAccount;

  // Se estiver na Vercel usa a variável do painel, se estiver Local usa o arquivo firebase-key.json
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const keyPath = path.join(__dirname, 'firebase-key.json');
    if (fs.existsSync(keyPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    } else {
      throw new Error("Credenciais do Firebase não encontradas (variável ou firebase-key.json).");
    }
  }

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();
const app = express();

app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta www (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'www')));

// --- ROTAS DE PÁGINAS ---

// Rota inicial do site (Abertura)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'Frontend', 'View', 'abertura.html'));
});

// Rota da tela de Login (Entrar)
app.get('/entrar.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'Frontend', 'View', 'entrar.html'));
});

// --- ROTAS DO SISTEMA DE SALAS (ESTOQUE ZERO) ---

// 1. Rota para o aluno entrar na sala (Validação de Código e PIN)
app.post('/api/salas/entrar', async (req, res) => {
  try {
    const { codigo, pin } = req.body;

    if (!codigo || !pin) {
      return res.status(400).json({ mensagem: 'Código e PIN são obrigatórios.' });
    }

    const codigoFormatado = codigo.trim().toUpperCase();
    const salaRef = db.collection('salas').doc(codigoFormatado);
    const doc = await salaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ mensagem: 'Sala não encontrada.' });
    }

    const salaData = doc.data();

    if (!salaData.ativa) {
      return res.status(403).json({ mensagem: 'Esta sala não está mais ativa.' });
    }

    if (salaData.pin !== pin.trim()) {
      return res.status(401).json({ mensagem: 'PIN incorreto.' });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Acesso liberado!',
      codigo: salaData.codigo
    });

  } catch (error) {
    console.error('Erro ao entrar na sala:', error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

// 2. Rota para o professor criar uma nova sala
app.post('/api/salas/criar', async (req, res) => {
  try {
    const { codigo, pin } = req.body;

    if (!codigo || !pin) {
      return res.status(400).json({ mensagem: 'Código e PIN são obrigatórios.' });
    }

    const codigoFormatado = codigo.trim().toUpperCase();
    const salaRef = db.collection('salas').doc(codigoFormatado);

    await salaRef.set({
      codigo: codigoFormatado,
      pin: pin.trim(),
      ativa: true,
      criadoEm: FieldValue.serverTimestamp()
    });

    return res.status(201).json({ sucesso: true, mensagem: 'Sala criada com sucesso!' });

  } catch (error) {
    console.error('Erro ao criar sala:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar a sala.' });
  }
});

// Execução Local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Exportação necessária para a Vercel
export default app;
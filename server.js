
import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

import {
    initializeApp,
    cert,
    getApps
} from 'firebase-admin/app';

import {
    getFirestore,
    FieldValue
} from 'firebase-admin/firestore';

// ======================================================
// CAMINHO DO PROJETO
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// FIREBASE ADMIN
// ======================================================

if (!getApps().length) {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT
        );
    } else {
        const keyPath = path.join(__dirname, 'firebase-key.json');

        if (fs.existsSync(keyPath)) {
            serviceAccount = JSON.parse(
                fs.readFileSync(keyPath, 'utf8')
            );
        } else {
            throw new Error(
                'Credenciais do Firebase não encontradas.'
            );
        }
    }

    if (serviceAccount.private_key) {
        serviceAccount.private_key =
            serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    initializeApp({
        credential: cert(serviceAccount)
    });
}

// ======================================================
// FIRESTORE E EXPRESS
// ======================================================

const db = getFirestore();
const app = express();

app.use(express.json());
app.use(cors());

app.use(
    express.static(
        path.join(__dirname, 'www'),
        { index: false }
    )
);

// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function normalizarCodigo(codigo) {
    return String(codigo ?? '')
        .trim()
        .toUpperCase();
}

function normalizarPin(pin) {
    if (pin === undefined || pin === null) {
        return '';
    }

    return String(pin).trim();
}

// Busca a sala pelo ID do documento ou pelo campo "codigo".
// Exemplo: ID = TESTE1 e codigo = TESTEDRIVER.
async function buscarSalaPorCodigo(codigoRecebido) {
    const codigo = normalizarCodigo(codigoRecebido);

    if (!codigo) {
        return null;
    }

    // 1. Tenta localizar pelo ID do documento.
    const referencia = db.collection('salas').doc(codigo);
    const documento = await referencia.get();

    if (documento.exists) {
        return {
            ref: referencia,
            doc: documento
        };
    }

    // 2. Se não encontrar, procura pelo campo "codigo".
    const resultado = await db
        .collection('salas')
        .where('codigo', '==', codigo)
        .limit(1)
        .get();

    if (resultado.empty) {
        return null;
    }

    const sala = resultado.docs[0];

    return {
        ref: sala.ref,
        doc: sala
    };
}

// ======================================================
// ROTAS DE PÁGINAS
// ======================================================

app.get('/', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'www',
            'Frontend',
            'View',
            'abertura.html'
        )
    );
});

app.get('/entrar.html', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'www',
            'Frontend',
            'View',
            'entrar.html'
        )
    );
});

// ======================================================
// ENTRAR NA SALA
// ======================================================

app.post('/api/salas/entrar', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.body.codigo);
        const pin = normalizarPin(req.body.pin);

        if (!codigo || !pin) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código e PIN são obrigatórios.'
            });
        }

        const sala = await buscarSalaPorCodigo(codigo);

        if (!sala) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada. Confira o código no Firebase.'
            });
        }

        const dados = sala.doc.data();

        if (dados.ativa !== true) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Esta sala não está mais ativa.'
            });
        }

        if (normalizarPin(dados.pin) !== pin) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'PIN incorreto.'
            });
        }

        const codigoOficial =
            normalizarCodigo(dados.codigo) || codigo;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Acesso liberado!',
            codigo: codigoOficial
        });

    } catch (error) {
        console.error('Erro ao entrar na sala:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        });
    }
});

// ======================================================
// CRIAR SALA
// ======================================================

app.post('/api/salas/criar', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.body.codigo);
        const pin = normalizarPin(req.body.pin);

        if (!codigo || !pin) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código e PIN são obrigatórios.'
            });
        }

        const salaRef = db.collection('salas').doc(codigo);
        const salaExistente = await salaRef.get();

        if (salaExistente.exists) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Já existe uma sala com esse código.'
            });
        }

        await salaRef.set({
            codigo,
            pin,
            ativa: true,
            criadoEm: FieldValue.serverTimestamp()
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Sala criada com sucesso!',
            codigo
        });

    } catch (error) {
        console.error('Erro ao criar sala:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar a sala.'
        });
    }
});

// ======================================================
// PERSONAGENS PERMITIDOS
// ======================================================

const personagensPermitidos = {
    gigis: {
        id: 'gigis',
        nome: 'Gigis',
        seed: 'gigis-estoque-zero'
    },
    alexa: {
        id: 'alexa',
        nome: 'Alexa',
        seed: 'alexa-estoque-zero'
    },
    vivi: {
        id: 'vivi',
        nome: 'Vivi',
        seed: 'vivi-estoque-zero'
    },
    gao: {
        id: 'gao',
        nome: 'Gao',
        seed: 'gao-estoque-zero'
    },
    tuco: {
        id: 'tuco',
        nome: 'Tuco',
        seed: 'tuco-estoque-zero'
    },
    pulma: {
        id: 'pulma',
        nome: 'Pulma',
        seed: 'pulma-estoque-zero'
    },
    robs: {
        id: 'robs',
        nome: 'Robs',
        seed: 'robs-estoque-zero'
    },
    prin: {
        id: 'prin',
        nome: 'Prin',
        seed: 'prin-estoque-zero'
    },
    mark: {
        id: 'mark',
        nome: 'Mark',
        seed: 'mark-estoque-zero'
    },
    ligi: {
        id: 'ligi',
        nome: 'Ligi',
        seed: 'ligi-estoque-zero'
    }
};

// ======================================================
// VERIFICAR PERSONAGENS OCUPADOS
// ======================================================

app.get('/api/jogadores/ocupados', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.query.codigo);

        if (!codigo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código da turma não informado.'
            });
        }

        const sala = await buscarSalaPorCodigo(codigo);

        if (!sala) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        const jogadoresSnapshot = await sala.ref
            .collection('jogadores')
            .get();

        const ocupados = jogadoresSnapshot.docs.map(
            documento => documento.id
        );

        return res.status(200).json({
            sucesso: true,
            ocupados
        });

    } catch (error) {
        console.error('Erro ao buscar personagens ocupados:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar personagens ocupados.'
        });
    }
});

// ======================================================
// RESERVAR PERSONAGEM
// ======================================================

app.post('/api/jogadores/entrar', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.body.codigo);
        const { personagemId, orcamento } = req.body;

        if (!codigo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código da turma não informado.'
            });
        }

        if (
            !personagemId ||
            !personagensPermitidos[personagemId]
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Personagem inválido.'
            });
        }

        const sala = await buscarSalaPorCodigo(codigo);

        if (!sala) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        if (sala.doc.data().ativa !== true) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Esta sala não está mais ativa.'
            });
        }

        const personagem = personagensPermitidos[personagemId];

        const jogadorRef = sala.ref
            .collection('jogadores')
            .doc(personagem.id);

        await db.runTransaction(async transaction => {
            const jogadorDoc = await transaction.get(jogadorRef);

            if (jogadorDoc.exists) {
                const erro = new Error('PERSONAGEM_OCUPADO');
                erro.codigo = 'PERSONAGEM_OCUPADO';
                throw erro;
            }

            let saldoInicial = Number(orcamento);

            if (
                !Number.isFinite(saldoInicial) ||
                saldoInicial <= 0
            ) {
                saldoInicial = 50;
            }

            transaction.create(jogadorRef, {
                personagemId: personagem.id,
                personagemNome: personagem.nome,
                avatarSeed: personagem.seed,
                finalizou: false,
                quantidadeTotalItens: 0,
                totalGasto: 0,
                saldoRestante: saldoInicial,
                produtos: [],
                orcamento: saldoInicial,
                pontuacao: 0,
                criadoEm: FieldValue.serverTimestamp()
            });
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Personagem reservado com sucesso.',
            personagem
        });

    } catch (error) {
        if (error.codigo === 'PERSONAGEM_OCUPADO') {
            return res.status(409).json({
                sucesso: false,
                codigo: 'PERSONAGEM_OCUPADO',
                mensagem: 'Esse personagem já foi escolhido. Escolha outro personagem.'
            });
        }

        console.error('Erro ao reservar personagem:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao reservar o personagem.'
        });
    }
});

// ======================================================
// FINALIZAR PARTIDA DO JOGADOR
// ======================================================

app.post('/api/jogadores/finalizar', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.body.codigo);

        const {
            personagemId,
            orcamento,
            totalGasto,
            saldoRestante,
            quantidadeTotalItens,
            produtos,
            pontuacao
        } = req.body;

        if (!codigo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código da turma não informado.'
            });
        }

        if (
            !personagemId ||
            !personagensPermitidos[personagemId]
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Personagem inválido.'
            });
        }

        const sala = await buscarSalaPorCodigo(codigo);

        if (!sala) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        const jogadorRef = sala.ref
            .collection('jogadores')
            .doc(personagemId);

        const jogadorDoc = await jogadorRef.get();

        if (!jogadorDoc.exists) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Jogador não encontrado.'
            });
        }

        const dadosJogador = jogadorDoc.data();

        let valorOrcamento = Number(orcamento);

        if (
            !Number.isFinite(valorOrcamento) ||
            valorOrcamento <= 0
        ) {
            valorOrcamento = Number(dadosJogador.orcamento) || 50;
        }

        let valorTotalGasto = Number(totalGasto);

        if (!Number.isFinite(valorTotalGasto)) {
            valorTotalGasto = 0;
        }

        let valorSaldoRestante = Number(saldoRestante);

        if (!Number.isFinite(valorSaldoRestante)) {
            valorSaldoRestante = valorOrcamento - valorTotalGasto;
        }

        let quantidadeItens = Number(quantidadeTotalItens);

        if (
            !Number.isFinite(quantidadeItens) ||
            quantidadeItens < 0
        ) {
            quantidadeItens = 0;
        }

        const listaProdutos = Array.isArray(produtos)
            ? produtos
            : [];

        let valorPontuacao = Number(pontuacao);

        if (!Number.isFinite(valorPontuacao)) {
            valorPontuacao = 0;
        }

        valorPontuacao = Math.max(
            0,
            Math.min(100, valorPontuacao)
        );

        await jogadorRef.update({
            finalizou: true,
            quantidadeTotalItens: quantidadeItens,
            totalGasto: valorTotalGasto,
            saldoRestante: valorSaldoRestante,
            produtos: listaProdutos,
            orcamento: valorOrcamento,
            pontuacao: valorPontuacao,
            finalizadoEm: FieldValue.serverTimestamp()
        });

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Partida finalizada com sucesso.',
            jogador: {
                personagemId,
                personagemNome: personagensPermitidos[personagemId].nome,
                quantidadeTotalItens: quantidadeItens,
                totalGasto: valorTotalGasto,
                saldoRestante: valorSaldoRestante,
                pontuacao: valorPontuacao,
                produtos: listaProdutos
            }
        });

    } catch (error) {
        console.error('Erro ao finalizar partida:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar o resultado da partida.'
        });
    }
});

// ======================================================
// BUSCAR JOGADORES PARA O RANKING
// ======================================================

app.get('/api/jogadores/ranking', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.query.codigo);

        if (!codigo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código da turma não informado.'
            });
        }

        const sala = await buscarSalaPorCodigo(codigo);

        if (!sala) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        const jogadoresSnapshot = await sala.ref
            .collection('jogadores')
            .get();

        const jogadores = jogadoresSnapshot.docs.map(documento => {
            const dados = documento.data();

            return {
                id: documento.id,
                personagemId: dados.personagemId || documento.id,
                personagemNome: dados.personagemNome || 'Jogador',
                avatarSeed: dados.avatarSeed || '',
                finalizou: dados.finalizou === true,
                quantidadeTotalItens:
                    Number(dados.quantidadeTotalItens) || 0,
                totalGasto: Number(dados.totalGasto) || 0,
                saldoRestante: Number(dados.saldoRestante) || 0,
                orcamento: Number(dados.orcamento) || 50,
                pontuacao: Number(dados.pontuacao) || 0,
                produtos: Array.isArray(dados.produtos)
                    ? dados.produtos
                    : []
            };
        });

        return res.status(200).json({
            sucesso: true,
            codigo: normalizarCodigo(sala.doc.data().codigo) || codigo,
            totalJogadores: jogadores.length,
            jogadores
        });

    } catch (error) {
        console.error('Erro ao buscar ranking:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao carregar o ranking.'
        });
    }
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

export default app;

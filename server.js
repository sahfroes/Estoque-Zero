
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
// CAMINHO DO SERVIDOR
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
        const keyPath = path.join(
            __dirname,
            'firebase-key.json'
        );

        if (!fs.existsSync(keyPath)) {
            throw new Error(
                'Credenciais do Firebase não encontradas. ' +
                'Verifique o arquivo firebase-key.json.'
            );
        }

        serviceAccount = JSON.parse(
            fs.readFileSync(keyPath, 'utf8')
        );
    }

    if (serviceAccount.private_key) {
        serviceAccount.private_key =
            serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    initializeApp({
        credential: cert(serviceAccount)
    });
}

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

// Preserva o código original para buscar no Firebase.
// A comparação de códigos será feita sem diferenciar
// letras maiúsculas e minúsculas.

function normalizarCodigo(codigo) {
    return String(codigo ?? '').trim();
}

function compararCodigos(a, b) {
    return normalizarCodigo(a).toLowerCase() ===
        normalizarCodigo(b).toLowerCase();
}

function normalizarPin(pin) {
    return String(pin ?? '').trim();
}

// Aceita documentos antigos que usam "ativo"
// e documentos que usam "ativa".
function salaEstaInativa(dados) {
    return dados.ativo === false ||
        dados.ativa === false;
}

// Busca a sala pelo ID do documento ou pelo campo codigo.
async function buscarSalaPorCodigo(codigoRecebido) {
    const codigo = normalizarCodigo(codigoRecebido);

    if (!codigo) {
        return null;
    }

    const salasRef = db.collection('salas');

    const codigosPossiveis = [
        codigo,
        codigo.toLowerCase(),
        codigo.toUpperCase()
    ];

    // 1. Busca pelo ID do documento.
    for (const id of [...new Set(codigosPossiveis)]) {
        const documento = await salasRef.doc(id).get();

        if (documento.exists) {
            const dados = documento.data() || {};
            const codigoSalvo = dados.codigo ?? documento.id;

            if (compararCodigos(codigoSalvo, codigo)) {
                return {
                    ref: documento.ref,
                    dados
                };
            }
        }
    }

    // 2. Busca pelo campo codigo, usando as variações.
    for (const codigoBusca of [...new Set(codigosPossiveis)]) {
        const resultado = await salasRef
            .where('codigo', '==', codigoBusca)
            .limit(1)
            .get();

        if (!resultado.empty) {
            const documento = resultado.docs[0];

            return {
                ref: documento.ref,
                dados: documento.data() || {}
            };
        }
    }

    // 3. Busca documentos com campo codigo em outra
    // combinação de maiúsculas/minúsculas.
    // Útil para salas antigas já cadastradas.
    const todasSalas = await salasRef.get();

    for (const documento of todasSalas.docs) {
        const dados = documento.data() || {};
        const codigoSalvo = dados.codigo ?? documento.id;

        if (compararCodigos(codigoSalvo, codigo)) {
            return {
                ref: documento.ref,
                dados
            };
        }
    }

    return null;
}

function salaNaoEncontrada(res) {
    return res.status(404).json({
        sucesso: false,
        mensagem:
            'Sala não encontrada. Confira o código da sala no Firebase.'
    });
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
// CRIAR SALA
// ======================================================

app.post('/api/salas/criar', async (req, res) => {
    try {
        const codigoOriginal = normalizarCodigo(req.body?.codigo);
        const pin = normalizarPin(req.body?.pin);

        if (!codigoOriginal || !pin) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código e PIN são obrigatórios.'
            });
        }

        // Mantém um padrão para novas salas.
        const codigo = codigoOriginal.toUpperCase();

        // Impede criar uma sala duplicada, mesmo se o
        // código existente estiver em letras minúsculas.
        const existente = await buscarSalaPorCodigo(codigo);

        if (existente) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Já existe uma sala com esse código.'
            });
        }

        const salaRef = db.collection('salas').doc(codigo);

        await salaRef.create({
            codigo,
            pin,
            ativo: true,
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

        if (
            error.code === 6 ||
            error.code === 'already-exists'
        ) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Já existe uma sala com esse código.'
            });
        }

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar a sala.'
        });
    }
});

// ======================================================
// ENTRAR NA SALA COM CÓDIGO E PIN
// ======================================================

app.post('/api/salas/entrar', async (req, res) => {
    try {
        const codigo = normalizarCodigo(req.body?.codigo);
        const pin = normalizarPin(req.body?.pin);

        if (!codigo || !pin) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Código e PIN são obrigatórios.'
            });
        }

        const sala = await buscarSalaPorCodigo(codigo);

        if (!sala) {
            console.warn(
                'Sala não encontrada. Código recebido:',
                codigo
            );

            return salaNaoEncontrada(res);
        }

        if (salaEstaInativa(sala.dados)) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Esta sala não está mais ativa.'
            });
        }

        if (normalizarPin(sala.dados.pin) !== pin) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'PIN incorreto.'
            });
        }

        const codigoRetorno =
            sala.dados.codigo ?? sala.ref.id;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Acesso liberado!',
            codigo: codigoRetorno
        });

    } catch (error) {
        console.error('Erro ao entrar na sala:', error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao verificar a sala.'
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
            return salaNaoEncontrada(res);
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
        const codigo = normalizarCodigo(req.body?.codigo);
        const { personagemId, orcamento } = req.body || {};

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
            return salaNaoEncontrada(res);
        }

        if (salaEstaInativa(sala.dados)) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Esta sala não está mais ativa.'
            });
        }

        const personagem =
            personagensPermitidos[personagemId];

        const jogadorRef = sala.ref
            .collection('jogadores')
            .doc(personagem.id);

        let saldoInicial = Number(orcamento);

        if (
            !Number.isFinite(saldoInicial) ||
            saldoInicial <= 0
        ) {
            saldoInicial = 50;
        }

        await db.runTransaction(async transaction => {
            const jogadorDoc = await transaction.get(jogadorRef);

            if (jogadorDoc.exists) {
                const erro = new Error('PERSONAGEM_OCUPADO');
                erro.codigo = 'PERSONAGEM_OCUPADO';
                throw erro;
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
                mensagem:
                    'Esse personagem já foi escolhido. Escolha outro personagem.'
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
        const body = req.body || {};

        const codigo = normalizarCodigo(body.codigo);

        const {
            personagemId,
            orcamento,
            totalGasto,
            saldoRestante,
            quantidadeTotalItens,
            produtos,
            pontuacao
        } = body;

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
            return salaNaoEncontrada(res);
        }

        const jogadorRef = sala.ref
            .collection('jogadores')
            .doc(personagemId);

        const jogadorDoc = await jogadorRef.get();

        if (!jogadorDoc.exists) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Jogador não encontrado nessa sala.'
            });
        }

        const dadosJogador = jogadorDoc.data() || {};

        let valorOrcamento = Number(orcamento);

        if (
            !Number.isFinite(valorOrcamento) ||
            valorOrcamento <= 0
        ) {
            valorOrcamento =
                Number(dadosJogador.orcamento) || 50;
        }

        let valorTotalGasto = Number(totalGasto);

        if (!Number.isFinite(valorTotalGasto)) {
            valorTotalGasto = 0;
        }

        let valorSaldoRestante = Number(saldoRestante);

        if (!Number.isFinite(valorSaldoRestante)) {
            valorSaldoRestante =
                valorOrcamento - valorTotalGasto;
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
                personagemNome:
                    personagensPermitidos[personagemId].nome,
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
            return salaNaoEncontrada(res);
        }

        const jogadoresSnapshot = await sala.ref
            .collection('jogadores')
            .get();

        const jogadores = jogadoresSnapshot.docs.map(
            documento => {
                const dados = documento.data() || {};

                return {
                    id: documento.id,
                    personagemId:
                        dados.personagemId || documento.id,
                    personagemNome:
                        dados.personagemNome || 'Jogador',
                    avatarSeed: dados.avatarSeed || '',
                    finalizou: dados.finalizou === true,
                    quantidadeTotalItens:
                        Number(dados.quantidadeTotalItens) || 0,
                    totalGasto: Number(dados.totalGasto) || 0,
                    saldoRestante:
                        Number(dados.saldoRestante) || 0,
                    orcamento: Number(dados.orcamento) || 50,
                    pontuacao: Number(dados.pontuacao) || 0,
                    produtos: Array.isArray(dados.produtos)
                        ? dados.produtos
                        : []
                };
            }
        );

        // Jogadores que finalizaram aparecem primeiro.
        // Dentro de cada grupo, maior pontuação fica acima.
        jogadores.sort((a, b) => {
            if (a.finalizou !== b.finalizou) {
                return Number(b.finalizou) -
                    Number(a.finalizou);
            }

            return b.pontuacao - a.pontuacao;
        });

        return res.status(200).json({
            sucesso: true,
            codigo: sala.dados.codigo ?? sala.ref.id,
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
// SERVIDOR
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;

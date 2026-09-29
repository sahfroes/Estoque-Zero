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
// __dirname
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ======================================================
// FIREBASE ADMIN
// ======================================================

if (!getApps().length) {

    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {

        serviceAccount =
            JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT
            );

    } else {

        const keyPath =
            path.join(
                __dirname,
                'firebase-key.json'
            );

        if (fs.existsSync(keyPath)) {

            serviceAccount =
                JSON.parse(
                    fs.readFileSync(
                        keyPath,
                        'utf8'
                    )
                );

        } else {

            throw new Error(
                'Credenciais do Firebase não encontradas.'
            );
        }
    }


    // ------------------------------------------
    // Corrigir quebra de linha da chave privada
    // ------------------------------------------

    if (serviceAccount.private_key) {

        serviceAccount.private_key =
            serviceAccount.private_key.replace(
                /\\n/g,
                '\n'
            );
    }


    initializeApp({
        credential: cert(serviceAccount)
    });
}


// ======================================================
// FIRESTORE
// ======================================================

const db = getFirestore();


// ======================================================
// EXPRESS
// ======================================================

const app = express();

app.use(express.json());

app.use(cors());


// ======================================================
// ARQUIVOS ESTÁTICOS
// ======================================================

app.use(
    express.static(
        path.join(
            __dirname,
            'www'
        ),
        {
            index: false
        }
    )
);


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

app.post(
    '/api/salas/entrar',
    async (req, res) => {

        try {

            const {
                codigo,
                pin
            } = req.body;


            if (!codigo || !pin) {

                return res.status(400).json({
                    mensagem:
                        'Código e PIN são obrigatórios.'
                });

            }


            const codigoFormatado =
                String(codigo)
                    .trim()
                    .toUpperCase();


            const salaRef =
                db
                    .collection('salas')
                    .doc(codigoFormatado);


            const doc =
                await salaRef.get();


            if (!doc.exists) {

                return res.status(404).json({
                    mensagem:
                        'Sala não encontrada.'
                });

            }


            const salaData =
                doc.data();


            if (!salaData.ativa) {

                return res.status(403).json({
                    mensagem:
                        'Esta sala não está mais ativa.'
                });

            }


            if (
                salaData.pin !==
                String(pin).trim()
            ) {

                return res.status(401).json({
                    mensagem:
                        'PIN incorreto.'
                });

            }


            return res.status(200).json({

                sucesso: true,

                mensagem:
                    'Acesso liberado!',

                codigo:
                    salaData.codigo

            });


        } catch (error) {

            console.error(
                'Erro ao entrar na sala:',
                error
            );


            return res.status(500).json({
                mensagem:
                    'Erro interno no servidor.'
            });

        }

    }
);


// ======================================================
// CRIAR SALA
// ======================================================

app.post(
    '/api/salas/criar',
    async (req, res) => {

        try {

            const {
                codigo,
                pin
            } = req.body;


            if (!codigo || !pin) {

                return res.status(400).json({
                    mensagem:
                        'Código e PIN são obrigatórios.'
                });

            }


            const codigoFormatado =
                String(codigo)
                    .trim()
                    .toUpperCase();


            const salaRef =
                db
                    .collection('salas')
                    .doc(codigoFormatado);


            await salaRef.set({

                codigo:
                    codigoFormatado,

                pin:
                    String(pin).trim(),

                ativa:
                    true,

                criadoEm:
                    FieldValue.serverTimestamp()

            });


            return res.status(201).json({

                sucesso: true,

                mensagem:
                    'Sala criada com sucesso!'

            });


        } catch (error) {

            console.error(
                'Erro ao criar sala:',
                error
            );


            return res.status(500).json({

                mensagem:
                    'Erro ao criar a sala.'

            });

        }

    }
);


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

app.get(
    '/api/jogadores/ocupados',
    async (req, res) => {

        try {

            const codigo =
                String(
                    req.query.codigo || ''
                )
                    .trim()
                    .toUpperCase();


            if (!codigo) {

                return res.status(400).json({
                    mensagem:
                        'Código da turma não informado.'
                });

            }


            const salaRef =
                db
                    .collection('salas')
                    .doc(codigo);


            const salaDoc =
                await salaRef.get();


            if (!salaDoc.exists) {

                return res.status(404).json({
                    mensagem:
                        'Sala não encontrada.'
                });

            }


            const jogadoresSnapshot =
                await salaRef
                    .collection('jogadores')
                    .get();


            const ocupados =
                jogadoresSnapshot.docs.map(
                    doc => doc.id
                );


            return res.status(200).json({

                sucesso: true,

                ocupados

            });


        } catch (error) {

            console.error(
                'Erro ao buscar jogadores:',
                error
            );


            return res.status(500).json({

                mensagem:
                    'Erro ao buscar personagens ocupados.'

            });

        }

    }
);


// ======================================================
// RESERVAR PERSONAGEM
// ======================================================

app.post(
    '/api/jogadores/entrar',
    async (req, res) => {

        try {

            const {
                codigo,
                personagemId,
                orcamento
            } = req.body;


            // ------------------------------------------
            // VALIDAR SALA
            // ------------------------------------------

            if (!codigo) {

                return res.status(400).json({

                    mensagem:
                        'Código da turma não informado.'

                });

            }


            const codigoFormatado =
                String(codigo)
                    .trim()
                    .toUpperCase();


            // ------------------------------------------
            // VALIDAR PERSONAGEM
            // ------------------------------------------

            if (
                !personagemId ||
                !personagensPermitidos[personagemId]
            ) {

                return res.status(400).json({

                    mensagem:
                        'Personagem inválido.'

                });

            }


            const personagem =
                personagensPermitidos[
                    personagemId
                ];


            // ------------------------------------------
            // VERIFICAR SALA
            // ------------------------------------------

            const salaRef =
                db
                    .collection('salas')
                    .doc(codigoFormatado);


            const salaDoc =
                await salaRef.get();


            if (!salaDoc.exists) {

                return res.status(404).json({

                    mensagem:
                        'Sala não encontrada.'

                });

            }


            // ------------------------------------------
            // REFERÊNCIA DO JOGADOR
            // ------------------------------------------

            const jogadorRef =
                salaRef
                    .collection('jogadores')
                    .doc(personagem.id);


            // ------------------------------------------
            // TRANSAÇÃO
            // ------------------------------------------

            await db.runTransaction(
                async transaction => {

                    const jogadorDoc =
                        await transaction.get(
                            jogadorRef
                        );


                    if (jogadorDoc.exists) {

                        const erro =
                            new Error(
                                'PERSONAGEM_OCUPADO'
                            );

                        erro.codigo =
                            'PERSONAGEM_OCUPADO';

                        throw erro;

                    }


                    let saldoInicial =
                        Number(orcamento);


                    if (
                        !Number.isFinite(
                            saldoInicial
                        ) ||
                        saldoInicial <= 0
                    ) {

                        saldoInicial = 50;

                    }


                    transaction.create(
                        jogadorRef,
                        {

                            personagemId:
                                personagem.id,

                            personagemNome:
                                personagem.nome,

                            avatarSeed:
                                personagem.seed,

                            finalizou:
                                false,

                            quantidadeTotalItens:
                                0,

                            totalGasto:
                                0,

                            saldoRestante:
                                saldoInicial,

                            produtos:
                                [],

                            orcamento:
                                saldoInicial,

                            criadoEm:
                                FieldValue.serverTimestamp()

                        }
                    );

                }
            );


            // ------------------------------------------
            // SUCESSO
            // ------------------------------------------

            return res.status(201).json({

                sucesso: true,

                mensagem:
                    'Personagem reservado com sucesso.',

                personagem:
                    personagem

            });


        } catch (error) {

            if (
                error.codigo ===
                'PERSONAGEM_OCUPADO'
            ) {

                return res.status(409).json({

                    sucesso: false,

                    codigo:
                        'PERSONAGEM_OCUPADO',

                    mensagem:
                        'Esse personagem já foi escolhido. Escolha outro personagem.'

                });

            }


            console.error(
                'Erro ao reservar personagem:',
                error
            );


            return res.status(500).json({

                mensagem:
                    'Erro ao reservar o personagem.'

            });

        }

    }
);


// ======================================================
// FINALIZAR PARTIDA DO JOGADOR
// ======================================================

app.post(
    '/api/jogadores/finalizar',
    async (req, res) => {

        try {

            const {
                codigo,
                personagemId,
                orcamento,
                totalGasto,
                saldoRestante,
                quantidadeTotalItens,
                produtos
            } = req.body;


            // ------------------------------------------
            // VALIDAR CÓDIGO
            // ------------------------------------------

            if (!codigo) {

                return res.status(400).json({

                    mensagem:
                        'Código da turma não informado.'

                });

            }


            const codigoFormatado =
                String(codigo)
                    .trim()
                    .toUpperCase();


            // ------------------------------------------
            // VALIDAR PERSONAGEM
            // ------------------------------------------

            if (
                !personagemId ||
                !personagensPermitidos[personagemId]
            ) {

                return res.status(400).json({

                    mensagem:
                        'Personagem inválido.'

                });

            }


            // ------------------------------------------
            // VERIFICAR SALA
            // ------------------------------------------

            const salaRef =
                db
                    .collection('salas')
                    .doc(codigoFormatado);


            const salaDoc =
                await salaRef.get();


            if (!salaDoc.exists) {

                return res.status(404).json({

                    mensagem:
                        'Sala não encontrada.'

                });

            }


            // ------------------------------------------
            // REFERÊNCIA DO JOGADOR
            // ------------------------------------------

            const jogadorRef =
                salaRef
                    .collection('jogadores')
                    .doc(personagemId);


            const jogadorDoc =
                await jogadorRef.get();


            if (!jogadorDoc.exists) {

                return res.status(404).json({

                    mensagem:
                        'Jogador não encontrado.'

                });

            }


            // ------------------------------------------
            // NORMALIZAR ORÇAMENTO
            // ------------------------------------------

            let valorOrcamento =
                Number(orcamento);


            if (
                !Number.isFinite(
                    valorOrcamento
                ) ||
                valorOrcamento <= 0
            ) {

                const dadosJogador =
                    jogadorDoc.data();

                valorOrcamento =
                    Number(
                        dadosJogador.orcamento
                    ) || 50;

            }


            // ------------------------------------------
            // NORMALIZAR TOTAL GASTO
            // ------------------------------------------

            let valorTotalGasto =
                Number(totalGasto);


            if (
                !Number.isFinite(
                    valorTotalGasto
                )
            ) {

                valorTotalGasto = 0;

            }


            // ------------------------------------------
            // NORMALIZAR SALDO
            // ------------------------------------------

            let valorSaldoRestante =
                Number(saldoRestante);


            if (
                !Number.isFinite(
                    valorSaldoRestante
                )
            ) {

                valorSaldoRestante =
                    valorOrcamento -
                    valorTotalGasto;

            }


            // ------------------------------------------
            // NORMALIZAR QUANTIDADE
            // ------------------------------------------

            let quantidadeItens =
                Number(
                    quantidadeTotalItens
                );


            if (
                !Number.isFinite(
                    quantidadeItens
                ) ||
                quantidadeItens < 0
            ) {

                quantidadeItens = 0;

            }


            // ------------------------------------------
            // PRODUTOS
            // ------------------------------------------

            const listaProdutos =
                Array.isArray(produtos)
                    ? produtos
                    : [];


            // ------------------------------------------
            // ATUALIZAR JOGADOR
            // ------------------------------------------

            await jogadorRef.update({

                finalizou:
                    true,

                quantidadeTotalItens:
                    quantidadeItens,

                totalGasto:
                    valorTotalGasto,

                saldoRestante:
                    valorSaldoRestante,

                produtos:
                    listaProdutos,

                orcamento:
                    valorOrcamento,

                finalizadoEm:
                    FieldValue.serverTimestamp()

            });


            // ------------------------------------------
            // RESPOSTA
            // ------------------------------------------

            return res.status(200).json({

                sucesso: true,

                mensagem:
                    'Partida finalizada com sucesso.',

                jogador: {

                    personagemId:
                        personagemId,

                    personagemNome:
                        personagensPermitidos[
                            personagemId
                        ].nome,

                    quantidadeTotalItens:
                        quantidadeItens,

                    totalGasto:
                        valorTotalGasto,

                    saldoRestante:
                        valorSaldoRestante,

                    produtos:
                        listaProdutos

                }

            });


        } catch (error) {

            console.error(
                'Erro ao finalizar partida:',
                error
            );


            return res.status(500).json({

                mensagem:
                    'Erro ao salvar o resultado da partida.'

            });

        }

    }
);


// ======================================================
// BUSCAR JOGADORES PARA O RANKING
// ======================================================

app.get(
    '/api/jogadores/ranking',
    async (req, res) => {

        try {

            const codigo =
                String(
                    req.query.codigo || ''
                )
                    .trim()
                    .toUpperCase();


            // ------------------------------------------
            // VERIFICAR CÓDIGO
            // ------------------------------------------

            if (!codigo) {

                return res.status(400).json({

                    mensagem:
                        'Código da turma não informado.'

                });

            }


            // ------------------------------------------
            // REFERÊNCIA DA SALA
            // ------------------------------------------

            const salaRef =
                db
                    .collection('salas')
                    .doc(codigo);


            const salaDoc =
                await salaRef.get();


            if (!salaDoc.exists) {

                return res.status(404).json({

                    mensagem:
                        'Sala não encontrada.'

                });

            }


            // ------------------------------------------
            // BUSCAR JOGADORES
            // ------------------------------------------

            const jogadoresSnapshot =
                await salaRef
                    .collection('jogadores')
                    .get();


            const jogadores =
                jogadoresSnapshot.docs.map(
                    doc => {

                        const dados =
                            doc.data();


                        return {

                            id:
                                doc.id,

                            personagemId:
                                dados.personagemId ||
                                doc.id,

                            personagemNome:
                                dados.personagemNome ||
                                'Jogador',

                            avatarSeed:
                                dados.avatarSeed ||
                                '',

                            finalizou:
                                dados.finalizou === true,

                            quantidadeTotalItens:
                                Number(
                                    dados.quantidadeTotalItens
                                ) || 0,

                            totalGasto:
                                Number(
                                    dados.totalGasto
                                ) || 0,

                            saldoRestante:
                                Number(
                                    dados.saldoRestante
                                ) || 0,

                            orcamento:
                                Number(
                                    dados.orcamento
                                ) || 50,

                            produtos:
                                Array.isArray(
                                    dados.produtos
                                )
                                    ? dados.produtos
                                    : []

                        };

                    }
                );


            // ------------------------------------------
            // RESPOSTA
            // ------------------------------------------

            return res.status(200).json({

                sucesso: true,

                codigo:
                    codigo,

                totalJogadores:
                    jogadores.length,

                jogadores:
                    jogadores

            });


        } catch (error) {

            console.error(
                'Erro ao buscar ranking:',
                error
            );


            return res.status(500).json({

                mensagem:
                    'Erro ao carregar o ranking.'

            });

        }

    }
);


// ======================================================
// SERVIDOR
// ======================================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            `🚀 Servidor rodando em http://localhost:${PORT}`
        );

    }
);


export default app;
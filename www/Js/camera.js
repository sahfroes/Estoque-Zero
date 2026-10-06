// ======================================================
// ELEMENTOS PRINCIPAIS
// ======================================================

const cenaRA = document.getElementById("cena-ra");

const saldoElemento =
    document.getElementById("saldo");

const tempoElemento =
    document.getElementById("tempo");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const botaoTrocarCamera =
    document.getElementById("trocar-camera");

const erroCamera =
    document.getElementById("erro-camera");

const mensagemCamera =
    document.getElementById("mensagem-camera");

const toqueProduto =
    document.getElementById("toque-produto");


// ======================================================
// MODELOS 3D
// IMPORTANTE:
// São as entidades que aparecem na cena.
// ======================================================

const modelos = {

    leite:
        document.getElementById("produto-leite"),

    feijao:
        document.getElementById("produto-feijao"),

    arroz:
        document.getElementById("produto-arroz"),

    macarrao:
        document.getElementById("produto-macarrao"),

    oleo:
        document.getElementById("produto-oleo"),

    acucar:
        document.getElementById("produto-acucar"),

    bombons:
        document.getElementById("produto-bombons"),

    giftcard:
        document.getElementById("produto-giftcard"),

    copo:
        document.getElementById("produto-copo"),

    boneco:
        document.getElementById("produto-boneco")

};


// ======================================================
// PRODUTOS
// ======================================================

const produtos = {

    leite: {
        nome: "Leite UHT Integral 1 L",
        preco: 7.50
    },

    feijao: {
        nome: "Feijão Carioca 1 kg",
        preco: 8.00
    },

    arroz: {
        nome: "Arroz Branco 5 kg",
        preco: 25.00
    },

    macarrao: {
        nome: "Macarrão 500 g",
        preco: 5.00
    },

    oleo: {
        nome: "Óleo de Soja 900 ml",
        preco: 8.00
    },

    acucar: {
        nome: "Açúcar Refinado 1 kg",
        preco: 5.00
    },

    bombons: {
        nome: "Caixa de Bombons",
        preco: 12.00
    },

    giftcard: {
        nome: "Gift Card",
        preco: 20.00
    },

    copo: {
        nome: "Copo Térmico",
        preco: 15.00
    },

    boneco: {
        nome: "Boneco Colecionável",
        preco: 18.00
    }

};


// ======================================================
// MAPEAMENTO DOS TARGETS
// ======================================================

const produtosPorTarget = {

    0: "leite",

    1: "feijao",

    2: "arroz",

    3: "macarrao",

    4: "oleo",

    5: "acucar",

    6: "bombons",

    7: "giftcard",

    8: "copo",

    9: "boneco"

};


// ======================================================
// VARIÁVEIS
// ======================================================

let produtoDetectado = null;

let produtoAtual = null;

let cameraAtual = "environment";

let abrindoCard = false;

let ultimoToque = 0;


// ======================================================
// FORMATAR PREÇO
// ======================================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ======================================================
// ESCONDER MENSAGEM "INICIANDO CÂMERA"
// ======================================================

function esconderMensagemCamera() {

    if (!mensagemCamera) {
        return;
    }

    mensagemCamera.style.display = "none";

    console.log(
        "✅ Mensagem de carregamento escondida."
    );

}


// ======================================================
// MOSTRAR MENSAGEM "TOQUE NO PRODUTO"
// ======================================================

function mostrarMensagemProduto() {

    if (!toqueProduto) {
        return;
    }

    toqueProduto.classList.add("mostrar");

}


// ======================================================
// ESCONDER MENSAGEM "TOQUE NO PRODUTO"
// ======================================================

function esconderMensagemProduto() {

    if (!toqueProduto) {
        return;
    }

    toqueProduto.classList.remove("mostrar");

}


// ======================================================
// CARREGAR ORÇAMENTO
// ======================================================

function carregarOrcamento() {

    const valorSalvo =
        localStorage.getItem(
            "orcamentoSelecionado"
        );

    const orcamento =
        Number(valorSalvo);

    console.log(
        "💰 Orçamento salvo:",
        valorSalvo
    );

    if (
        !Number.isFinite(orcamento) ||
        orcamento <= 0
    ) {

        console.warn(
            "⚠️ Nenhum orçamento válido."
        );

        if (saldoElemento) {

            saldoElemento.textContent =
                "R$ 0,00";

        }

        return 0;
    }


    if (saldoElemento) {

        saldoElemento.textContent =
            formatarPreco(orcamento);

    }


    console.log(
        "✅ Orçamento carregado:",
        formatarPreco(orcamento)
    );


    return orcamento;

}


// ======================================================
// CARREGAR ORÇAMENTO
// ======================================================

const orcamentoAtual =
    carregarOrcamento();


// ======================================================
// SALVAR PRODUTO
// ======================================================

function salvarProduto(chaveProduto) {

    const produto =
        produtos[chaveProduto];


    if (!produto) {

        console.error(
            "❌ Produto não encontrado:",
            chaveProduto
        );

        return false;

    }


    localStorage.setItem(
        "produtoEncontrado",
        chaveProduto
    );


    localStorage.setItem(
        "nomeProdutoEncontrado",
        produto.nome
    );


    localStorage.setItem(
        "precoProdutoEncontrado",
        String(produto.preco)
    );


    console.log(
        "💾 Produto salvo:",
        produto.nome
    );


    console.log(
        "💰 Preço:",
        formatarPreco(produto.preco)
    );


    return true;

}


// ======================================================
// ABRIR CARD DO PRODUTO
// ======================================================

function abrirCardProduto(chaveProduto) {

    if (abrindoCard) {
        return;
    }


    const produto =
        produtos[chaveProduto];


    if (!produto) {

        console.error(
            "❌ Produto inválido:",
            chaveProduto
        );

        return;

    }


    console.log(
        "================================="
    );

    console.log(
        "🛒 PRODUTO SELECIONADO"
    );

    console.log(
        "Produto:",
        produto.nome
    );

    console.log(
        "Preço:",
        formatarPreco(produto.preco)
    );

    console.log(
        "================================="
    );


    const salvo =
        salvarProduto(chaveProduto);


    if (!salvo) {
        return;
    }


    abrindoCard = true;


    esconderMensagemProduto();


    const url =
        "card-produto.html?produto=" +
        encodeURIComponent(
            chaveProduto
        );


    console.log(
        "➡️ Abrindo:",
        url
    );


    window.location.href = url;

}


// ======================================================
// ESCONDER TODOS OS MODELOS
// ======================================================

function esconderTodosModelos() {

    Object.keys(modelos).forEach(
        function (chaveProduto) {

            const modelo =
                modelos[chaveProduto];


            if (!modelo) {
                return;
            }


            modelo.setAttribute(
                "visible",
                false
            );

        }
    );

}


// ======================================================
// MOSTRAR MODELO
// ======================================================

function mostrarModelo(chaveProduto) {

    esconderTodosModelos();


    const modelo =
        modelos[chaveProduto];


    if (!modelo) {

        console.error(
            "❌ Modelo não encontrado:",
            chaveProduto
        );

        return;

    }


    modelo.setAttribute(
        "visible",
        true
    );


    produtoAtual =
        chaveProduto;


    produtoDetectado =
        chaveProduto;


    console.log(
        "================================="
    );

    console.log(
        "🎯 TARGET RECONHECIDO"
    );

    console.log(
        "Produto:",
        chaveProduto
    );

    console.log(
        "Nome:",
        produtos[chaveProduto].nome
    );

    console.log(
        "================================="
    );


    esconderMensagemCamera();


    mostrarMensagemProduto();

}


// ======================================================
// EVENTOS DO MINDAR
// ======================================================

if (cenaRA) {


    // ==================================================
    // A-FRAME CARREGADO
    // ==================================================

    cenaRA.addEventListener(
        "loaded",
        function () {

            console.log(
                "✅ A-Frame carregado."
            );


            esconderMensagemCamera();

        }
    );


    // ==================================================
    // TARGET ENCONTRADO
    // ==================================================

    cenaRA.addEventListener(
        "targetFound",
        function (evento) {

            const indice =
                evento.targetIndex;


            console.log(
                "🎯 Target encontrado:",
                indice
            );


            const chaveProduto =
                produtosPorTarget[indice];


            if (!chaveProduto) {

                console.warn(
                    "⚠️ Target sem produto:",
                    indice
                );

                return;

            }


            mostrarModelo(
                chaveProduto
            );

        }
    );


    // ==================================================
    // TARGET PERDIDO
    // ==================================================

    cenaRA.addEventListener(
        "targetLost",
        function (evento) {

            const indice =
                evento.targetIndex;


            const chaveProduto =
                produtosPorTarget[indice];


            console.log(
                "❌ Target perdido:",
                indice
            );


            /*
             * Esperamos um pouco antes de esconder.
             * Isso evita problemas quando o celular
             * perde o rastreamento por alguns milissegundos.
             */

            setTimeout(
                function () {

                    if (
                        produtoDetectado ===
                        chaveProduto
                    ) {

                        if (
                            modelos[chaveProduto]
                        ) {

                            modelos[
                                chaveProduto
                            ].setAttribute(
                                "visible",
                                false
                            );

                        }


                        produtoDetectado =
                            null;


                        produtoAtual =
                            null;


                        esconderMensagemProduto();

                    }

                },
                700
            );

        }
    );

}


// ======================================================
// CLIQUE / TOQUE NA ÁREA DA CÂMERA
// ======================================================

function selecionarProdutoDetectado() {

    if (abrindoCard) {
        return;
    }


    if (!produtoDetectado) {

        console.log(
            "⚠️ Nenhum produto reconhecido ainda."
        );

        return;

    }


    console.log(
        "👆 Toque recebido."
    );


    console.log(
        "🎯 Produto atualmente reconhecido:",
        produtoDetectado
    );


    abrirCardProduto(
        produtoDetectado
    );

}


// ======================================================
// CONFIGURAR TOQUE / CLIQUE
// ======================================================

function configurarToqueCamera() {

    if (!cenaRA) {

        console.error(
            "❌ Cena AR não encontrada."
        );

        return;

    }


    function configurar() {

        const canvas =
            cenaRA.canvas;


        if (!canvas) {

            console.warn(
                "⚠️ Canvas ainda não disponível."
            );


            setTimeout(
                configurar,
                500
            );


            return;

        }


        console.log(
            "✅ Canvas encontrado."
        );


        // ==================================================
        // DESKTOP
        // ==================================================

        canvas.addEventListener(
            "click",
            function (evento) {

                console.log(
                    "🖱️ CLIQUE NO DESKTOP"
                );


                selecionarProdutoDetectado();

            }
        );


        // ==================================================
        // CELULAR
        // ==================================================

        canvas.addEventListener(
            "touchend",
            function (evento) {

                console.log(
                    "📱 TOQUE NO CELULAR"
                );


                selecionarProdutoDetectado();


                /*
                 * Impede o navegador de interpretar
                 * o toque como outra ação.
                 */

                evento.preventDefault();

            },
            {
                passive: false
            }
        );


        console.log(
            "✅ Clique e toque configurados."
        );

    }


    if (cenaRA.hasLoaded) {

        configurar();

    }
    else {

        cenaRA.addEventListener(
            "loaded",
            configurar
        );

    }

}


// ======================================================
// CONFIGURAR INTERAÇÃO
// ======================================================

configurarToqueCamera();


// ======================================================
// BOTÃO CARRINHO
// ======================================================

if (botaoCarrinho) {

    botaoCarrinho.addEventListener(
        "click",
        function () {

            console.log(
                "🛒 Abrindo carrinho..."
            );


            window.location.href =
                "carrinho.html";

        }
    );

}


// ======================================================
// TROCAR CÂMERA
// ======================================================

if (botaoTrocarCamera) {

    botaoTrocarCamera.addEventListener(
        "click",
        async function () {

            try {

                console.log(
                    "📷 Trocando câmera..."
                );


                cameraAtual =
                    cameraAtual ===
                    "environment"
                        ? "user"
                        : "environment";


                const sistemaMindAR =
                    cenaRA &&
                    cenaRA.systems
                        ? cenaRA.systems[
                            "mindar-image-system"
                        ]
                        : null;


                if (
                    sistemaMindAR &&
                    sistemaMindAR.stop
                ) {

                    sistemaMindAR.stop();

                }


                await new Promise(
                    function (resolve) {

                        setTimeout(
                            resolve,
                            300
                        );

                    }
                );


                /*
                 * Limpa o produto anterior.
                 */

                produtoDetectado =
                    null;

                produtoAtual =
                    null;


                esconderTodosModelos();

                esconderMensagemProduto();


                if (
                    sistemaMindAR &&
                    sistemaMindAR.start
                ) {

                    await sistemaMindAR.start();

                }


                console.log(
                    "✅ Câmera alterada para:",
                    cameraAtual
                );

            }
            catch (erro) {

                console.error(
                    "❌ Erro ao trocar câmera:",
                    erro
                );

            }

        }
    );

}


// ======================================================
// VERIFICAR CÂMERA
// ======================================================

async function verificarCamera() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        console.error(
            "❌ Navegador não suporta câmera."
        );


        mostrarErroCamera(
            "Seu navegador não suporta o acesso à câmera."
        );


        return;

    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio: false
                }
            );


        stream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );


        console.log(
            "✅ Permissão da câmera disponível."
        );

    }
    catch (erro) {

        console.error(
            "❌ Erro ao acessar câmera:",
            erro
        );


        mostrarErroCamera(
            "Não foi possível acessar a câmera. Verifique a permissão do navegador."
        );

    }

}


// ======================================================
// MOSTRAR ERRO
// ======================================================

function mostrarErroCamera(mensagem) {

    if (!erroCamera) {
        return;
    }


    /*
     * Mantemos o HTML do erro.
     * Apenas alteramos o texto.
     */

    const textoErro =
        document.getElementById(
            "texto-erro"
        );


    if (textoErro) {

        textoErro.textContent =
            mensagem;

    }


    erroCamera.style.display =
        "block";

}


// ======================================================
// ESCONDER ERRO
// ======================================================

function esconderErroCamera() {

    if (!erroCamera) {
        return;
    }


    erroCamera.style.display =
        "none";

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================="
        );

        console.log(
            "📷 ESTOQUE ZERO - CÂMERA AR"
        );

        console.log(
            "================================="
        );


        console.log(
            "💰 Orçamento:",
            formatarPreco(
                orcamentoAtual
            )
        );


        esconderErroCamera();


        /*
         * Segurança:
         * a mensagem "Iniciando câmera..."
         * nunca ficará presa na tela.
         */

        setTimeout(
            function () {

                esconderMensagemCamera();

            },
            3000
        );

    }
);


// ======================================================
// VERIFICAR MODELOS
// ======================================================

console.log(
    "🔍 Verificando modelos 3D..."
);


Object.keys(modelos).forEach(
    function (chaveProduto) {

        if (modelos[chaveProduto]) {

            console.log(
                "✅ Modelo encontrado:",
                chaveProduto
            );

        }
        else {

            console.error(
                "❌ Modelo NÃO encontrado:",
                chaveProduto
            );

        }

    }
);

// ======================================================
// FINAL
// ======================================================

console.log(
    "🚀 camera.js carregado com sucesso."
);
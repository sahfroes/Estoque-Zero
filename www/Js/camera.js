// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const cena =
    document.getElementById("cena-ra");

const mensagemCamera =
    document.getElementById("mensagem-camera");

const toqueProduto =
    document.getElementById("toque-produto");

const erroCamera =
    document.getElementById("erro-camera");

const textoErro =
    document.getElementById("texto-erro");

const tentarNovamente =
    document.getElementById("tentar-novamente");

const botaoCarrinho =
    document.getElementById("botao-carrinho");


// ==========================================
// CONTROLE
// ==========================================

let produtoFoiEncontrado = false;

let produtoAtivo = null;

let targetAtivo = null;

let abrindoCard = false;


// ==========================================
// PRODUTOS
// ==========================================

const produtos = {

    arroz: "Arroz Branco",

    feijao: "Feijão Carioca",

    leite: "Leite UHT",

    macarrao: "Macarrão",

    oleo: "Óleo de Soja",

    acucar: "Açúcar Refinado",

    bombons: "Caixa de Bombons",

    giftcard: "Gift Card",

    copo: "Copo Térmico",

    boneco: "Boneco Colecionável"

};


// ==========================================
// MINDAR
// ==========================================

if (cena) {

    cena.addEventListener(
        "arReady",
        function () {

            console.log(
                "✅ MindAR pronto!"
            );

            if (mensagemCamera) {

                mensagemCamera.style.display =
                    "none";

            }

        }
    );


    cena.addEventListener(
        "arError",
        function (evento) {

            console.error(
                "❌ Erro no MindAR:",
                evento
            );

            mostrarErro(
                "Não foi possível iniciar a realidade aumentada."
            );

        }
    );

}


// ==========================================
// PEGAR TARGETS
// ==========================================

const targets =
    document.querySelectorAll(
        "[mindar-image-target]"
    );


console.log(
    "🔎 Targets encontrados:",
    targets.length
);


// ==========================================
// CONFIGURAR TARGETS
// ==========================================

targets.forEach(
    function (target) {

        // ======================================
        // TARGET ENCONTRADO
        // ======================================

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "🎯 TARGET ENCONTRADO!"
                );


                // -------------------------------
                // PEGAR ID DO PRODUTO
                // -------------------------------

                const produtoEncontrado =
                    target.dataset.produto;


                console.log(
                    "📦 Produto identificado:",
                    produtoEncontrado
                );


                // -------------------------------
                // VERIFICAR PRODUTO
                // -------------------------------

                if (
                    !produtoEncontrado ||
                    !produtos[produtoEncontrado]
                ) {

                    console.error(
                        "❌ Produto não cadastrado:",
                        produtoEncontrado
                    );

                    return;

                }


                // -------------------------------
                // SALVAR PRODUTO
                // -------------------------------

                localStorage.setItem(
                    "produtoEncontrado",
                    produtoEncontrado
                );


                localStorage.setItem(
                    "nomeProdutoEncontrado",
                    produtos[produtoEncontrado]
                );


                console.log(
                    "✅ Produto salvo:",
                    produtoEncontrado
                );


                // -------------------------------
                // GUARDAR TARGET
                // -------------------------------

                targetAtivo =
                    target;


                // -------------------------------
                // PEGAR OBJETO AR
                // -------------------------------

                produtoAtivo =
                    target.querySelector(
                        ".produto-ar"
                    );


                // -------------------------------
                // MARCAR COMO ENCONTRADO
                // -------------------------------

                produtoFoiEncontrado =
                    true;


                console.log(
                    "✨ Produto apareceu em AR!"
                );


                console.log(
                    "👆 Toque na tela para abrir."
                );


                // -------------------------------
                // ESCONDER CARREGAMENTO
                // -------------------------------

                if (mensagemCamera) {

                    mensagemCamera.style.display =
                        "none";

                }


                // -------------------------------
                // MOSTRAR INSTRUÇÃO
                // -------------------------------

                if (toqueProduto) {

                    toqueProduto.classList.add(
                        "mostrar"
                    );

                }

            }
        );


        // ======================================
        // TARGET PERDIDO
        // ======================================

        target.addEventListener(
            "targetLost",
            function () {

                console.log(
                    "👋 Target perdido:",
                    target.dataset.produto
                );


                /*
                 * IMPORTANTE:
                 *
                 * Não apagamos o produto do
                 * localStorage.
                 *
                 * Assim, se o celular perder
                 * o target por alguns segundos,
                 * o produto continua disponível.
                 */

                if (
                    targetAtivo === target
                ) {

                    targetAtivo = null;

                    produtoAtivo = null;

                    produtoFoiEncontrado = false;

                }

            }
        );

    }
);


// ==========================================
// ABRIR CARD DO PRODUTO
// ==========================================

function abrirCardProduto() {

    // --------------------------------------
    // EVITAR DUPLO CLIQUE
    // --------------------------------------

    if (abrindoCard) {

        return;

    }


    // --------------------------------------
    // PEGAR PRODUTO
    // --------------------------------------

    const produto =
        localStorage.getItem(
            "produtoEncontrado"
        );


    // --------------------------------------
    // VERIFICAR
    // --------------------------------------

    if (!produto) {

        console.error(
            "❌ Nenhum produto encontrado."
        );

        return;

    }


    // --------------------------------------
    // VERIFICAR SE EXISTE
    // --------------------------------------

    if (!produtos[produto]) {

        console.error(
            "❌ Produto inválido:",
            produto
        );

        return;

    }


    console.log(
        "🛒 Abrindo card:",
        produto
    );


    // --------------------------------------
    // BLOQUEAR NOVOS TOQUES
    // --------------------------------------

    abrindoCard = true;


    // --------------------------------------
    // ESCONDER INSTRUÇÃO
    // --------------------------------------

    if (toqueProduto) {

        toqueProduto.classList.remove(
            "mostrar"
        );

    }


    // --------------------------------------
    // GARANTIR LOCALSTORAGE
    // --------------------------------------

    localStorage.setItem(
        "produtoEncontrado",
        produto
    );


    // ======================================
    // CRIAR URL DO CARD
    // ======================================

    const urlCard =
        new URL(
            "card-produto.html",
            window.location.href
        );


    // --------------------------------------
    // ENVIAR PRODUTO PELA URL
    // --------------------------------------

    urlCard.searchParams.set(
        "produto",
        produto
    );


    console.log(
        "🔗 URL do card:",
        urlCard.href
    );


    // --------------------------------------
    // ABRIR CARD
    // --------------------------------------

    window.location.href =
        urlCard.href;

}


// ==========================================
// INTERAÇÃO PC + CELULAR
// ==========================================

if (cena) {

    cena.addEventListener(
        "loaded",
        function () {

            console.log(
                "✅ Cena A-Frame carregada!"
            );


            const canvas =
                cena.canvas;


            if (!canvas) {

                console.error(
                    "❌ Canvas do A-Frame não encontrado."
                );

                return;

            }


            console.log(
                "📱🖥️ Interação ativada."
            );


            // ----------------------------------
            // EVITAR GESTOS DO NAVEGADOR
            // ----------------------------------

            canvas.style.touchAction =
                "none";


            // ==================================
            // FUNÇÃO CENTRAL
            // ==================================

            function tocarTela() {

                console.log(
                    "👆 Tela tocada!"
                );


                // --------------------------------
                // PEGAR PRODUTO DO STORAGE
                // --------------------------------

                const produto =
                    localStorage.getItem(
                        "produtoEncontrado"
                    );


                // --------------------------------
                // VERIFICAR
                // --------------------------------

                if (
                    !produto ||
                    !produtos[produto]
                ) {

                    console.log(
                        "⚠️ Nenhum produto válido reconhecido."
                    );

                    return;

                }


                console.log(
                    "🎯 Produto pronto:",
                    produto
                );


                // --------------------------------
                // ABRIR CARD
                // --------------------------------

                abrirCardProduto();

            }


            // ==================================
            // CELULAR
            // ==================================

            canvas.addEventListener(
                "touchend",
                function (evento) {

                    evento.preventDefault();

                    console.log(
                        "📱 Toque detectado."
                    );

                    tocarTela();

                },
                {
                    passive: false
                }
            );


            // ==================================
            // PC
            // ==================================

            canvas.addEventListener(
                "click",
                function () {

                    console.log(
                        "🖱️ Clique detectado."
                    );

                    tocarTela();

                }
            );

        }
    );

}


// ==========================================
// BOTÃO CARRINHO
// ==========================================

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


// ==========================================
// MOSTRAR ERRO
// ==========================================

function mostrarErro(mensagem) {

    // --------------------------------------
    // ESCONDER CARREGAMENTO
    // --------------------------------------

    if (mensagemCamera) {

        mensagemCamera.style.display =
            "none";

    }


    // --------------------------------------
    // MOSTRAR ERRO
    // --------------------------------------

    if (erroCamera) {

        erroCamera.style.display =
            "block";

    }


    // --------------------------------------
    // TEXTO
    // --------------------------------------

    if (textoErro) {

        textoErro.textContent =
            mensagem;

    }

}


// ==========================================
// TENTAR NOVAMENTE
// ==========================================

if (tentarNovamente) {

    tentarNovamente.addEventListener(
        "click",
        function () {

            location.reload();

        }
    );

}


// ==========================================
// ORÇAMENTO
// ==========================================

const valorSalvo =
    localStorage.getItem(
        "orcamentoSelecionado"
    );


const saldoInicial =
    Number(valorSalvo);


const elementoSaldo =
    document.getElementById(
        "saldo"
    );


if (
    elementoSaldo &&
    !isNaN(saldoInicial) &&
    saldoInicial >= 0
) {

    elementoSaldo.textContent =
        "R$ " +
        saldoInicial
            .toFixed(2)
            .replace(".", ",");

}
else if (elementoSaldo) {

    elementoSaldo.textContent =
        "R$ 0,00";

}


// ==========================================
// PÁGINA CARREGADA
// ==========================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "📱 Página da câmera carregada."
        );

        console.log(
            "🔎 Quantidade de targets:",
            targets.length
        );

    }
);
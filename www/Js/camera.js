
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
// CONTROLE DO PRODUTO
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
// MINDAR PRONTO
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
// PEGAR TODOS OS TARGETS
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
        // PRODUTO ENCONTRADO
        // ======================================

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "🎯 TARGET ENCONTRADO!"
                );


                // -------------------------------
                // DESCOBRIR PRODUTO
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
                    "✅ Produto salvo no localStorage:",
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
                    "👆 Toque na tela para abrir o produto."
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
                 * Não apagamos imediatamente
                 * o produto do localStorage.
                 *
                 * Isso evita problemas no celular
                 * durante pequenas perdas do target.
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
    // EVITAR ABRIR DUAS VEZES
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
            "❌ Nenhum produto encontrado no localStorage."
        );

        return;

    }


    console.log(
        "🛒 Abrindo card do produto:",
        produto
    );


    // --------------------------------------
    // GARANTIR QUE O PRODUTO EXISTE
    // --------------------------------------

    if (!produtos[produto]) {

        console.error(
            "❌ Produto inválido:",
            produto
        );

        return;

    }


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
    // ABRIR CARD
    // --------------------------------------

    window.location.href =
        "card-produto.html";

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
                "📱🖥️ Interação ativada para PC e celular."
            );


            // ----------------------------------
            // EVITAR GESTOS DO NAVEGADOR
            // ----------------------------------

            canvas.style.touchAction =
                "none";


            // ==================================
            // FUNÇÃO CENTRAL DE TOQUE
            // ==================================

            function tocarTela() {

                console.log(
                    "👆 Tela tocada!"
                );


                // ------------------------------
                // VERIFICAR PRODUTO
                // ------------------------------

                if (!produtoFoiEncontrado) {

                    console.log(
                        "⚠️ Ainda não existe produto reconhecido."
                    );

                    return;

                }


                // ------------------------------
                // PEGAR PRODUTO SALVO
                // ------------------------------

                const produto =
                    localStorage.getItem(
                        "produtoEncontrado"
                    );


                if (!produto) {

                    console.error(
                        "❌ Produto não encontrado no localStorage."
                    );

                    return;

                }


                console.log(
                    "🎯 Produto pronto para abrir:",
                    produto
                );


                // ------------------------------
                // ABRIR CARD
                // ------------------------------

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
                        "📱 Toque detectado no celular."
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
                        "🖱️ Clique detectado no PC."
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

else if (
    elementoSaldo
) {

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


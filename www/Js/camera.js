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

// ID do produto reconhecido
let produtoIdAtivo = null;

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

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "🎯 TARGET ENCONTRADO!"
                );


                // ==================================
                // PEGAR ID DO PRODUTO
                // ==================================

                const produtoEncontrado =
                    target.dataset.produto;


                console.log(
                    "📦 Produto identificado:",
                    produtoEncontrado
                );


                // ==================================
                // VERIFICAR PRODUTO
                // ==================================

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


                // ==================================
                // GUARDAR PRODUTO NA MEMÓRIA
                // ==================================

                produtoIdAtivo =
                    produtoEncontrado;

                produtoFoiEncontrado =
                    true;


                // ==================================
                // SALVAR TAMBÉM NO LOCALSTORAGE
                // ==================================

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
                    produtoIdAtivo
                );


                // ==================================
                // MENSAGENS
                // ==================================

                if (mensagemCamera) {

                    mensagemCamera.style.display =
                        "none";

                }


                if (toqueProduto) {

                    toqueProduto.classList.add(
                        "mostrar"
                    );

                }


                console.log(
                    "✨ Produto apareceu em AR!"
                );

                console.log(
                    "👆 Toque na tela para abrir."
                );

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
                 * NÃO apagamos produtoIdAtivo.
                 *
                 * Isso é importante no celular.
                 * O MindAR pode perder o produto
                 * por alguns instantes.
                 */

            }
        );

    }
);


// ==========================================
// ABRIR CARD
// ==========================================

function abrirCardProduto() {

    if (abrindoCard) {

        return;

    }


    // ======================================
    // PEGAR PRODUTO DETECTADO
    // ======================================

    const produto =
        produtoIdAtivo;


    console.log(
        "🎯 Produto que será aberto:",
        produto
    );


    // ======================================
    // VERIFICAR
    // ======================================

    if (
        !produto ||
        !produtos[produto]
    ) {

        console.error(
            "❌ Nenhum produto válido encontrado."
        );

        return;

    }


    // ======================================
    // BLOQUEAR DUPLO TOQUE
    // ======================================

    abrindoCard = true;


    // ======================================
    // ESCONDER MENSAGEM
    // ======================================

    if (toqueProduto) {

        toqueProduto.classList.remove(
            "mostrar"
        );

    }


    // ======================================
    // SALVAR
    // ======================================

    localStorage.setItem(
        "produtoEncontrado",
        produto
    );


    // ======================================
    // CRIAR URL
    // ======================================

    const urlCard =
        new URL(
            "card-produto.html",
            window.location.href
        );


    // ======================================
    // MANDAR PRODUTO PELA URL
    // ======================================

    urlCard.searchParams.set(
        "produto",
        produto
    );


    console.log(
        "🔗 Indo para:",
        urlCard.href
    );


    // ======================================
    // ABRIR
    // ======================================

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
                    "❌ Canvas não encontrado."
                );

                return;

            }


            canvas.style.touchAction =
                "none";


            // ==================================
            // TOCAR NA TELA
            // ==================================

            function tocarTela() {

                console.log(
                    "👆 Tela tocada!"
                );


                console.log(
                    "📦 Produto ativo:",
                    produtoIdAtivo
                );


                // ==================================
                // VERIFICAR
                // ==================================

                if (
                    !produtoIdAtivo ||
                    !produtos[produtoIdAtivo]
                ) {

                    console.log(
                        "⚠️ Nenhum produto foi identificado."
                    );

                    return;

                }


                // ==================================
                // ABRIR CARD
                // ==================================

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
                        "📱 Toque detectado!"
                    );

                    tocarTela();

                },
                {
                    passive: false
                }
            );


            // ==================================
            // COMPUTADOR
            // ==================================

            canvas.addEventListener(
                "click",
                function () {

                    console.log(
                        "🖱️ Clique detectado!"
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
// ERRO
// ==========================================

function mostrarErro(mensagem) {

    if (mensagemCamera) {

        mensagemCamera.style.display =
            "none";

    }


    if (erroCamera) {

        erroCamera.style.display =
            "block";

    }


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
    document.getElementById("saldo");


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
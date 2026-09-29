// ==========================================
// ESTOQUE ZERO
// CÂMERA + MINDAR
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const cena =
    document.getElementById("cena-ra");

const mensagemCamera =
    document.getElementById("mensagem-camera");

const toqueProduto =
    document.getElementById("toque-produto");

const botaoAbrirProduto =
    document.getElementById("abrir-produto");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const erroCamera =
    document.getElementById("erro-camera");

const textoErro =
    document.getElementById("texto-erro");

const tentarNovamente =
    document.getElementById("tentar-novamente");

const elementoSaldo =
    document.getElementById("saldo");


// ==========================================
// CONTROLE
// ==========================================

let produtoIdAtivo = null;

let produtoFoiEncontrado = false;

let abrindoCard = false;


// ==========================================
// PRODUTOS
// ==========================================

const produtos = {

    arroz: "Arroz Branco 5 kg",

    feijao: "Feijão Carioca 1 kg",

    leite: "Leite UHT Integral 1 L",

    macarrao: "Macarrão 500 g",

    oleo: "Óleo de Soja 900 ml",

    acucar: "Açúcar Refinado 1 kg",

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


    // ======================================
    // ERRO
    // ======================================

    cena.addEventListener(
        "arError",
        function (evento) {

            console.error(
                "❌ Erro MindAR:",
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
        // PRODUTO ENCONTRADO
        // ======================================

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "🎯 TARGET ENCONTRADO!"
                );


                // ==================================
                // PEGAR PRODUTO
                // ==================================

                const produtoEncontrado =
                    target.dataset.produto;


                console.log(
                    "📦 Produto:",
                    produtoEncontrado
                );


                // ==================================
                // VERIFICAR
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
                // GUARDAR PRODUTO
                // ==================================

                produtoIdAtivo =
                    produtoEncontrado;

                produtoFoiEncontrado =
                    true;


                // ==================================
                // LOCAL STORAGE
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
                    "💾 Produto salvo:",
                    produtoIdAtivo
                );


                // ==================================
                // ESCONDER MENSAGEM
                // ==================================

                if (mensagemCamera) {

                    mensagemCamera.style.display =
                        "none";

                }


                // ==================================
                // MOSTRAR AVISO
                // ==================================

                if (toqueProduto) {

                    toqueProduto.classList.add(
                        "mostrar"
                    );

                    toqueProduto.innerHTML =
                        "<span>" +
                        produtos[produtoEncontrado] +
                        " encontrado!</span>";

                }


                // ==================================
                // MOSTRAR BOTÃO
                // ==================================

                if (botaoAbrirProduto) {

                    botaoAbrirProduto.textContent =
                        "Ver " +
                        produtos[produtoEncontrado];


                    botaoAbrirProduto.classList.add(
                        "mostrar"
                    );

                }


                console.log(
                    "✨ Produto pronto para abrir!"
                );

            }
        );


        // ======================================
        // PRODUTO PERDIDO
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
                 * Isso permite que o usuário
                 * ainda consiga tocar no botão
                 * mesmo se o MindAR perder
                 * o alvo por alguns instantes.
                 */

            }
        );

    }
);


// ==========================================
// ABRIR CARD
// ==========================================

function abrirCardProduto() {

    // ======================================
    // EVITAR DUPLO CLIQUE
    // ======================================

    if (abrindoCard) {

        return;

    }


    // ======================================
    // PEGAR PRODUTO
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
            "❌ Nenhum produto válido."
        );

        return;

    }


    // ======================================
    // BLOQUEAR
    // ======================================

    abrindoCard = true;


    // ======================================
    // SALVAR
    // ======================================

    localStorage.setItem(
        "produtoEncontrado",
        produto
    );


    localStorage.setItem(
        "nomeProdutoEncontrado",
        produtos[produto]
    );


    // ======================================
    // CRIAR URL
    // ======================================

    const urlCard =
        new URL(
            "card-produto.html",
            window.location.href
        );


    urlCard.searchParams.set(
        "produto",
        produto
    );


    console.log(
        "🔗 URL:",
        urlCard.href
    );


    // ======================================
    // IR PARA CARD
    // ======================================

    window.location.href =
        urlCard.href;

}


// ==========================================
// BOTÃO VER PRODUTO
// ==========================================

if (botaoAbrirProduto) {

    botaoAbrirProduto.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            evento.stopPropagation();


            console.log(
                "👆 Botão Ver Produto clicado"
            );


            abrirCardProduto();

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

            window.location.reload();

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


if (
    elementoSaldo &&
    !isNaN(saldoInicial) &&
    saldoInicial >= 0
) {

    elementoSaldo.textContent =
        saldoInicial.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

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
            "📱 Câmera carregada."
        );

        console.log(
            "🔎 Targets:",
            targets.length
        );

    }
);

// ==========================================
// ELEMENTOS
// ==========================================

const cena = document.getElementById("cena-ra");
const mensagemCamera = document.getElementById("mensagem-camera");
const toqueProduto = document.getElementById("toque-produto");
const erroCamera = document.getElementById("erro-camera");
const textoErro = document.getElementById("texto-erro");
const tentarNovamente = document.getElementById("tentar-novamente");

const botaoCarrinho = document.getElementById("botao-carrinho");
const botaoTrocarCamera = document.getElementById("trocar-camera");


// ==========================================
// CONTROLE DO PRODUTO
// ==========================================

let produtoIdAtivo = null;
let abrindoCard = false;


// ==========================================
// PRODUTOS
// ==========================================

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


// ==========================================
// MINDAR PRONTO
// ==========================================

if (cena) {

    cena.addEventListener("arReady", function () {

        console.log("✅ MindAR pronto!");

        if (mensagemCamera) {
            mensagemCamera.style.display = "none";
        }

    });


    cena.addEventListener("arError", function (evento) {

        console.error("❌ Erro no MindAR:", evento);

        mostrarErro(
            "Não foi possível iniciar a realidade aumentada."
        );

    });

}


// ==========================================
// PEGAR TARGETS
// ==========================================

const targets = document.querySelectorAll(
    "[mindar-image-target]"
);

console.log(
    "🔎 Targets encontrados:",
    targets.length
);


// ==========================================
// CONFIGURAR TARGETS
// ==========================================

targets.forEach(function (target) {

    target.addEventListener(
        "targetFound",
        function () {

            const produtoEncontrado =
                target.dataset.produto;

            console.log(
                "🎯 Produto encontrado:",
                produtoEncontrado
            );


            // ----------------------------------
            // VERIFICAR
            // ----------------------------------

            if (
                !produtoEncontrado ||
                !produtos[produtoEncontrado]
            ) {

                console.error(
                    "❌ Produto inválido:",
                    produtoEncontrado
                );

                return;
            }


            // ----------------------------------
            // SALVAR PRODUTO
            // ----------------------------------

            produtoIdAtivo =
                produtoEncontrado;


            localStorage.setItem(
                "produtoEncontrado",
                produtoEncontrado
            );


            localStorage.setItem(
                "nomeProdutoEncontrado",
                produtos[produtoEncontrado].nome
            );


            localStorage.setItem(
                "precoProdutoEncontrado",
                produtos[produtoEncontrado].preco
            );


            console.log(
                "✅ Produto salvo:",
                produtoIdAtivo
            );


            // ----------------------------------
            // ESCONDER MENSAGEM INICIAL
            // ----------------------------------

            if (mensagemCamera) {
                mensagemCamera.style.display = "none";
            }


            // ----------------------------------
            // MOSTRAR TOQUE
            // ----------------------------------

            if (toqueProduto) {

                toqueProduto.classList.add(
                    "mostrar"
                );

            }

        }
    );


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
             * Isso é importante no celular,
             * porque o MindAR pode perder o
             * target temporariamente.
             */

        }
    );

});


// ==========================================
// ABRIR CARD
// ==========================================

function abrirCardProduto() {

    if (abrindoCard) {
        return;
    }


    if (!produtoIdAtivo) {

        console.log(
            "⚠️ Nenhum produto selecionado."
        );

        return;
    }


    if (!produtos[produtoIdAtivo]) {

        console.error(
            "❌ Produto não existe:",
            produtoIdAtivo
        );

        return;
    }


    // --------------------------------------
    // BLOQUEAR DUPLO CLIQUE
    // --------------------------------------

    abrindoCard = true;


    // --------------------------------------
    // SALVAR
    // --------------------------------------

    localStorage.setItem(
        "produtoEncontrado",
        produtoIdAtivo
    );


    // --------------------------------------
    // CAMINHO DO CARD
    // --------------------------------------

    const url =
        new URL(
            "card-produto.html",
            window.location.href
        );


    url.searchParams.set(
        "produto",
        produtoIdAtivo
    );


    console.log(
        "➡️ Abrindo card:",
        url.href
    );


    // --------------------------------------
    // IR PARA CARD
    // --------------------------------------

    window.location.assign(
        url.href
    );

}


// ==========================================
// TOQUE NA TELA
// ==========================================

function configurarToque() {

    const canvas = cena
        ? cena.canvas
        : null;


    if (!canvas) {

        console.log(
            "⚠️ Canvas ainda não disponível."
        );

        return;
    }


    console.log(
        "✅ Canvas configurado para toque."
    );


    canvas.style.touchAction = "manipulation";


    // ======================================
    // TOUCHSTART
    // ======================================

    canvas.addEventListener(
        "touchstart",
        function () {

            console.log(
                "📱 Touch detectado."
            );

        },
        {
            passive: true
        }
    );


    // ======================================
    // TOUCHEND
    // ======================================

    canvas.addEventListener(
        "touchend",
        function (evento) {

            console.log(
                "📱 Toque finalizado."
            );


            if (!produtoIdAtivo) {

                console.log(
                    "⚠️ Nenhum produto identificado."
                );

                return;
            }


            evento.preventDefault();


            abrirCardProduto();

        },
        {
            passive: false
        }
    );


    // ======================================
    // CLICK PC
    // ======================================

    canvas.addEventListener(
        "click",
        function () {

            console.log(
                "🖱️ Clique no canvas."
            );


            if (!produtoIdAtivo) {
                return;
            }


            abrirCardProduto();

        }
    );

}


// ==========================================
// CENA CARREGADA
// ==========================================

if (cena) {

    cena.addEventListener(
        "loaded",
        function () {

            console.log(
                "✅ A-Frame carregado."
            );


            /*
             * Pequeno atraso porque no celular
             * o canvas pode ser criado depois.
             */

            setTimeout(
                configurarToque,
                500
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
        function (evento) {

            evento.preventDefault();
            evento.stopPropagation();


            console.log(
                "🛒 Abrindo carrinho..."
            );


            window.location.assign(
                "carrinho.html"
            );

        }
    );

}


// ==========================================
// TROCAR CÂMERA
// ==========================================

if (botaoTrocarCamera) {

    botaoTrocarCamera.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();
            evento.stopPropagation();

            console.log(
                "🔄 Trocar câmera."
            );

            /*
             * O MindAR possui controle próprio
             * da câmera. Aqui apenas recarregamos
             * a página para reiniciar a câmera.
             */

            window.location.reload();

        }
    );

}


// ==========================================
// ERRO
// ==========================================

function mostrarErro(mensagem) {

    if (mensagemCamera) {
        mensagemCamera.style.display = "none";
    }


    if (erroCamera) {
        erroCamera.style.display = "block";
    }


    if (textoErro) {
        textoErro.textContent = mensagem;
    }

}


// ==========================================
// TENTAR NOVAMENTE
// ==========================================

if (tentarNovamente) {

    tentarNovamente.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            window.location.reload();

        }
    );

}


// ==========================================
// SALDO
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
// LOAD
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


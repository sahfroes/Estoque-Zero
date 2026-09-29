// ==========================================
// ELEMENTOS
// ==========================================

const cena = document.getElementById("cena-ra");

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

const botaoTrocarCamera =
    document.getElementById("trocar-camera");


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

        const produto =
            target.dataset.produto;


        console.log(
            "🎯 Configurando target:",
            produto
        );


        // ======================================
        // PRODUTO ENCONTRADO
        // ======================================

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "🎯 PRODUTO IDENTIFICADO:",
                    produto
                );


                // ------------------------------
                // VERIFICAR PRODUTO
                // ------------------------------

                if (
                    !produto ||
                    !produtos[produto]
                ) {

                    console.error(
                        "❌ Produto inválido:",
                        produto
                    );

                    return;

                }


                // ------------------------------
                // SALVAR PRODUTO ATIVO
                // ------------------------------

                produtoIdAtivo =
                    produto;


                // ------------------------------
                // SALVAR NO LOCALSTORAGE
                // ------------------------------

                localStorage.setItem(
                    "produtoEncontrado",
                    produto
                );


                localStorage.setItem(
                    "nomeProdutoEncontrado",
                    produtos[produto].nome
                );


                localStorage.setItem(
                    "precoProdutoEncontrado",
                    produtos[produto].preco
                );


                console.log(
                    "✅ Produto salvo:",
                    produtoIdAtivo
                );


                // ------------------------------
                // ESCONDER MENSAGEM
                // ------------------------------

                if (mensagemCamera) {

                    mensagemCamera.style.display =
                        "none";

                }


                // ------------------------------
                // MOSTRAR TOQUE
                // ------------------------------

                if (toqueProduto) {

                    toqueProduto.classList.add(
                        "mostrar"
                    );

                }

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
                    produto
                );

                /*
                 * Não limpamos produtoIdAtivo.
                 *
                 * O MindAR pode perder o target
                 * temporariamente no celular.
                 */

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

        console.log(
            "⏳ Card já está sendo aberto."
        );

        return;

    }


    // --------------------------------------
    // VERIFICAR PRODUTO
    // --------------------------------------

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
    // BLOQUEAR NOVOS TOQUES
    // --------------------------------------

    abrindoCard = true;


    // --------------------------------------
    // SALVAR NOVAMENTE
    // --------------------------------------

    localStorage.setItem(
        "produtoEncontrado",
        produtoIdAtivo
    );


    // --------------------------------------
    // CRIAR URL DO CARD
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
    // IR PARA O CARD
    // --------------------------------------

    window.location.assign(
        url.href
    );

}


// ==========================================
// CONFIGURAR TOQUE
// ==========================================

function configurarToque() {

    console.log(
        "📱 Configurando toque..."
    );


    const canvas =
        cena
            ? cena.canvas
            : null;


    // ======================================
    // VERIFICAR CANVAS
    // ======================================

    if (!canvas) {

        console.log(
            "⚠️ Canvas ainda não disponível."
        );

        return;

    }


    console.log(
        "✅ Canvas encontrado."
    );


    // ======================================
    // CONFIGURAÇÃO MOBILE
    // ======================================

    canvas.style.touchAction =
        "manipulation";


    canvas.style.cursor =
        "pointer";


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


            console.log(
                "🛒 Abrindo card do:",
                produtoIdAtivo
            );


            abrirCardProduto();

        },
        {
            passive: false
        }
    );


    // ======================================
    // CLICK PARA COMPUTADOR
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


            console.log(
                "🛒 Abrindo card do:",
                produtoIdAtivo
            );


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
             * O canvas do A-Frame pode demorar
             * um pouco para existir no celular.
             */

            setTimeout(
                configurarToque,
                1000
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


            const urlCarrinho =
                new URL(
                    "carrinho.html",
                    window.location.href
                );


            window.location.assign(
                urlCarrinho.href
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
                "🔄 Trocando câmera..."
            );


            /*
             * O MindAR controla a câmera.
             * Recarregar reinicia a câmera.
             */

            window.location.reload();

        }
    );

}


// ==========================================
// MOSTRAR ERRO
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
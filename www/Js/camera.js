// ==========================================
// ESTOQUE ZERO - CAMERA.JS
// ==========================================


// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const cena =
    document.getElementById("cena-ra");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const elementoTempo =
    document.getElementById("tempo");

const alertaTempo =
    document.getElementById("alerta-tempo");

const elementoTempoContainer =
    document.querySelector(".tempo");


// ==========================================
// PRODUTO ATUAL
// ==========================================

let produtoAtualId = null;

let produtoAtualAR = null;

let produtoFoiEncontrado = false;

let abrindoCard = false;


// ==========================================
// PRODUTOS
// ==========================================

const nomesProdutos = {

    leite: "Leite UHT",

    feijao: "Feijão Carioca",

    arroz: "Arroz Branco",

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
// CONFIGURAR CADA TARGET
// ==========================================

targets.forEach(function (target) {


    // ======================================
    // PRODUTO ENCONTRADO
    // ======================================

    target.addEventListener(
        "targetFound",
        function () {

            const produto =
                target.dataset.produto;


            console.log(
                "🎯 TARGET ENCONTRADO:",
                produto
            );


            // Verifica produto

            if (!produto) {

                console.error(
                    "❌ Target sem data-produto."
                );

                return;

            }


            // Guarda produto atual

            produtoAtualId =
                produto;


            // Procura imagem AR

            produtoAtualAR =
                target.querySelector(
                    ".produto-ar"
                );


            if (!produtoAtualAR) {

                console.error(
                    "❌ .produto-ar não encontrado."
                );

                return;

            }


            // Produto encontrado

            produtoFoiEncontrado =
                true;


            // Salva produto

            localStorage.setItem(
                "produtoEncontrado",
                produto
            );


            localStorage.setItem(
                "nomeProdutoEncontrado",
                nomesProdutos[produto]
            );


            console.log(
                "💾 Produto salvo:",
                produto
            );


            console.log(
                "👆 Toque na imagem do produto!"
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


            if (
                produtoAtualId ===
                target.dataset.produto
            ) {

                produtoAtualId =
                    null;

                produtoAtualAR =
                    null;

                produtoFoiEncontrado =
                    false;

            }

        }
    );

});


// ==========================================
// PRODUTOS AR
// ==========================================

const produtosAR =
    document.querySelectorAll(
        ".produto-ar"
    );


console.log(
    "🖼️ Produtos AR encontrados:",
    produtosAR.length
);


// ==========================================
// CONFIGURAR CLIQUE NAS IMAGENS
// ==========================================

produtosAR.forEach(function (produtoAR) {


    // Torna clicável

    produtoAR.classList.add(
        "clicavel"
    );


    // ======================================
    // CLIQUE
    // ======================================

    produtoAR.addEventListener(
        "click",
        function () {

            console.log(
                "👆 CLIQUE NA IMAGEM AR!"
            );


            // ==================================
            // ENCONTRA O TARGET
            // ==================================

            const target =
                produtoAR.closest(
                    "[mindar-image-target]"
                );


            if (!target) {

                console.error(
                    "❌ Target não encontrado."
                );

                return;

            }


            // ==================================
            // PEGA O PRODUTO
            // ==================================

            const produto =
                target.dataset.produto;


            if (!produto) {

                console.error(
                    "❌ Produto não encontrado."
                );

                return;

            }


            console.log(
                "📦 Produto clicado:",
                produto
            );


            // ==================================
            // SALVA O PRODUTO
            // ==================================

            localStorage.setItem(
                "produtoEncontrado",
                produto
            );


            localStorage.setItem(
                "nomeProdutoEncontrado",
                nomesProdutos[produto]
            );


            console.log(
                "💾 Produto salvo:",
                produto
            );


            // ==================================
            // ABRE O CARD
            // ==================================

            abrirCardProduto();

        }
    );

});


// ==========================================
// ABRIR CARD DO PRODUTO
// ==========================================

function abrirCardProduto() {


    // Evita vários cliques

    if (abrindoCard) {

        return;

    }


    // Pega produto salvo

    const produto =
        localStorage.getItem(
            "produtoEncontrado"
        );


    if (!produto) {

        console.error(
            "❌ Nenhum produto salvo."
        );

        return;

    }


    console.log(
        "🛒 Abrindo card:",
        produto
    );


    // Impede novo clique

    abrindoCard =
        true;


    // ======================================
    // PARA O CRONÔMETRO
    // ======================================

    if (intervaloTempo) {

        clearInterval(
            intervaloTempo
        );

        intervaloTempo =
            null;

    }


    // ======================================
    // ABRE A TELA DO PRODUTO
    // ======================================

    window.location.href =
        "card-produto.html";

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
// CRONÔMETRO
// ==========================================

const DURACAO_MISSAO =
    120;

let tempoRestante =
    DURACAO_MISSAO;

let intervaloTempo =
    null;

let jogoFinalizado =
    false;


// ==========================================
// FORMATAR TEMPO
// ==========================================

function formatarTempo(segundos) {

    const minutos =
        Math.floor(
            segundos / 60
        );


    const segundosRestantes =
        segundos % 60;


    return (

        String(minutos)
            .padStart(2, "0")

        +

        ":"

        +

        String(segundosRestantes)
            .padStart(2, "0")

    );

}


// ==========================================
// MOSTRAR TEMPO
// ==========================================

function mostrarTempo() {

    if (!elementoTempo) {

        console.error(
            "❌ #tempo não existe no HTML."
        );

        return;

    }


    elementoTempo.textContent =
        formatarTempo(
            tempoRestante
        );

}


// ==========================================
// ATUALIZAR TEMPO
// ==========================================

function atualizarTempo() {


    tempoRestante--;


    // Evita negativo

    if (
        tempoRestante < 0
    ) {

        tempoRestante =
            0;

    }


    // Atualiza tela

    mostrarTempo();


    // ======================================
    // ALERTA DOS 10 SEGUNDOS
    // ======================================

    if (
        tempoRestante <= 10 &&
        tempoRestante > 0
    ) {

        if (alertaTempo) {

            alertaTempo.style.display =
                "block";

        }


        if (elementoTempoContainer) {

            elementoTempoContainer.classList.add(
                "tempo-critico"
            );

        }

    }


    // ======================================
    // TEMPO ACABOU
    // ======================================

    if (
        tempoRestante === 0
    ) {

        finalizarJogo();

    }

}


// ==========================================
// INICIAR CRONÔMETRO
// ==========================================

function iniciarCronometro() {

    console.log(
        "⏱️ CRONÔMETRO: 02:00"
    );


    tempoRestante =
        DURACAO_MISSAO;


    mostrarTempo();


    // Evita dois intervalos

    if (intervaloTempo) {

        clearInterval(
            intervaloTempo
        );

    }


    intervaloTempo =
        setInterval(
            atualizarTempo,
            1000
        );

}


// ==========================================
// FINALIZAR JOGO
// ==========================================

function finalizarJogo() {


    // Evita finalizar duas vezes

    if (jogoFinalizado) {

        return;

    }


    jogoFinalizado =
        true;


    // Para cronômetro

    if (intervaloTempo) {

        clearInterval(
            intervaloTempo
        );

        intervaloTempo =
            null;

    }


    console.log(
        "⏰ TEMPO ESGOTADO!"
    );


    // ======================================
    // MOSTRA ALERTA
    // ======================================

    if (alertaTempo) {

        alertaTempo.style.display =
            "block";


        alertaTempo.innerHTML = `

            <div class="icone-alerta">
                ⏰
            </div>

            <strong>
                Tempo esgotado!
            </strong>

            <span>
                Suas compras foram finalizadas.
            </span>

        `;

    }


    // ======================================
    // VAI PARA VITÓRIA
    // ======================================

    setTimeout(
        function () {

            window.location.href =
                "vitoria.html";

        },
        3000
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
    Number(
        valorSalvo
    );


const elementoSaldo =
    document.getElementById(
        "saldo"
    );


if (
    elementoSaldo &&
    !isNaN(saldoInicial)
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


// ==========================================
// COMEÇAR
// ==========================================

iniciarCronometro();
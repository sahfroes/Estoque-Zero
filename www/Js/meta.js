// ========================================
// VARIÁVEIS DO JOGO
// ========================================

// Dinheiro disponível para o jogador
let saldo = 50.00;

// Total de dinheiro que já foi gasto
let saldoGasto = 0.00;

// Quantidade de compras realizadas
let comprasRealizadas = 0;

// Quantidade máxima de compras
const limiteCompras = 10;

// Tempo inicial da missão
let tempoRestante = 120;

// Pontuação inicial
let pontuacao = 0;


// ========================================
// ELEMENTOS DA TELA
// ========================================

const elementoSaldo =
    document.getElementById("saldo");

const elementoSaldoGasto =
    document.getElementById("saldo-gasto");

const elementoCompras =
    document.getElementById("compras-realizadas");

const elementoCronometro =
    document.getElementById("cronometro");

const elementoPontuacao =
    document.getElementById("pontuacao");

const elementoMensagem =
    document.getElementById("mensagem");

const botaoAdicionar =
    document.getElementById("botao-adicionar");

const botaoMissao =
    document.getElementById("botao-missao");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const botaoContador =
    document.getElementById("botao-contador");

const botaoPerfil =
    document.getElementById("botao-perfil");


// ========================================
// FORMATAR DINHEIRO
// ========================================

function formatarDinheiro(valor) {

    return `R$ ${valor
        .toFixed(2)
        .replace(".", ",")}`;

}


// ========================================
// ATUALIZAR SALDO
// ========================================

function atualizarSaldo() {

    elementoSaldo.textContent =
        formatarDinheiro(saldo);

}


// ========================================
// ATUALIZAR SALDO GASTO
// ========================================

function atualizarSaldoGasto() {

    elementoSaldoGasto.textContent =
        formatarDinheiro(saldoGasto);

}


// ========================================
// ATUALIZAR COMPRAS
// ========================================

function atualizarCompras() {

    elementoCompras.textContent =
        `${comprasRealizadas}/${limiteCompras}`;

}


// ========================================
// ATUALIZAR PONTUAÇÃO
// ========================================

function atualizarPontuacao() {

    elementoPontuacao.textContent =
        pontuacao;

}


// ========================================
// ADICIONAR R$50
// ========================================

botaoAdicionar.addEventListener(
    "click",
    function () {

        saldo += 50;

        atualizarSaldo();

        mostrarMensagem(
            "R$ 50,00 adicionados ao seu saldo!"
        );

    }
);


// ========================================
// COMEÇAR MISSÃO
// ========================================

botaoMissao.addEventListener(
    "click",
    function () {

        mostrarMensagem(
            "Prepare-se! A câmera será iniciada."
        );


        // Depois vamos substituir isso
        // pela tela real da câmera.

        setTimeout(function () {

            window.location.href =
                "camera.html";

        }, 1000);

    }
);


// ========================================
// BOTÃO CARRINHO
// ========================================

botaoCarrinho.addEventListener(
    "click",
    function () {

        mostrarMensagem(
            "O carrinho será aberto aqui."
        );

    }
);


// ========================================
// BOTÃO CONTADOR
// ========================================

botaoContador.addEventListener(
    "click",
    function () {

        mostrarMensagem(
            `Tempo restante: ${elementoCronometro.textContent}`
        );

    }
);


// ========================================
// BOTÃO PERFIL
// ========================================

botaoPerfil.addEventListener(
    "click",
    function () {

        window.location.href =
            "perfil.html";

    }
);


// ========================================
// MOSTRAR MENSAGEM
// ========================================

function mostrarMensagem(texto) {

    elementoMensagem.textContent =
        texto;

    elementoMensagem.classList.add(
        "mostrar"
    );


    setTimeout(function () {

        elementoMensagem.classList.remove(
            "mostrar"
        );

    }, 2500);

}


// ========================================
// ATUALIZAR CRONÔMETRO
// ========================================

function atualizarCronometro() {

    const minutos =
        Math.floor(tempoRestante / 60);

    const segundos =
        tempoRestante % 60;


    elementoCronometro.textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;


    // Se o tempo acabou
    if (tempoRestante <= 0) {

        clearInterval(
            intervaloCronometro
        );


        mostrarMensagem(
            "⏰ O tempo acabou!"
        );


        return;
    }


    tempoRestante--;

}


// ========================================
// INICIAR CRONÔMETRO
// ========================================

const intervaloCronometro =
    setInterval(
        atualizarCronometro,
        1000
    );


// ========================================
// INICIALIZAR TELA
// ========================================

atualizarSaldo();

atualizarSaldoGasto();

atualizarCompras();

atualizarPontuacao();

atualizarCronometro();
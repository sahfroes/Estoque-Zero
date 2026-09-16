/* =====================================
   ESTOQUE ZERO
   JAVASCRIPT DA TELA DE RESULTADO
===================================== */


/* =========================
   CONFIGURAÇÕES
========================= */

const ORCAMENTO_INICIAL = 50;


/* =========================
   PEGAR ELEMENTOS
========================= */

const orcamentoElemento =
    document.getElementById(
        "orcamentoInicial"
    );


const gastoElemento =
    document.getElementById(
        "totalGasto"
    );


const saldoElemento =
    document.getElementById(
        "saldoRestante"
    );


const comprasElemento =
    document.getElementById(
        "quantidadeCompras"
    );


const pontuacaoElemento =
    document.getElementById(
        "pontuacao"
    );


const desempenhoElemento =
    document.getElementById(
        "mensagemDesempenho"
    );


/* =========================
   PEGAR SALDO
========================= */

let saldo = Number(
    localStorage.getItem(
        "estoqueZeroSaldo"
    )
);


/*
   Caso não exista saldo,
   usamos R$ 50,00.
*/

if (Number.isNaN(saldo)) {

    saldo = ORCAMENTO_INICIAL;

}


/* =========================
   CALCULAR GASTO
========================= */

const totalGasto =
    ORCAMENTO_INICIAL - saldo;


/* =========================
   PEGAR COMPRAS
========================= */

let compras = [];


try {

    compras = JSON.parse(
        localStorage.getItem(
            "estoqueZeroCompras"
        )
    ) || [];

}
catch (erro) {

    compras = [];

}


/* =========================
   PONTUAÇÃO
========================= */


/*
   Quanto mais dinheiro
   guardar, maior a pontuação.
*/

const porcentagemGuardada =
    saldo / ORCAMENTO_INICIAL;


let pontuacao =
    Math.round(
        porcentagemGuardada * 100
    );


/*
   Bônus por realizar compras.
*/

pontuacao +=
    compras.length * 5;


/*
   Limita a pontuação
   entre 0 e 100.
*/

pontuacao =
    Math.max(
        0,
        Math.min(
            100,
            pontuacao
        )
    );


/* =========================
   FORMATAR DINHEIRO
========================= */

function dinheiro(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================
   MOSTRAR RESULTADO
========================= */

orcamentoElemento.textContent =
    dinheiro(
        ORCAMENTO_INICIAL
    );


gastoElemento.textContent =
    dinheiro(
        totalGasto
    );


saldoElemento.textContent =
    dinheiro(
        saldo
    );


comprasElemento.textContent =
    compras.length;


pontuacaoElemento.textContent =
    pontuacao +
    " pontos";


/* =========================
   MENSAGEM
========================= */

if (saldo >= 25) {

    desempenhoElemento.textContent =
        "🌟 Excelente! Você conseguiu guardar uma boa parte do seu dinheiro.";

}

else if (saldo > 0) {

    desempenhoElemento.textContent =
        "💜 Muito bem! Você gastou, mas ainda conseguiu guardar dinheiro.";

}

else {

    desempenhoElemento.textContent =
        "⚠️ Você gastou todo o orçamento. Na próxima missão, tente guardar uma reserva.";

}


/* =========================
   RANKING
========================= */

function verRanking() {

    /*
       Por enquanto vamos
       apenas para uma página
       chamada ranking.html.
    */

    window.location.href =
        "ranking.html";

}


/* =========================
   VOLTAR
========================= */

function voltarInicio() {

    /*
       Volta para a página
       inicial do projeto.
    */

    window.location.href =
        "index.html";

}
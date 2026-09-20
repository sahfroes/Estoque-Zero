
/* =========================
   PEGAR DADOS DO JOGADOR
========================= */

const saldo =
    Number(
        localStorage.getItem(
            "estoqueZeroSaldo"
        )
    ) || 50;

/* =========================
   COMPRAS
========================= */

let compras = [];


try {

    compras =
        JSON.parse(
            localStorage.getItem(
                "estoqueZeroCompras"
            )
        ) || [];

}
catch (erro) {

    compras = [];

}

/* =========================
   CALCULAR PONTUAÇÃO
========================= */

const ORCAMENTO = 50;

/*
   Quanto mais dinheiro
   sobrar, maior a pontuação.
*/

const dinheiroGuardado =
    saldo / ORCAMENTO;


let pontuacao =
    Math.round(
        dinheiroGuardado * 100
    );

/*
   Pequeno bônus por participar.
*/

pontuacao +=
    compras.length * 5;

/*
   Limitar a 100 pontos.
*/

pontuacao =
    Math.min(
        100,
        pontuacao
    );


/* =========================
   MOSTRAR PONTUAÇÃO
========================= */

document.getElementById(
    "minhaPontuacao"
).textContent =
    pontuacao;


/* =========================
   POSIÇÃO
========================= */


/*
   Por enquanto é uma posição
   de exemplo.

   Depois podemos calcular
   automaticamente com os
   alunos reais da turma.
*/

document.getElementById(
    "minhaPosicao"
).textContent =
    "6º lugar";


/* =========================
   VOLTAR PARA RESULTADO
========================= */

function voltarResultado() {

    window.location.href =
        "vitoria.html";

}


/* =========================
   VOLTAR PARA INÍCIO
========================= */

function voltarInicio() {

    /*
       Altere para o nome
       da sua página inicial
       caso seja diferente.
    */

    window.location.href =
        "orcamento.html";

}
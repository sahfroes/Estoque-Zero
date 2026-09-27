/* =====================================
   ESTOQUE ZERO
   JAVASCRIPT DA TELA DE RESULTADO
===================================== */


/* =========================
   PEGAR ELEMENTOS
========================= */

const orcamentoElemento =
    document.getElementById("orcamentoInicial");

const gastoElemento =
    document.getElementById("totalGasto");

const saldoElemento =
    document.getElementById("saldoRestante");

const comprasElemento =
    document.getElementById("quantidadeCompras");

const pontuacaoElemento =
    document.getElementById("pontuacao");

const desempenhoElemento =
    document.getElementById("mensagemDesempenho");


/* =========================
   PEGAR ORÇAMENTO
========================= */

// Pega o orçamento escolhido pelo aluno
const orcamento =
    Number(
        localStorage.getItem("orcamentoSelecionado")
    ) || 0;


/* =========================
   PEGAR RESULTADOS
========================= */

// Pega o total calculado pelo carrinho
const totalGasto =
    Number(
        localStorage.getItem("totalGasto")
    ) || 0;


// Pega o saldo calculado pelo carrinho
const saldo =
    Number(
        localStorage.getItem("saldoFinal")
    );


/* =========================
   PEGAR CARRINHO
========================= */

let carrinho = [];

try {

    carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

} catch (erro) {

    console.error(
        "Erro ao carregar carrinho:",
        erro
    );

    carrinho = [];

}


/* =========================
   CALCULAR QUANTIDADE
========================= */

let quantidadeCompras = 0;


carrinho.forEach(function(produto) {

    quantidadeCompras +=
        Number(produto.quantidade) || 1;

});


/* =========================
   CALCULAR SALDO
========================= */

let saldoFinal = saldo;


// Caso saldoFinal não exista,
// calcula novamente
if (Number.isNaN(saldoFinal)) {

    saldoFinal =
        orcamento - totalGasto;

}

/* =========================
   PONTUAÇÃO
========================= */

// Quanto mais dinheiro guardar,
// maior a pontuação.

let pontuacao = 0;


if (orcamento > 0) {

    const porcentagemGuardada =
        saldoFinal / orcamento;

    pontuacao =
        Math.round(
            porcentagemGuardada * 100
        );

}

/* =========================
   LIMITAR PONTUAÇÃO
========================= */

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

    return Number(valor).toLocaleString(
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
    dinheiro(orcamento);


gastoElemento.textContent =
    dinheiro(totalGasto);


saldoElemento.textContent =
    dinheiro(saldoFinal);


comprasElemento.textContent =
    quantidadeCompras;


pontuacaoElemento.textContent =
    pontuacao + " pontos";


/* =========================
   MENSAGEM
========================= */

if (saldoFinal >= orcamento * 0.5) {

    desempenhoElemento.textContent =
        "🌟 Excelente! Você conseguiu guardar uma boa parte do seu dinheiro.";

}

else if (saldoFinal > 0) {

    desempenhoElemento.textContent =
        "💜 Muito bem! Você gastou, mas ainda conseguiu guardar dinheiro.";

}

else {

    desempenhoElemento.textContent =
        "⚠️ Você gastou todo o orçamento. Na próxima missão, tente guardar uma reserva.";

}

/* =========================
   DEBUG
========================= */

console.log("📊 RESULTADO FINAL");
console.log("Orçamento:", orcamento);
console.log("Total gasto:", totalGasto);
console.log("Saldo:", saldoFinal);
console.log("Compras:", quantidadeCompras);
console.log("Carrinho:", carrinho);

/* =========================
   RANKING
========================= */

function verRanking() {

    window.location.href =
        "ranking.html";

}

/* =========================
   VOLTAR
========================= */

function voltarInicio() {

    window.location.href =
        "orcamento.html";

}
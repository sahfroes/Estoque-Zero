/* =====================================
   ESTOQUE ZERO
   JAVASCRIPT DA TELA DE RESULTADO
===================================== */


// =====================================
// ELEMENTOS DO HTML
// =====================================

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


// =====================================
// PEGAR ORÇAMENTO
// =====================================

const valorOrcamento =
    localStorage.getItem(
        "orcamentoSelecionado"
    );


const orcamento =
    Number(valorOrcamento) || 0;


console.log(
    "💰 Orçamento:",
    orcamento
);


// =====================================
// PEGAR TOTAL GASTO
// =====================================

const valorTotal =
    localStorage.getItem(
        "totalGasto"
    );


const totalGasto =
    Number(valorTotal) || 0;


console.log(
    "💸 Total gasto:",
    totalGasto
);


// =====================================
// PEGAR SALDO
// =====================================

const valorSaldo =
    localStorage.getItem(
        "saldoFinal"
    );


// IMPORTANTE:
// Não usamos Number(null),
// porque null vira 0.

// Se não existir saldo salvo,
// calculamos novamente.

let saldoFinal;


if (
    valorSaldo !== null &&
    valorSaldo !== ""
) {

    saldoFinal =
        Number(valorSaldo);

} else {

    saldoFinal =
        orcamento - totalGasto;

}


console.log(
    "💵 Saldo final:",
    saldoFinal
);


// =====================================
// PEGAR CARRINHO
// =====================================

let carrinho = [];


try {

    const carrinhoSalvo =
        localStorage.getItem(
            "carrinho"
        );


    if (carrinhoSalvo) {

        carrinho =
            JSON.parse(
                carrinhoSalvo
            );

    } else {

        carrinho = [];

    }

} catch (erro) {

    console.error(
        "❌ Erro ao carregar carrinho:",
        erro
    );

    carrinho = [];

}


console.log(
    "🛒 Carrinho:",
    carrinho
);


// =====================================
// CALCULAR QUANTIDADE DE COMPRAS
// =====================================

let quantidadeCompras = 0;


carrinho.forEach(
    function (produto) {

        quantidadeCompras +=
            Number(
                produto.quantidade
            ) || 1;

    }
);


console.log(
    "🛍️ Quantidade de compras:",
    quantidadeCompras
);


// =====================================
// CALCULAR PONTUAÇÃO
// =====================================

let pontuacao = 0;


if (orcamento > 0) {

    const porcentagemGuardada =
        saldoFinal / orcamento;


    pontuacao =
        Math.round(
            porcentagemGuardada * 100
        );

}


// =====================================
// LIMITAR PONTUAÇÃO
// =====================================

pontuacao =
    Math.max(
        0,
        Math.min(
            100,
            pontuacao
        )
    );


// =====================================
// FORMATAR DINHEIRO
// =====================================

function dinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =====================================
// MOSTRAR RESULTADO
// =====================================

if (orcamentoElemento) {

    orcamentoElemento.textContent =
        dinheiro(orcamento);

}


if (gastoElemento) {

    gastoElemento.textContent =
        dinheiro(totalGasto);

}


if (saldoElemento) {

    saldoElemento.textContent =
        dinheiro(saldoFinal);

}


if (comprasElemento) {

    comprasElemento.textContent =
        quantidadeCompras;

}


if (pontuacaoElemento) {

    pontuacaoElemento.textContent =
        pontuacao + " pontos";

}


// =====================================
// MENSAGEM DE DESEMPENHO
// =====================================

if (desempenhoElemento) {


    if (
        saldoFinal >=
        orcamento * 0.5
    ) {

        desempenhoElemento.textContent =
            "🌟 Excelente! Você conseguiu guardar uma boa parte do seu dinheiro.";

    }


    else if (
        saldoFinal > 0
    ) {

        desempenhoElemento.textContent =
            "💜 Muito bem! Você gastou, mas ainda conseguiu guardar dinheiro.";

    }


    else {

        desempenhoElemento.textContent =
            "⚠️ Você gastou todo o orçamento. Na próxima missão, tente guardar uma reserva.";

    }

}


// =====================================
// DEBUG
// =====================================

console.log(
    "================================="
);

console.log(
    "📊 RESULTADO FINAL"
);

console.log(
    "Orçamento:",
    orcamento
);

console.log(
    "Total gasto:",
    totalGasto
);

console.log(
    "Saldo:",
    saldoFinal
);

console.log(
    "Compras:",
    quantidadeCompras
);

console.log(
    "Pontuação:",
    pontuacao
);

console.log(
    "Carrinho:",
    carrinho
);

console.log(
    "================================="
);


// =====================================
// RANKING
// =====================================

function verRanking() {

    window.location.href =
        "ranking.html";

}


// =====================================
// VOLTAR
// =====================================

function voltarInicio() {

    // Limpa a partida anterior
    // somente quando voltar
    // para começar uma nova.

    localStorage.removeItem(
        "carrinho"
    );

    localStorage.removeItem(
        "totalGasto"
    );

    localStorage.removeItem(
        "saldoFinal"
    );


    window.location.href =
        "orcamento.html";

}
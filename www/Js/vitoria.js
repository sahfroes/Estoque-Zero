// =====================================
// ELEMENTOS DO HTML
// =====================================

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


// =====================================
// PEGAR ORÇAMENTO
// =====================================

const valorOrcamento =
    localStorage.getItem("orcamentoSelecionado");

const orcamento =
    Number(valorOrcamento) || 0;

console.log("💰 Orçamento:", orcamento);


// =====================================
// PEGAR TOTAL GASTO
// =====================================

const valorTotal =
    localStorage.getItem("totalGasto");

const totalGasto =
    Number(valorTotal) || 0;

console.log("💸 Total gasto:", totalGasto);


// =====================================
// PEGAR SALDO
// =====================================

const valorSaldo =
    localStorage.getItem("saldoFinal");

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

console.log("💵 Saldo final:", saldoFinal);


// =====================================
// PEGAR CARRINHO
// =====================================

let carrinho = [];

try {

    const carrinhoSalvo =
        localStorage.getItem("carrinho");

    if (carrinhoSalvo) {

        carrinho =
            JSON.parse(carrinhoSalvo);

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

console.log("🛒 Carrinho:", carrinho);


// =====================================
// CALCULAR QUANTIDADE DE ITENS
// =====================================

let quantidadeCompras = 0;

carrinho.forEach(function (produto) {

    quantidadeCompras +=
        Number(produto.quantidade) || 1;

});

console.log(
    "🛍️ Quantidade de compras:",
    quantidadeCompras
);


// =====================================
// CALCULAR PONTUAÇÃO
// =====================================
//
// A pontuação considera:
//
// 1. Quantidade de itens comprados
//    → até 40 pontos
//
// 2. Equilíbrio dos gastos
//    → até 60 pontos
//
// O objetivo é incentivar o jogador
// a realizar várias compras sem
// comprometer completamente o orçamento.
// =====================================

function calcularPontuacao(
    orcamento,
    totalGasto,
    quantidadeCompras
) {

    // -------------------------------------
    // PROTEÇÃO
    // -------------------------------------

    if (
        orcamento <= 0
    ) {

        return 0;

    }


    // =====================================
    // PARTE 1 — QUANTIDADE DE ITENS
    // =====================================
    //
    // Até 5 itens:
    //
    // 0 itens = 0 pontos
    // 1 item  = 8 pontos
    // 2 itens = 16 pontos
    // 3 itens = 24 pontos
    // 4 itens = 32 pontos
    // 5+     = 40 pontos
    //
    // =====================================

    const quantidadeConsiderada =
        Math.min(
            quantidadeCompras,
            5
        );


    const pontosQuantidade =
        (
            quantidadeConsiderada / 5
        ) * 40;


    // =====================================
    // PARTE 2 — EQUILÍBRIO DOS GASTOS
    // =====================================

    const percentualGasto =
        totalGasto / orcamento;


    let pontosGasto = 0;


    // -------------------------------------
    // GASTOU MENOS DE 40%
    // -------------------------------------
    //
    // Gastou pouco demais para uma
    // simulação de compras.
    //
    // Quanto mais próximo de 40%,
    // mais pontos recebe.
    //
    // -------------------------------------

    if (
        percentualGasto < 0.40
    ) {

        pontosGasto =
            (
                percentualGasto / 0.40
            ) * 60;

    }


    // -------------------------------------
    // GASTOU ENTRE 40% E 70%
    // -------------------------------------
    //
    // Faixa considerada equilibrada.
    //
    // Recebe os 60 pontos completos.
    //
    // -------------------------------------

    else if (
        percentualGasto <= 0.70
    ) {

        pontosGasto = 60;

    }


    // -------------------------------------
    // GASTOU MAIS DE 70%
    // -------------------------------------
    //
    // Quanto mais próximo de gastar
    // todo o orçamento, menos pontos.
    //
    // -------------------------------------

    else {

        pontosGasto =
            (
                (1 - percentualGasto) /
                0.30
            ) * 60;

    }


    // =====================================
    // SOMAR PONTOS
    // =====================================

    let pontuacao =
        pontosQuantidade +
        pontosGasto;


    // =====================================
    // GARANTIR 0 A 100
    // =====================================

    pontuacao =
        Math.max(
            0,
            Math.min(
                100,
                pontuacao
            )
        );


    return Math.round(
        pontuacao
    );

}


// =====================================
// CALCULAR PONTUAÇÃO FINAL
// =====================================

const pontuacao =
    calcularPontuacao(
        orcamento,
        totalGasto,
        quantidadeCompras
    );


console.log(
    "🏆 Pontuação final:",
    pontuacao
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
        quantidadeCompras === 0
    ) {

        desempenhoElemento.textContent =
            "⚠️ Você não realizou nenhuma compra. Tente participar da próxima missão.";

    }

    else if (
        quantidadeCompras === 1
    ) {

        desempenhoElemento.textContent =
            "💡 Você realizou apenas uma compra. Tente explorar melhor seu orçamento.";

    }

    else if (
        saldoFinal <= 0
    ) {

        desempenhoElemento.textContent =
            "⚠️ Você gastou todo o orçamento. Tente manter uma reserva para a próxima missão.";

    }

    else if (
        totalGasto >=
        orcamento * 0.40 &&
        totalGasto <=
        orcamento * 0.70
    ) {

        desempenhoElemento.textContent =
            "🌟 Excelente equilíbrio! Você realizou compras e ainda conseguiu preservar parte do orçamento.";

    }

    else if (
        totalGasto <
        orcamento * 0.40
    ) {

        desempenhoElemento.textContent =
            "💜 Você preservou bastante dinheiro, mas poderia ter explorado melhor seu orçamento.";

    }

    else {

        desempenhoElemento.textContent =
            "⚠️ Você realizou várias compras, mas comprometeu uma grande parte do orçamento.";

    }

}


// =====================================
// SALVAR RESULTADO LOCALMENTE
// =====================================

const resultadoPartida = {

    orcamento:
        orcamento,

    totalGasto:
        totalGasto,

    saldoRestante:
        saldoFinal,

    quantidadeTotalItens:
        quantidadeCompras,

    pontuacao:
        pontuacao,

    produtos:
        carrinho

};


localStorage.setItem(
    "resultadoPartida",
    JSON.stringify(resultadoPartida)
);


// =====================================
// ENVIAR RESULTADO PARA O FIREBASE
// =====================================

async function salvarResultadoNoFirebase() {

    const codigoTurma =
        localStorage.getItem(
            "codigoTurma"
        );

    const personagemId =
        localStorage.getItem(
            "personagemId"
        );


    if (!codigoTurma) {

        console.warn(
            "⚠️ Código da turma não encontrado."
        );

        return;

    }


    if (!personagemId) {

        console.warn(
            "⚠️ Personagem não encontrado."
        );

        return;

    }


    // -------------------------------------
    // EVITAR DUPLICAR ENVIO
    // -------------------------------------

    const resultadoJaEnviado =
        sessionStorage.getItem(
            "resultadoEnviado"
        );


    if (
        resultadoJaEnviado === "true"
    ) {

        console.log(
            "ℹ️ Resultado já foi enviado nesta partida."
        );

        return;

    }


    // -------------------------------------
    // DADOS QUE SERÃO ENVIADOS
    // -------------------------------------

    const dados = {

        codigo:
            codigoTurma,

        personagemId:
            personagemId,

        orcamento:
            orcamento,

        totalGasto:
            totalGasto,

        saldoRestante:
            saldoFinal,

        quantidadeTotalItens:
            quantidadeCompras,

        produtos:
            carrinho,

        pontuacao:
            pontuacao

    };


    console.log(
        "📤 Enviando resultado para o servidor:",
        dados
    );


    try {

        const resposta =
            await fetch(
                "/api/jogadores/finalizar",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            dados
                        )
                }
            );


        const resultado =
            await resposta.json();


        console.log(
            "📥 Resposta do servidor:",
            resultado
        );


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao salvar o resultado."
            );

        }


        sessionStorage.setItem(
            "resultadoEnviado",
            "true"
        );


        console.log(
            "✅ Resultado salvo no Firebase!"
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao salvar resultado:",
            erro
        );

    }

}


// =====================================
// EXECUTAR ENVIO
// =====================================

salvarResultadoNoFirebase();


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

    sessionStorage.removeItem(
        "resultadoEnviado"
    );


    localStorage.removeItem(
        "carrinho"
    );

    localStorage.removeItem(
        "totalGasto"
    );

    localStorage.removeItem(
        "saldoFinal"
    );

    localStorage.removeItem(
        "resultadoPartida"
    );


    window.location.href =
        "orcamento.html";

}
/* =====================================
   ESTOQUE ZERO
   TELA DE DESEMPENHO
===================================== */


/* =========================
   CONFIGURAÇÕES
========================= */

const ORCAMENTO_INICIAL = 50;


/* =========================
   PEGAR SALDO
========================= */

let saldo =
    Number(
        localStorage.getItem(
            "estoqueZeroSaldo"
        )
    );


/*
   Se não existir saldo,
   começa com R$ 50.
*/

if (Number.isNaN(saldo)) {

    saldo = ORCAMENTO_INICIAL;

}


/* =========================
   PEGAR COMPRAS
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
   FORMATA DINHEIRO
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
   CALCULAR TOTAL GASTO
========================= */

let totalGasto =
    ORCAMENTO_INICIAL - saldo;


/* =========================
   ATUALIZAR RESUMO
========================= */

document.getElementById(
    "saldo"
).textContent =
    dinheiro(saldo);


document.getElementById(
    "guardado"
).textContent =
    dinheiro(saldo);


document.getElementById(
    "quantidadeCompras"
).textContent =
    compras.length;


/* =========================
   TOTAL GASTO
========================= */

document.getElementById(
    "totalGasto"
).textContent =
    dinheiro(totalGasto);


document.getElementById(
    "saldoFinanceiro"
).textContent =
    dinheiro(saldo);


/* =========================
   PERCENTUAL GASTO
========================= */

let percentual =
    (totalGasto / ORCAMENTO_INICIAL) * 100;


percentual =
    Math.round(percentual);


document.getElementById(
    "percentualGasto"
).textContent =
    percentual + "%";


/* =========================
   PONTUAÇÃO
========================= */


/*
   Quanto mais dinheiro
   guardar, melhor a pontuação.
*/

let pontuacao =
    Math.round(
        (saldo / ORCAMENTO_INICIAL) * 100
    );


/*
   Bônus por realizar compras
   sem gastar tudo.
*/

if (saldo > 0) {

    pontuacao += compras.length * 5;

}


/*
   Nunca passa de 100.
*/

pontuacao =
    Math.min(
        100,
        pontuacao
    );


document.getElementById(
    "pontuacao"
).textContent =
    pontuacao;


/* =========================
   PERFIL FINANCEIRO
========================= */

let perfil =
    document.getElementById(
        "perfil"
    );


let descricao =
    document.getElementById(
        "perfilDescricao"
    );


if (percentual <= 30) {

    perfil.textContent =
        "Econômico";

    descricao.textContent =
        "Você foi muito cuidadoso e conseguiu preservar grande parte do seu orçamento.";

}
else if (percentual <= 60) {

    perfil.textContent =
        "Consciente";

    descricao.textContent =
        "Você conseguiu equilibrar suas compras e ainda preservou parte do seu orçamento.";

}
else if (percentual <= 80) {

    perfil.textContent =
        "Estratégico";

    descricao.textContent =
        "Você realizou várias compras, mas ainda conseguiu manter algum dinheiro.";

}
else {

    perfil.textContent =
        "Impulsivo";

    descricao.textContent =
        "Você gastou uma grande parte do orçamento. Na próxima missão, tente planejar melhor.";

}


/* =========================
   ATUALIZAR BARRA FINAL
========================= */

let valorBarra =
    document.getElementById(
        "valorBarra"
    );


let barraFinal =
    document.getElementById(
        "barraFinal"
    );


valorBarra.textContent =
    Math.round(saldo);


let altura =
    (saldo / ORCAMENTO_INICIAL) * 100;


barraFinal.style.height =
    altura + "%";


/* =========================
   LISTAR COMPRAS
========================= */

function mostrarCompras() {

    const lista =
        document.getElementById(
            "listaCompras"
        );


    /*
       Se ainda não existem compras.
    */

    if (compras.length === 0) {

        lista.innerHTML = `

            <div class="compra">

                <div class="compra-icone">
                    🛒
                </div>

                <div class="compra-info">

                    <strong>
                        Nenhuma compra ainda
                    </strong>

                    <small>
                        Suas compras aparecerão aqui.
                    </small>

                </div>

            </div>

        `;

        return;
    }


    /*
       Cria a lista das compras.
    */

    lista.innerHTML = "";


    compras.forEach(
        function(compra) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "compra";


            item.innerHTML = `

                <div class="compra-icone">
                    ${compra.imagem || "🛒"}
                </div>

                <div class="compra-info">

                    <strong>
                        ${compra.nome}
                    </strong>

                    <small>
                        ${compra.categoria || "Produto"}
                    </small>

                </div>

                <div class="compra-preco">

                    ${dinheiro(compra.preco)}

                </div>

            `;


            lista.appendChild(item);

        }
    );

}


mostrarCompras();


/* =========================
   TROCAR ABA
========================= */

function mostrarAba(
    nome,
    botao
) {


    /*
       Esconde todas as abas.
    */

    const abas =
        document.querySelectorAll(
            ".conteudo-aba"
        );


    abas.forEach(
        function(aba) {

            aba.classList.remove(
                "ativa"
            );

        }
    );


    /*
       Mostra a aba escolhida.
    */

    document.getElementById(
        nome
    ).classList.add(
        "ativa"
    );


    /*
       Remove o ativo
       dos botões.
    */

    const botoes =
        document.querySelectorAll(
            ".aba"
        );


    botoes.forEach(
        function(item) {

            item.classList.remove(
                "ativa"
            );

        }
    );


    /*
       Ativa o botão clicado.
    */

    botao.classList.add(
        "ativa"
    );

}


/* =========================
   ABRIR RANKING
========================= */

function abrirRanking() {

    window.location.href =
        "ranking.html";

}


/* =========================
   VOLTAR
========================= */

function voltar() {

    window.location.href =
        "resultado.html";

}
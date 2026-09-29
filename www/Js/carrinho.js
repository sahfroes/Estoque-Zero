// ========================================
// ESTOQUE ZERO
// JAVASCRIPT DO CARRINHO
// ========================================


// ========================================
// ELEMENTOS DO HTML
// ========================================

const listaProdutos =
    document.getElementById("lista-produtos");

const carrinhoVazio =
    document.getElementById("carrinho-vazio");

const orcamentoInicial =
    document.getElementById("orcamento-inicial");

const totalGasto =
    document.getElementById("total-gasto");

const saldoRestante =
    document.getElementById("saldo-restante");

const botaoVoltar =
    document.getElementById("botao-voltar");

const voltarCameraVazio =
    document.getElementById("voltar-camera-vazio");

const confirmarCompras =
    document.getElementById("confirmar-compras");


// ========================================
// PEGAR ORÇAMENTO
// ========================================

const valorSalvo =
    localStorage.getItem("orcamentoSelecionado");

const ORCAMENTO =
    Number(valorSalvo) || 0;


console.log("================================");
console.log("💰 ORÇAMENTO");
console.log("Valor salvo:", valorSalvo);
console.log("Orçamento:", ORCAMENTO);
console.log("================================");


// ========================================
// PEGAR CARRINHO
// ========================================

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
        "❌ Erro ao ler carrinho:",
        erro
    );

    carrinho = [];

}


console.log("🛒 Carrinho carregado:", carrinho);


// ========================================
// FORMATAR PREÇO
// ========================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ========================================
// CALCULAR TOTAL
// ========================================

function calcularTotal() {

    let total = 0;


    carrinho.forEach(
        function (produto) {

            const preco =
                Number(produto.preco) || 0;

            const quantidade =
                Number(produto.quantidade) || 1;


            total +=
                preco * quantidade;

        }
    );


    return total;

}


// ========================================
// CALCULAR E SALVAR RESULTADO
// ========================================

function salvarResultado() {

    const total =
        calcularTotal();


    const saldo =
        ORCAMENTO - total;


    // ====================================
    // SALVAR TOTAL GASTO
    // ====================================

    localStorage.setItem(
        "totalGasto",
        total.toFixed(2)
    );


    // ====================================
    // SALVAR SALDO FINAL
    // ====================================

    localStorage.setItem(
        "saldoFinal",
        saldo.toFixed(2)
    );


    console.log("================================");
    console.log("💾 RESULTADO SALVO");
    console.log("Orçamento:", ORCAMENTO);
    console.log("Total gasto:", total);
    console.log("Saldo final:", saldo);
    console.log("================================");


    return {
        total: total,
        saldo: saldo
    };

}


// ========================================
// MOSTRAR CARRINHO
// ========================================

function mostrarCarrinho() {

    if (!listaProdutos) {

        console.error(
            "❌ #lista-produtos não encontrado."
        );

        return;

    }


    listaProdutos.innerHTML = "";


    // ====================================
    // CARRINHO VAZIO
    // ====================================

    if (
        !carrinho ||
        carrinho.length === 0
    ) {

        if (carrinhoVazio) {

            carrinhoVazio.style.display =
                "block";

        }


        atualizarResumo();

        return;

    }


    // ====================================
    // ESCONDER CARRINHO VAZIO
    // ====================================

    if (carrinhoVazio) {

        carrinhoVazio.style.display =
            "none";

    }


    // ====================================
    // CRIAR PRODUTOS
    // ====================================

    carrinho.forEach(
        function (produto, indice) {

            const preco =
                Number(produto.preco) || 0;

            const quantidade =
                Number(produto.quantidade) || 1;

            const subtotal =
                preco * quantidade;


            // =================================
            // CARD
            // =================================

            const card =
                document.createElement("article");


            card.className =
                "produto";


            card.innerHTML = `

                <div class="imagem-produto">

                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                    >

                </div>


                <div class="informacoes-produto">

                    <h3 class="nome-produto">
                        ${produto.nome}
                    </h3>


                    <p class="preco-produto">
                        ${formatarPreco(preco)}
                    </p>


                    <div class="controles">

                        <button
                            type="button"
                            class="botao-quantidade diminuir"
                            data-indice="${indice}"
                        >
                            −
                        </button>


                        <span class="quantidade">
                            ${quantidade}
                        </span>


                        <button
                            type="button"
                            class="botao-quantidade aumentar"
                            data-indice="${indice}"
                        >
                            +
                        </button>

                    </div>


                    <strong class="subtotal">
                        ${formatarPreco(subtotal)}
                    </strong>

                </div>


                <button
                    type="button"
                    class="botao-excluir botao-remover"
                    data-indice="${indice}"
                    aria-label="Remover produto"
                >
                    ×
                </button>

            `;


            listaProdutos.appendChild(card);

        }
    );


    // ====================================
    // CONFIGURAR BOTÕES
    // ====================================

    configurarBotoes();


    // ====================================
    // ATUALIZAR RESUMO
    // ====================================

    atualizarResumo();

}


// ========================================
// CONFIGURAR BOTÕES
// ========================================

function configurarBotoes() {


    // ====================================
    // AUMENTAR QUANTIDADE
    // ====================================

    const botoesAumentar =
        document.querySelectorAll(".aumentar");


    botoesAumentar.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const indice =
                        Number(
                            this.dataset.indice
                        );


                    if (!carrinho[indice]) {

                        return;

                    }


                    carrinho[indice].quantidade =
                        Number(
                            carrinho[indice].quantidade
                        ) + 1;


                    salvarCarrinho();

                }
            );

        }
    );


    // ====================================
    // DIMINUIR QUANTIDADE
    // ====================================

    const botoesDiminuir =
        document.querySelectorAll(".diminuir");


    botoesDiminuir.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const indice =
                        Number(
                            this.dataset.indice
                        );


                    if (!carrinho[indice]) {

                        return;

                    }


                    const quantidadeAtual =
                        Number(
                            carrinho[indice].quantidade
                        );


                    if (quantidadeAtual > 1) {

                        carrinho[indice].quantidade =
                            quantidadeAtual - 1;

                    } else {

                        carrinho.splice(
                            indice,
                            1
                        );

                    }


                    salvarCarrinho();

                }
            );

        }
    );


    // ====================================
    // REMOVER PRODUTO
    // ====================================

    const botoesRemover =
        document.querySelectorAll(
            ".botao-remover"
        );


    botoesRemover.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const indice =
                        Number(
                            this.dataset.indice
                        );


                    carrinho.splice(
                        indice,
                        1
                    );


                    salvarCarrinho();

                }
            );

        }
    );

}


// ========================================
// SALVAR CARRINHO
// ========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    console.log(
        "💾 Carrinho atualizado:",
        carrinho
    );


    // Atualiza também
    // total gasto e saldo

    salvarResultado();


    // Atualiza a tela

    mostrarCarrinho();

}


// ========================================
// ATUALIZAR RESUMO
// ========================================

function atualizarResumo() {

    const resultado =
        salvarResultado();


    const total =
        resultado.total;

    const saldo =
        resultado.saldo;


    // ====================================
    // ORÇAMENTO
    // ====================================

    if (orcamentoInicial) {

        orcamentoInicial.textContent =
            formatarPreco(ORCAMENTO);

    }


    // ====================================
    // TOTAL GASTO
    // ====================================

    if (totalGasto) {

        totalGasto.textContent =
            formatarPreco(total);

    }


    // ====================================
    // SALDO RESTANTE
    // ====================================

    if (saldoRestante) {

        saldoRestante.textContent =
            formatarPreco(saldo);

    }


    console.log("📊 RESUMO ATUALIZADO");
    console.log("Orçamento:", ORCAMENTO);
    console.log("Total gasto:", total);
    console.log("Saldo restante:", saldo);

}


// ========================================
// VOLTAR PARA CÂMERA
// ========================================

function voltarParaCamera() {

    window.history.back();

}


if (botaoVoltar) {

    botaoVoltar.addEventListener(
        "click",
        voltarParaCamera
    );

}


if (voltarCameraVazio) {

    voltarCameraVazio.addEventListener(
        "click",
        voltarParaCamera
    );

}


// ========================================
// FINALIZAR PARTIDA
// ========================================

if (confirmarCompras) {

    confirmarCompras.addEventListener(
        "click",
        function () {

            console.log(
                "================================"
            );

            console.log(
                "🏁 PARTIDA FINALIZADA"
            );


            // ====================================
            // CALCULAR NOVAMENTE
            // ====================================

            const resultado =
                salvarResultado();


            const total =
                resultado.total;

            const saldo =
                resultado.saldo;


            console.log(
                "🛒 Carrinho:",
                carrinho
            );

            console.log(
                "💰 Total:",
                total
            );

            console.log(
                "💵 Saldo:",
                saldo
            );


            // ====================================
            // SALVAR RESULTADO COMPLETO
            // ====================================

            const resultadoPartida = {

                orcamento:
                    ORCAMENTO,

                totalGasto:
                    total,

                saldo:
                    saldo,

                carrinho:
                    carrinho

            };

            localStorage.setItem(
                "resultadoPartida",
                JSON.stringify(
                    resultadoPartida
                )
            );

            console.log(
                "💾 Resultado da partida:",
                resultadoPartida
            );

            // ====================================
            // IR PARA VITÓRIA
            // ====================================

            window.location.href =
                "vitoria.html";

        }
    );

}

// ========================================
// INICIAR
// ========================================

mostrarCarrinho();
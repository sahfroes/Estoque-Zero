
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
// ORÇAMENTO DA PARTIDA
// ========================================

const valorSalvo =
    localStorage.getItem("orcamentoSelecionado");

const ORCAMENTO =
    Number(valorSalvo) || 0;

console.log("💰 Orçamento inicial:", ORCAMENTO);


// ========================================
// CARRINHO
// ========================================

let carrinho = [];

try {

    const carrinhoSalvo =
        localStorage.getItem("carrinho");

    if (carrinhoSalvo) {

        const dados =
            JSON.parse(carrinhoSalvo);

        if (Array.isArray(dados)) {

            carrinho = dados;

        }

    }

} catch (erro) {

    console.error(
        "Erro ao carregar carrinho:",
        erro
    );

    carrinho = [];

}


// ========================================
// GARANTIR QUANTIDADES VÁLIDAS
// ========================================

carrinho.forEach(function (produto) {

    let quantidade =
        Number(produto.quantidade);

    if (!Number.isFinite(quantidade)) {

        quantidade = 1;

    }

    // Limite máximo: 3
    quantidade =
        Math.max(0, Math.min(3, quantidade));

    produto.quantidade =
        quantidade;

});


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

    carrinho.forEach(function (produto) {

        const preco =
            Number(produto.preco) || 0;

        const quantidade =
            Number(produto.quantidade) || 0;

        total +=
            preco * quantidade;

    });

    return total;

}


// ========================================
// SALVAR RESULTADO
// ========================================

function salvarResultado() {

    const total =
        calcularTotal();

    const saldo =
        ORCAMENTO - total;


    localStorage.setItem(
        "totalGasto",
        total.toFixed(2)
    );

    localStorage.setItem(
        "saldoFinal",
        saldo.toFixed(2)
    );


    return {

        total: total,

        saldo: saldo

    };

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


    // Orçamento inicial

    if (orcamentoInicial) {

        orcamentoInicial.textContent =
            formatarPreco(ORCAMENTO);

    }


    // Total gasto

    if (totalGasto) {

        totalGasto.textContent =
            formatarPreco(total);

    }


    // Saldo restante

    if (saldoRestante) {

        saldoRestante.textContent =
            formatarPreco(saldo);

    }


    console.log(
        "📊 Orçamento:",
        ORCAMENTO
    );

    console.log(
        "🛒 Total:",
        total
    );

    console.log(
        "💰 Saldo:",
        saldo
    );

}


// ========================================
// MOSTRAR CARRINHO
// ========================================

function mostrarCarrinho() {

    if (!listaProdutos) {

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


    if (carrinhoVazio) {

        carrinhoVazio.style.display =
            "none";

    }


    // ====================================
    // CRIAR CARDS
    // ====================================

    carrinho.forEach(
        function (produto, indice) {

            const preco =
                Number(produto.preco) || 0;

            const quantidade =
                Number(produto.quantidade) || 0;

            const subtotal =
                preco * quantidade;


            const card =
                document.createElement("article");

            card.className =
                "produto";


            // =================================
            // IMAGEM SEGURA
            // =================================

            const imagem =
                produto.imagem || "";


            card.innerHTML = `

                <div class="imagem-produto">

                    <img
                        src="${imagem}"
                        alt="${produto.nome || "Produto"}"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div class="informacoes-produto">

                    <h3 class="nome-produto">
                        ${produto.nome || "Produto"}
                    </h3>


                    <p class="preco-produto">
                        ${formatarPreco(preco)}
                    </p>


                    <div class="controles">

                        <button
                            type="button"
                            class="botao-quantidade botao-menos diminuir"
                            data-indice="${indice}"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>


                        <span class="quantidade">
                            ${quantidade}
                        </span>


                        <button
                            type="button"
                            class="botao-quantidade botao-mais aumentar"
                            data-indice="${indice}"
                            aria-label="Aumentar quantidade"
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


    configurarBotoes();

    atualizarResumo();

}


// ========================================
// CONFIGURAR BOTÕES
// ========================================

function configurarBotoes() {


    // ====================================
    // AUMENTAR
    // MÁXIMO = 3
    // ====================================

    document
        .querySelectorAll(".aumentar")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();
                    evento.stopPropagation();


                    const indice =
                        Number(
                            this.dataset.indice
                        );


                    if (!carrinho[indice]) {

                        return;

                    }


                    let quantidade =
                        Number(
                            carrinho[indice].quantidade
                        ) || 0;


                    if (quantidade < 3) {

                        quantidade++;

                        carrinho[indice].quantidade =
                            quantidade;

                        salvarCarrinho();

                    }

                }
            );

        });


    // ====================================
    // DIMINUIR
    // MÍNIMO = 0
    // ====================================

    document
        .querySelectorAll(".diminuir")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();
                    evento.stopPropagation();


                    const indice =
                        Number(
                            this.dataset.indice
                        );


                    if (!carrinho[indice]) {

                        return;

                    }


                    let quantidade =
                        Number(
                            carrinho[indice].quantidade
                        ) || 0;


                    if (quantidade > 0) {

                        quantidade--;

                        carrinho[indice].quantidade =
                            quantidade;

                    }


                    // Se chegar a 0,
                    // remove o produto do carrinho.

                    if (quantidade === 0) {

                        carrinho.splice(
                            indice,
                            1
                        );

                    }


                    salvarCarrinho();

                }
            );

        });


    // ====================================
    // EXCLUIR
    // ====================================

    document
        .querySelectorAll(".botao-remover")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();
                    evento.stopPropagation();


                    const indice =
                        Number(
                            this.dataset.indice
                        );


                    if (
                        !Number.isInteger(indice) ||
                        !carrinho[indice]
                    ) {

                        return;

                    }


                    carrinho.splice(
                        indice,
                        1
                    );


                    salvarCarrinho();

                }
            );

        });

}


// ========================================
// SALVAR CARRINHO
// ========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    salvarResultado();

    mostrarCarrinho();

}


// ========================================
// VOLTAR PARA CÂMERA
// ========================================

function voltarParaCamera() {

    // Não usar history.back()
    // porque no celular pode voltar
    // para uma página inesperada.

    const url =
        new URL(
            "camera.html",
            window.location.href
        );

    window.location.assign(
        url.href
    );

}


if (botaoVoltar) {

    botaoVoltar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            voltarParaCamera();

        }
    );

}


if (voltarCameraVazio) {

    voltarCameraVazio.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            voltarParaCamera();

        }
    );

}


// ========================================
// FINALIZAR PARTIDA
// ========================================

if (confirmarCompras) {

    confirmarCompras.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();


            const resultado =
                salvarResultado();


            const resultadoPartida = {

                orcamento:
                    ORCAMENTO,

                totalGasto:
                    resultado.total,

                saldo:
                    resultado.saldo,

                carrinho:
                    carrinho

            };


            // =================================
            // SALVAR RESULTADO
            // =================================

            localStorage.setItem(
                "resultadoPartida",
                JSON.stringify(
                    resultadoPartida
                )
            );


            // =================================
            // IR PARA VITÓRIA
            // =================================

            const url =
                new URL(
                    "vitoria.html",
                    window.location.href
                );


            window.location.assign(
                url.href
            );

        }
    );

}


// ========================================
// INICIAR
// ========================================

mostrarCarrinho();


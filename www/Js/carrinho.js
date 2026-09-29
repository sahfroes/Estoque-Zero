// ==========================================
// ESTOQUE ZERO
// CARRINHO
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

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


// ==========================================
// ORÇAMENTO
// ==========================================

const valorSalvo =
    localStorage.getItem("orcamentoSelecionado");

const ORCAMENTO =
    Number(valorSalvo) || 0;

console.log(
    "💰 Orçamento:",
    ORCAMENTO
);


// ==========================================
// CARREGAR CARRINHO
// ==========================================

let carrinho = [];

try {

    const salvo =
        localStorage.getItem("carrinho");

        console.log(
        "📦 localStorage carrinho:",
        salvo
        );
    if (salvo) {

        const dados =
            JSON.parse(salvo);

        if (Array.isArray(dados)) {

            carrinho = dados;

        }

    }

    console.log(
        "🛒 CARRINHO RECEBIDO NA TELA CARRINHO:",
        carrinho
    );

} catch (erro) {

    console.error(
        "❌ Erro ao carregar carrinho:",
        erro
    );

    carrinho = [];

}


// ==========================================
// GARANTIR DADOS CORRETOS
// ==========================================

carrinho.forEach(function (produto) {

    let quantidade =
        Number(produto.quantidade);

    if (!Number.isFinite(quantidade)) {

        quantidade = 1;

    }

    produto.quantidade =
        Math.max(
            0,
            Math.min(
                3,
                quantidade
            )
        );

    produto.preco =
        Number(produto.preco) || 0;

});


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==========================================
// CALCULAR TOTAL
// ==========================================

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


// ==========================================
// ATUALIZAR RESUMO
// ==========================================

function atualizarResumo() {

    const total =
        calcularTotal();

    const saldo =
        ORCAMENTO - total;


    if (orcamentoInicial) {

        orcamentoInicial.textContent =
            formatarPreco(ORCAMENTO);

    }


    if (totalGasto) {

        totalGasto.textContent =
            formatarPreco(total);

    }


    if (saldoRestante) {

        saldoRestante.textContent =
            formatarPreco(saldo);

    }


    localStorage.setItem(
        "totalGasto",
        total.toFixed(2)
    );


    localStorage.setItem(
        "saldoFinal",
        saldo.toFixed(2)
    );


    console.log(
        "📊 Total:",
        total
    );

    console.log(
        "💰 Saldo:",
        saldo
    );

}


// ==========================================
// MOSTRAR CARRINHO
// ==========================================

function mostrarCarrinho() {

    if (!listaProdutos) {

        return;

    }


    listaProdutos.innerHTML = "";


    // --------------------------------------
    // PRODUTOS COM QUANTIDADE
    // --------------------------------------

    const produtosValidos =
        carrinho.filter(function (produto) {

            return Number(produto.quantidade) > 0;

        });


    // --------------------------------------
    // CARRINHO VAZIO
    // --------------------------------------

    if (produtosValidos.length === 0) {

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


    // --------------------------------------
    // CRIAR CARDS
    // --------------------------------------

    carrinho.forEach(function (produto, indice) {

        const quantidade =
            Number(produto.quantidade) || 0;


        // Produto zerado não aparece

        if (quantidade <= 0) {

            return;

        }


        const preco =
            Number(produto.preco) || 0;


        const subtotal =
            preco * quantidade;


        const card =
            document.createElement("article");


        card.className =
            "produto";


        // ----------------------------------
        // DADOS DO PRODUTO
        // ----------------------------------

        const imagem =
            produto.imagem || "";

        const nome =
            produto.nome || "Produto";


        // ----------------------------------
        // HTML DO CARD
        // ----------------------------------

        card.innerHTML = `

            <div class="imagem-produto">

                <img
                    src="${imagem}"
                    alt="${nome}"
                >

            </div>


            <div class="informacoes-produto">

                <h3 class="nome-produto">
                    ${nome}
                </h3>


                <p class="preco-produto">
                    ${formatarPreco(preco)}
                </p>


                <div class="controles">

                    <button
                        type="button"
                        class="botao-quantidade botao-menos"
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
                        class="botao-quantidade botao-mais"
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
                class="botao-excluir"
                data-indice="${indice}"
                aria-label="Excluir produto"
            >
                ×
            </button>

        `;


        listaProdutos.appendChild(card);

    });


    configurarBotoes();

    atualizarResumo();

}


// ==========================================
// CONFIGURAR BOTÕES
// ==========================================

function configurarBotoes() {


    // ======================================
    // BOTÃO +
    // ======================================

    document
        .querySelectorAll(".botao-mais")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    evento.stopPropagation();


                    const indice =
                        Number(
                            botao.dataset.indice
                        );


                    if (!carrinho[indice]) {

                        return;

                    }


                    let quantidade =
                        Number(
                            carrinho[indice].quantidade
                        ) || 0;


                    // Máximo = 3

                    if (quantidade < 3) {

                        quantidade++;

                        carrinho[indice].quantidade =
                            quantidade;

                    }


                    salvarCarrinho();

                }
            );

        });


    // ======================================
    // BOTÃO -
    // ======================================

    document
        .querySelectorAll(".botao-menos")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    evento.stopPropagation();


                    const indice =
                        Number(
                            botao.dataset.indice
                        );


                    if (!carrinho[indice]) {

                        return;

                    }


                    let quantidade =
                        Number(
                            carrinho[indice].quantidade
                        ) || 0;


                    // Mínimo = 0

                    if (quantidade > 0) {

                        quantidade--;

                        carrinho[indice].quantidade =
                            quantidade;

                    }


                    salvarCarrinho();

                }
            );

        });


    // ======================================
    // BOTÃO EXCLUIR
    // ======================================

    document
        .querySelectorAll(".botao-excluir")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    evento.stopPropagation();


                    const indice =
                        Number(
                            botao.dataset.indice
                        );


                    if (!carrinho[indice]) {

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


// ==========================================
// SALVAR CARRINHO
// ==========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    mostrarCarrinho();

}


// ==========================================
// VOLTAR PARA CÂMERA
// ==========================================

function voltarParaCamera() {

    const url =
        new URL(
            "camera.html",
            window.location.href
        );


    window.location.assign(
        url.href
    );

}


// ==========================================
// BOTÃO VOLTAR
// ==========================================

if (botaoVoltar) {

    botaoVoltar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            evento.stopPropagation();

            voltarParaCamera();

        }
    );

}


// ==========================================
// BOTÃO VOLTAR - CARRINHO VAZIO
// ==========================================

if (voltarCameraVazio) {

    voltarCameraVazio.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            evento.stopPropagation();

            voltarParaCamera();

        }
    );

}


// ==========================================
// FINALIZAR PARTIDA
// ==========================================

if (confirmarCompras) {

    confirmarCompras.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            evento.stopPropagation();


            // ----------------------------------
            // CALCULAR RESULTADO
            // ----------------------------------

            const total =
                calcularTotal();


            const saldo =
                ORCAMENTO - total;


            // ----------------------------------
            // RESULTADO DA PARTIDA
            // ----------------------------------

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


            // ----------------------------------
            // SALVAR RESULTADO
            // ----------------------------------

            localStorage.setItem(
                "resultadoPartida",
                JSON.stringify(
                    resultadoPartida
                )
            );


            localStorage.setItem(
                "totalGasto",
                total.toFixed(2)
            );


            localStorage.setItem(
                "saldoFinal",
                saldo.toFixed(2)
            );


            console.log(
                "🏁 Partida finalizada:",
                resultadoPartida
            );


            // ----------------------------------
            // IR PARA VITÓRIA
            // ----------------------------------

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


// ==========================================
// INICIAR
// ==========================================

mostrarCarrinho();
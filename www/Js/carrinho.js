
// Orçamento escolhido pelo jogador.
// Por enquanto: R$ 50,00
const ORCAMENTO = 50;

// ========================================
// ELEMENTOS DA TELA
// ========================================

const listaProdutos =
    document.getElementById("listaProdutos");

const carrinhoVazio =
    document.getElementById("carrinhoVazio");

const resumo =
    document.getElementById("resumo");

const total =
    document.getElementById("total");

const saldoRestante =
    document.getElementById("saldoRestante");

const confirmar =
    document.getElementById("confirmar");

const voltar =
    document.getElementById("voltar");

// ========================================
// PEGAR CARRINHO
// ========================================

let carrinho = JSON.parse(
    localStorage.getItem("carrinho")
) || [];


// ========================================
// FORMATAR DINHEIRO
// ========================================

function formatarDinheiro(valor) {

    return valor
        .toFixed(2)
        .replace(".", ",");

}

// ========================================
// CALCULAR TOTAL
// ========================================

function calcularTotal() {

    let valorTotal = 0;

    carrinho.forEach(function (produto) {

        valorTotal += produto.preco;

    });

    return valorTotal;
}

// ========================================
// AGRUPAR PRODUTOS
// ========================================

function agruparProdutos() {

    const produtosAgrupados = {};

    carrinho.forEach(function (produto) {

        if (
            produtosAgrupados[produto.nome]
        ) {

            produtosAgrupados[
                produto.nome
            ].quantidade++;

        } else {

            produtosAgrupados[
                produto.nome
            ] = {

                ...produto,

                quantidade: 1

            };

        }

    });

    return Object.values(
        produtosAgrupados
    );
}

// ========================================
// MOSTRAR PRODUTOS
// ========================================

function mostrarProdutos() {

    listaProdutos.innerHTML = "";

    const produtos =
        agruparProdutos();

    // -------------------------------
    // CARRINHO VAZIO
    // -------------------------------

    if (produtos.length === 0) {

        carrinhoVazio.style.display =
            "block";

        resumo.style.display =
            "none";

        return;
    }

    // -------------------------------
    // CARRINHO COM PRODUTOS
    // -------------------------------

    carrinhoVazio.style.display =
        "none";

    resumo.style.display =
        "block";

    // -------------------------------
    // CRIAR CARDS
    // -------------------------------

    produtos.forEach(function (produto) {

        const card =
            document.createElement("div");

        card.className =
            "produto-card";


        card.innerHTML = `

            <div class="produto-imagem">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </div>

            <div class="produto-info">

                <h2>
                    ${produto.nome}
                </h2>

                <p class="produto-preco">
                    R$ ${formatarDinheiro(
                        produto.preco
                    )}
                </p>

            </div>


            <div class="quantidade">

                <button
                    class="botao-menos"
                    data-produto="${produto.nome}"
                >
                    −
                </button>

                <span>
                    ${produto.quantidade}
                </span>

                <button
                    class="botao-mais"
                    data-produto="${produto.nome}"
                >
                    +
                </button>

            </div>
        `;


        listaProdutos.appendChild(card);

    });

    adicionarEventosQuantidade();

    atualizarResumo();
}

// ========================================
// BOTÕES + E -
// ========================================

function adicionarEventosQuantidade() {

    const botoesMenos =
        document.querySelectorAll(
            ".botao-menos"
        );

    const botoesMais =
        document.querySelectorAll(
            ".botao-mais"
        );

    // -------------------------------
    // DIMINUIR
    // -------------------------------

    botoesMenos.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                diminuirProduto(
                    botao.dataset.produto
                );

            }
        );

    });

    // -------------------------------
    // AUMENTAR
    // -------------------------------

    botoesMais.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                aumentarProduto(
                    botao.dataset.produto
                );

            }
        );

    });

}

// ========================================
// AUMENTAR PRODUTO
// ========================================

function aumentarProduto(nome) {

    const produto =
        carrinho.find(function (item) {

            return item.nome === nome;

        });

    if (!produto) {
        return;
    }

    carrinho.push({

        nome: produto.nome,

        preco: produto.preco,

        imagem: produto.imagem

    });

    salvarCarrinho();

}

// ========================================
// DIMINUIR PRODUTO
// ========================================

function diminuirProduto(nome) {

    const indice =
        carrinho.findIndex(function (item) {

            return item.nome === nome;

        });


    if (indice === -1) {
        return;
    }


    carrinho.splice(indice, 1);


    salvarCarrinho();

}

// ========================================
// SALVAR
// ========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    mostrarProdutos();

}

// ========================================
// ATUALIZAR TOTAL E SALDO
// ========================================

function atualizarResumo() {

    const valorTotal =
        calcularTotal();


    const saldo =
        ORCAMENTO - valorTotal;


    // Total
    total.textContent =
        `R$ ${formatarDinheiro(
            valorTotal
        )}`;


    // Saldo restante
    saldoRestante.textContent =
        `R$ ${formatarDinheiro(
            saldo
        )}`;

    // -------------------------------
    // PASSOU DO ORÇAMENTO
    // -------------------------------

    if (saldo < 0) {

        saldoRestante.classList.add(
            "saldo-negativo"
        );

        confirmar.disabled = true;

    } else {

        saldoRestante.classList.remove(
            "saldo-negativo"
        );

        confirmar.disabled = false;

    }

}

// ========================================
// CONFIRMAR COMPRAS
// ========================================

confirmar.addEventListener(
    "click",
    function () {

        const valorTotal =
            calcularTotal();


        if (valorTotal > ORCAMENTO) {

            alert(
                "Você ultrapassou seu orçamento!"
            );

            return;
        }

        // Guarda os dados
        localStorage.setItem(
            "totalCompra",
            valorTotal
        );


        localStorage.setItem(
            "saldoFinal",
            ORCAMENTO - valorTotal
        );

        // Vai para o resultado
        window.location.href =
            "resultado.html";

    }
);

// ========================================
// VOLTAR
// ========================================

voltar.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "camera.html";
});

// ========================================
// INICIAR
// ========================================

mostrarProdutos();
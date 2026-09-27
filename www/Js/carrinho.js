// ==========================================
// PEGAR ELEMENTOS DA TELA
// ==========================================

const listaProdutos =
    document.getElementById("lista-produtos");

const carrinhoVazio =
    document.getElementById("carrinho-vazio");

const resumo =
    document.getElementById("resumo");

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
// PEGAR CARRINHO DO LOCALSTORAGE
// ==========================================

let carrinho = JSON.parse(
    localStorage.getItem("carrinho")
) || [];


// ==========================================
// PEGAR ORÇAMENTO
// ==========================================

let orcamento = Number(
    localStorage.getItem("orcamentoSelecionado")
) || 0;


// ==========================================
// MOSTRAR VALOR EM REAIS
// ==========================================

function formatarDinheiro(valor) {

    return "R$ " +
        valor
            .toFixed(2)
            .replace(".", ",");

}


// ==========================================
// MOSTRAR ORÇAMENTO
// ==========================================

orcamentoInicial.textContent =
    formatarDinheiro(orcamento);


// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function mostrarProdutos() {

    // Limpa a lista

    listaProdutos.innerHTML = "";


    // Verifica se está vazio

    if (carrinho.length === 0) {

        carrinhoVazio.style.display = "block";

        resumo.style.display = "none";

        return;

    }


    // Mostra a lista

    carrinhoVazio.style.display = "none";

    resumo.style.display = "block";


    // Percorre os produtos

    carrinho.forEach(function(produto, indice) {


        // ==========================================
        // CARD DO PRODUTO
        // ==========================================

        const card =
            document.createElement("div");

        card.classList.add("produto");


        // ==========================================
        // QUANTIDADE
        // ==========================================

        const quantidade =
            produto.quantidade || 1;


        // ==========================================
        // HTML DO CARD
        // ==========================================

        card.innerHTML = `

            <div class="imagem-produto">

                <img 
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </div>


            <div class="informacoes-produto">

                <div class="nome-produto">
                    ${produto.nome}
                </div>

                <div class="categoria-produto">
                    ${produto.categoria || "Alimentação"}
                </div>

                <div class="preco-produto">
                    ${formatarDinheiro(produto.preco)}
                </div>

            </div>


            <div class="controles">

                <button
                    class="botao-quantidade botao-menos"
                    onclick="diminuirQuantidade(${indice})"
                >
                    −
                </button>


                <span class="quantidade">
                    ${quantidade}
                </span>


                <button
                    class="botao-quantidade botao-mais"
                    onclick="aumentarQuantidade(${indice})"
                >
                    +
                </button>


                <button
                    class="botao-excluir"
                    onclick="excluirProduto(${indice})"
                    aria-label="Excluir produto"
                >
                    ♧
                </button>

            </div>

        `;


        // Coloca o card na tela

        listaProdutos.appendChild(card);

    });


    // Atualiza valores

    atualizarResumo();

}


// ==========================================
// AUMENTAR QUANTIDADE
// ==========================================

function aumentarQuantidade(indice) {

    // Se ainda não tiver quantidade

    if (!carrinho[indice].quantidade) {

        carrinho[indice].quantidade = 1;

    }


    carrinho[indice].quantidade++;


    salvarCarrinho();

    mostrarProdutos();

}


// ==========================================
// DIMINUIR QUANTIDADE
// ==========================================

function diminuirQuantidade(indice) {

    if (!carrinho[indice].quantidade) {

        carrinho[indice].quantidade = 1;

    }


    // Diminui

    carrinho[indice].quantidade--;


    // Se chegar a zero

    if (carrinho[indice].quantidade <= 0) {

        carrinho.splice(indice, 1);

    }


    salvarCarrinho();

    mostrarProdutos();

}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

function excluirProduto(indice) {

    carrinho.splice(indice, 1);

    salvarCarrinho();

    mostrarProdutos();

}


// ==========================================
// SALVAR CARRINHO
// ==========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {

    let total = 0;


    carrinho.forEach(function(produto) {

        const quantidade =
            produto.quantidade || 1;


        total +=
            Number(produto.preco) *
            quantidade;

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
        orcamento - total;


    // Total gasto

    totalGasto.textContent =
        formatarDinheiro(total);


    // Saldo restante

    saldoRestante.textContent =
        formatarDinheiro(saldo);


    // Se o saldo ficou negativo

    if (saldo < 0) {

        saldoRestante.style.color =
            "#e74c3c";

    } else {

        saldoRestante.style.color =
            "#20a59e";

    }

}


// ==========================================
// BOTÃO VOLTAR
// ==========================================

botaoVoltar.addEventListener(
    "click",
    function() {

        window.location.href =
            "camera.html";

    }
);


// ==========================================
// VOLTAR PELA TELA VAZIA
// ==========================================

voltarCameraVazio.addEventListener(
    "click",
    function() {

        window.location.href =
            "camera.html";

    }
);


// ==========================================
// CONFIRMAR COMPRAS
// ==========================================

confirmarCompras.addEventListener(
    "click",
    function() {

        const total =
            calcularTotal();


        const saldo =
            orcamento - total;


        // Salva informações para a
        // próxima tela

        localStorage.setItem(
            "totalGasto",
            total
        );


        localStorage.setItem(
            "saldoFinal",
            saldo
        );


        // Vai para a tela de vitória

        window.location.href =
            "vitoria.html";

    }
);


// ==========================================
// INICIAR A TELA
// ==========================================

mostrarProdutos();
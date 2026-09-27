// ========================================
// PRODUTOS
// ========================================

const produtos = {

    leite: {
        nome: "Leite UHT Integral 1 L",
        preco: 7.50,
        imagem: "../../img/produtos/leite.png"
    },

    feijao: {
        nome: "Feijão Carioca 1 kg",
        preco: 8.00,
        imagem: "../../img/produtos/feijao.png"
    },

    arroz: {
        nome: "Arroz Branco 5 kg",
        preco: 25.00,
        imagem: "../../img/produtos/arroz.jpeg"
    },

    macarrao: {
        nome: "Macarrão 500 g",
        preco: 5.00,
        imagem: "../../img/produtos/macarrao.jpeg"
    },

    oleo: {
        nome: "Óleo de Soja 900 ml",
        preco: 8.00,
        imagem: "../../img/produtos/oleo.jpeg"
    },

    acucar: {
        nome: "Açúcar Refinado 1 kg",
        preco: 5.00,
        imagem: "../../img/produtos/acucar.jpeg"
    },

    bombons: {
        nome: "Caixa de Bombons",
        preco: 12.00,
        imagem: "../../img/produtos/bombons.jpeg"
    },

    giftcard: {
        nome: "Gift Card",
        preco: 20.00,
        imagem: "../../img/produtos/giftcard.png"
    },

    copo: {
        nome: "Copo Térmico",
        preco: 15.00,
        imagem: "../../img/produtos/copo.jpg"
    },

    boneco: {
        nome: "Boneco Colecionável",
        preco: 18.00,
        imagem: "../../img/produtos/boneco.jpeg"
    }

};

// ========================================
// PRODUTO ENCONTRADO
// ========================================

// Recupera o produto que foi encontrado
// pelo MindAR na tela da câmera
const produtoEncontrado =
    localStorage.getItem("produtoEncontrado");

// Mostra no console para facilitar o teste
console.log("🔎 Produto encontrado:", produtoEncontrado);

// Procura o produto na lista
const produto = produtos[produtoEncontrado];

// ========================================
// PEGAR ELEMENTOS DO HTML
// ========================================

const imagemProduto =
    document.getElementById("imagemProduto");

const nomeProduto =
    document.getElementById("nomeProduto");

const precoProduto =
    document.getElementById("precoProduto");

const adicionar =
    document.getElementById("adicionar");

const cancelar =
    document.getElementById("cancelar");

const fechar =
    document.getElementById("fechar");

// ========================================
// MOSTRAR PRODUTO NO CARD
// ========================================

if (produto) {

    console.log("✅ Produto carregado:", produto.nome);

    imagemProduto.src = produto.imagem;
    nomeProduto.textContent = produto.nome;

    // Preço
    precoProduto.textContent =
        produto.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

} else {

    console.error(
        "❌ Produto não encontrado na lista:",
        produtoEncontrado
    );

    nomeProduto.textContent = "Produto não encontrado";

    precoProduto.textContent = "R$ 0,00";
}

// ========================================
// ADICIONAR AO CARRINHO
// ========================================

adicionar.addEventListener("click", function () {

    // Se não encontrou o produto,
    // não permite adicionar
    if (!produto) {
        console.error("❌ Não foi possível adicionar o produto.");
        return;
    }

    // Pega o carrinho existente
    let carrinho = JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];

    // Adiciona o produto
    carrinho.push({

        id: produtoEncontrado,

        nome: produto.nome,

        preco: produto.preco,

        imagem: produto.imagem

    });


    // Salva o carrinho
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    console.log(
        "🛒 Produto adicionado:",
        produto.nome
    );


    // Volta para o carrinho
    window.location.href = "carrinho.html";

});

// ========================================
// CANCELAR
// ========================================

cancelar.addEventListener("click", function () {

    window.history.back();

});

// ========================================
// FECHAR
// ========================================

fechar.addEventListener("click", function () {

    window.history.back();

});
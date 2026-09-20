// ========================================
// PRODUTOS
// ========================================

const produtos = {

    maca: {
        nome: "Maçã",
        preco: 8.00,
        imagem: "img/maca.png"
    },

    pao: {
        nome: "Pão",
        preco: 6.00,
        imagem: "img/pao.png"
    },

    leite: {
        nome: "Leite integral",
        preco: 7.50,
        imagem: "img/leite.png"
    }

};


// ========================================
// PRODUTO ENCONTRADO
// ========================================

// Por enquanto estamos testando com leite
const produtoEncontrado = "leite";


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

    // Coloca a imagem
    imagemProduto.src = produto.imagem;

    // Coloca o nome
    nomeProduto.textContent = produto.nome;

    // Coloca o preço
    precoProduto.textContent =
        `R$ ${produto.preco.toFixed(2).replace(".", ",")}`;

}


// ========================================
// ADICIONAR AO CARRINHO
// ========================================

adicionar.addEventListener("click", function () {

    // Pega o carrinho existente
    let carrinho = JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];


    // Adiciona o produto encontrado
    carrinho.push(produto);


    // Salva novamente
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    // Vai para o carrinho
    window.location.href = "carrinho.html";

});


// ========================================
// CANCELAR
// ========================================

cancelar.addEventListener("click", function () {

    window.location.href = "camera.html";

});


// ========================================
// FECHAR
// ========================================

fechar.addEventListener("click", function () {

    window.location.href = "camera.html";

});
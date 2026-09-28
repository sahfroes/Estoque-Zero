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

const produtoEncontrado =
    localStorage.getItem(
        "produtoEncontrado"
    );


console.log(
    "🔎 Produto encontrado:",
    produtoEncontrado
);


const produto =
    produtos[produtoEncontrado];


// ========================================
// ELEMENTOS
// ========================================

const imagemProduto =
    document.getElementById(
        "imagemProduto"
    );

const nomeProduto =
    document.getElementById(
        "nomeProduto"
    );

const precoProduto =
    document.getElementById(
        "precoProduto"
    );

const adicionar =
    document.getElementById(
        "adicionar"
    );

const cancelar =
    document.getElementById(
        "cancelar"
    );

const fechar =
    document.getElementById(
        "fechar"
    );


// ========================================
// MOSTRAR PRODUTO
// ========================================

if (produto) {

    imagemProduto.src =
        produto.imagem;

    nomeProduto.textContent =
        produto.nome;

    precoProduto.textContent =
        produto.preco.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ========================================
// ADICIONAR AO CARRINHO
// ========================================

if (adicionar) {

    adicionar.addEventListener(
        "click",
        function () {

            if (!produto) {

                return;
            }


            let carrinho =
                JSON.parse(
                    localStorage.getItem(
                        "carrinho"
                    )
                ) || [];


            carrinho.push({

                id: produtoEncontrado,

                nome: produto.nome,

                preco: produto.preco,

                imagem: produto.imagem,

                quantidade: 1

            });


            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );


            console.log(
                "🛒 Adicionado:",
                produto.nome
            );


            window.location.href =
                "carrinho.html";

        }
    );

}


// ========================================
// CANCELAR
// ========================================

if (cancelar) {

    cancelar.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// ========================================
// FECHAR
// ========================================

if (fechar) {

    fechar.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}
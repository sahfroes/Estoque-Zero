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
    localStorage.getItem("produtoEncontrado");

console.log("🔎 Produto encontrado:", produtoEncontrado);


// ========================================
// PROCURAR PRODUTO
// ========================================

const produto =
    produtos[produtoEncontrado];


// ========================================
// ELEMENTOS
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
// MOSTRAR PRODUTO
// ========================================

if (produto) {

    console.log("✅ Produto carregado:", produto);

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

    imagemProduto.src =
        produto.imagem;

    imagemProduto.alt =
        produto.nome;

} else {

    console.error(
        "❌ Produto não encontrado:",
        produtoEncontrado
    );

    nomeProduto.textContent =
        "Produto não encontrado";

    precoProduto.textContent =
        "R$ 0,00";
}


// ========================================
// ADICIONAR AO CARRINHO
// ========================================

if (adicionar) {

    adicionar.addEventListener("click", function () {

        if (!produto) {

            console.error(
                "❌ Não foi possível adicionar."
            );

            return;
        }


        // Pega carrinho existente

        let carrinho = [];

        try {

            carrinho =
                JSON.parse(
                    localStorage.getItem("carrinho")
                ) || [];

        } catch (erro) {

            console.error(
                "❌ Erro no carrinho:",
                erro
            );

            carrinho = [];
        }


        // Verifica se já existe

        const existente =
            carrinho.find(
                item =>
                    item.id === produtoEncontrado
            );


        if (existente) {

            existente.quantidade =
                Number(existente.quantidade) + 1;

        } else {

            carrinho.push({

                id:
                    produtoEncontrado,

                nome:
                    produto.nome,

                preco:
                    Number(produto.preco),

                imagem:
                    produto.imagem,

                quantidade:
                    1

            });

        }


        // Salva

        localStorage.setItem(
            "carrinho",
            JSON.stringify(carrinho)
        );


        console.log(
            "🛒 CARRINHO SALVO:",
            carrinho
        );


        // Vai para o carrinho

        window.location.href =
            "carrinho.html";

    });

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
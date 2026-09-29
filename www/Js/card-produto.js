// ==========================================
// ESTOQUE ZERO
// CARD DO PRODUTO
// ==========================================


// ==========================================
// PRODUTOS
// ==========================================

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


// ==========================================
// PEGAR PARÂMETRO DA URL
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const produtoDaURL =
    parametros.get("produto");


console.log(
    "🔗 Produto recebido pela URL:",
    produtoDaURL
);


// ==========================================
// LOCAL STORAGE
// ==========================================

const produtoDoStorage =
    localStorage.getItem(
        "produtoEncontrado"
    );


console.log(
    "💾 Produto no Storage:",
    produtoDoStorage
);


// ==========================================
// ESCOLHER PRODUTO
// ==========================================

const produtoEncontrado =
    produtoDaURL ||
    produtoDoStorage;


console.log(
    "🎯 Produto escolhido:",
    produtoEncontrado
);


// ==========================================
// PEGAR PRODUTO
// ==========================================

const produto =
    produtos[produtoEncontrado];


// ==========================================
// ELEMENTOS
// ==========================================

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


// ==========================================
// PRODUTO EXISTE
// ==========================================

if (produto) {

    console.log(
        "✅ Produto carregado:",
        produto
    );


    // ======================================
    // NOME
    // ======================================

    nomeProduto.textContent =
        produto.nome;


    // ======================================
    // PREÇO
    // ======================================

    precoProduto.textContent =
        Number(
            produto.preco
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );


    // ======================================
    // IMAGEM
    // ======================================

    imagemProduto.src =
        produto.imagem;

    imagemProduto.alt =
        produto.nome;


    // ======================================
    // ERRO IMAGEM
    // ======================================

    imagemProduto.onerror =
        function () {

            console.error(
                "❌ Erro ao carregar imagem:",
                produto.imagem
            );

        };

}
else {

    console.error(
        "❌ Produto não encontrado:",
        produtoEncontrado
    );


    nomeProduto.textContent =
        "Produto não encontrado";


    precoProduto.textContent =
        "R$ 0,00";


    imagemProduto.removeAttribute(
        "src"
    );

}


// ==========================================
// ADICIONAR AO CARRINHO
// ==========================================

if (adicionar) {

    adicionar.addEventListener(
        "click",
        function () {

            console.log(
                "🛒 Adicionar ao carrinho"
            );


            // ==================================
            // VERIFICAR
            // ==================================

            if (!produto) {

                console.error(
                    "❌ Produto inválido."
                );

                return;

            }


            // ==================================
            // PEGAR CARRINHO
            // ==================================

            let carrinho = [];


            try {

                const salvo =
                    localStorage.getItem(
                        "carrinho"
                    );


                if (salvo) {

                    carrinho =
                        JSON.parse(
                            salvo
                        );

                }

            }
            catch (erro) {

                console.error(
                    "❌ Erro ao ler carrinho:",
                    erro
                );

                carrinho = [];

            }


            // ==================================
            // PROCURAR PRODUTO
            // ==================================

            const existente =
                carrinho.find(
                    function (item) {

                        return item.id ===
                            produtoEncontrado;

                    }
                );


            // ==================================
            // SE JÁ EXISTE
            // ==================================

            if (existente) {

                existente.quantidade =
                    Number(
                        existente.quantidade
                    ) + 1;


                console.log(
                    "➕ Quantidade:",
                    existente.quantidade
                );

            }


            // ==================================
            // NOVO PRODUTO
            // ==================================

            else {

                carrinho.push({

                    id:
                        produtoEncontrado,

                    nome:
                        produto.nome,

                    preco:
                        Number(
                            produto.preco
                        ),

                    imagem:
                        produto.imagem,

                    quantidade:
                        1

                });


                console.log(
                    "✅ Produto adicionado."
                );

            }


            // ==================================
            // SALVAR
            // ==================================

            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );


            console.log(
                "🛒 Carrinho:",
                carrinho
            );


            // ==================================
            // IR PARA CARRINHO
            // ==================================

            window.location.href =
                "carrinho.html";

        }
    );

}


// ==========================================
// CANCELAR
// ==========================================

if (cancelar) {

    cancelar.addEventListener(
        "click",
        function () {

            window.location.href =
                "camera.html";

        }
    );

}


// ==========================================
// FECHAR
// ==========================================

if (fechar) {

    fechar.addEventListener(
        "click",
        function () {

            window.location.href =
                "camera.html";

        }
    );

}


// ==========================================
// DEBUG
// ==========================================

console.log(
    "📱 Card carregado."
);

console.log(
    "🌐 URL:",
    window.location.href
);
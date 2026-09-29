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
// PEGAR PRODUTO DA URL
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
// PEGAR PRODUTO DO LOCALSTORAGE
// ==========================================

const produtoDoStorage =
    localStorage.getItem(
        "produtoEncontrado"
    );


console.log(
    "💾 Produto no localStorage:",
    produtoDoStorage
);


// ==========================================
// ESCOLHER PRODUTO
// ==========================================

const produtoEncontrado =
    produtoDaURL ||
    produtoDoStorage;


console.log(
    "🎯 Produto utilizado:",
    produtoEncontrado
);


// ==========================================
// SALVAR NOVAMENTE
// ==========================================

if (produtoEncontrado) {

    localStorage.setItem(
        "produtoEncontrado",
        produtoEncontrado
    );

}


// ==========================================
// PEGAR PRODUTO
// ==========================================

const produto =
    produtos[produtoEncontrado];


// ==========================================
// ELEMENTOS DA TELA
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
// VERIFICAR ELEMENTOS
// ==========================================

console.log(
    "🖼️ Elemento imagem:",
    imagemProduto
);

console.log(
    "🏷️ Elemento nome:",
    nomeProduto
);

console.log(
    "💰 Elemento preço:",
    precoProduto
);


// ==========================================
// MOSTRAR PRODUTO
// ==========================================

if (produto) {

    console.log(
        "✅ Produto carregado:",
        produto
    );


    // --------------------------------------
    // NOME
    // --------------------------------------

    if (nomeProduto) {

        nomeProduto.textContent =
            produto.nome;

    }


    // --------------------------------------
    // PREÇO
    // --------------------------------------

    if (precoProduto) {

        precoProduto.textContent =
            produto.preco.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    // --------------------------------------
    // IMAGEM
    // --------------------------------------

    if (imagemProduto) {

        imagemProduto.src =
            produto.imagem;

        imagemProduto.alt =
            produto.nome;


        // ----------------------------------
        // ERRO NA IMAGEM
        // ----------------------------------

        imagemProduto.onerror =
            function () {

                console.error(
                    "❌ Não foi possível carregar:",
                    produto.imagem
                );

            };

    }

}
else {

    console.error(
        "❌ Produto não encontrado:",
        produtoEncontrado
    );


    // --------------------------------------
    // MOSTRAR ERRO
    // --------------------------------------

    if (nomeProduto) {

        nomeProduto.textContent =
            "Produto não encontrado";

    }


    if (precoProduto) {

        precoProduto.textContent =
            "R$ 0,00";

    }

}


// ==========================================
// ADICIONAR AO CARRINHO
// ==========================================

if (adicionar) {

    adicionar.addEventListener(
        "click",
        function () {

            console.log(
                "🛒 Botão adicionar clicado."
            );


            // --------------------------------
            // VERIFICAR PRODUTO
            // --------------------------------

            if (!produto) {

                console.error(
                    "❌ Não foi possível adicionar."
                );

                return;

            }


            // --------------------------------
            // PEGAR CARRINHO
            // --------------------------------

            let carrinho = [];


            try {

                carrinho =
                    JSON.parse(
                        localStorage.getItem(
                            "carrinho"
                        )
                    ) || [];

            }
            catch (erro) {

                console.error(
                    "❌ Erro ao ler carrinho:",
                    erro
                );

                carrinho = [];

            }


            // --------------------------------
            // PROCURAR PRODUTO EXISTENTE
            // --------------------------------

            const existente =
                carrinho.find(
                    function (item) {

                        return item.id ===
                            produtoEncontrado;

                    }
                );


            // --------------------------------
            // AUMENTAR QUANTIDADE
            // --------------------------------

            if (existente) {

                existente.quantidade =
                    Number(
                        existente.quantidade
                    ) + 1;


                console.log(
                    "➕ Quantidade aumentada:",
                    existente.quantidade
                );

            }


            // --------------------------------
            // ADICIONAR NOVO
            // --------------------------------

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


            // --------------------------------
            // SALVAR CARRINHO
            // --------------------------------

            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );


            console.log(
                "🛒 Carrinho atualizado:",
                carrinho
            );


            // --------------------------------
            // IR PARA CARRINHO
            // --------------------------------

            window.location.href =
                "carrinho.html";

        }
    );

}


// ==========================================
// BOTÃO CANCELAR
// ==========================================

if (cancelar) {

    cancelar.addEventListener(
        "click",
        function () {

            console.log(
                "❌ Cancelando produto."
            );

            window.history.back();

        }
    );

}


// ==========================================
// BOTÃO FECHAR
// ==========================================

if (fechar) {

    fechar.addEventListener(
        "click",
        function () {

            console.log(
                "❌ Fechando card."
            );

            window.history.back();

        }
    );

}


// ==========================================
// PÁGINA CARREGADA
// ==========================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "📱 Card do produto carregado."
        );

        console.log(
            "🌐 URL:",
            window.location.href
        );

    }
);
// ==========================================
// ESTOQUE ZERO
// CARD DO PRODUTO
// ==========================================


// ==========================================
// PRODUTOS
// ==========================================

const produtos = {

    leite: {
        id: "leite",
        nome: "Leite UHT Integral 1 L",
        preco: 7.50,
        imagem: "../../img/produtos/leite.png"
    },

    feijao: {
        id: "feijao",
        nome: "Feijão Carioca 1 kg",
        preco: 8.00,
        imagem: "../../img/produtos/feijao.png"
    },

    arroz: {
        id: "arroz",
        nome: "Arroz Branco 5 kg",
        preco: 25.00,
        imagem: "../../img/produtos/arroz.jpeg"
    },

    macarrao: {
        id: "macarrao",
        nome: "Macarrão 500 g",
        preco: 5.00,
        imagem: "../../img/produtos/macarrao.jpeg"
    },

    oleo: {
        id: "oleo",
        nome: "Óleo de Soja 900 ml",
        preco: 8.00,
        imagem: "../../img/produtos/oleo.jpeg"
    },

    acucar: {
        id: "acucar",
        nome: "Açúcar Refinado 1 kg",
        preco: 5.00,
        imagem: "../../img/produtos/acucar.jpeg"
    },

    bombons: {
        id: "bombons",
        nome: "Caixa de Bombons",
        preco: 12.00,
        imagem: "../../img/produtos/bombons.jpeg"
    },

    giftcard: {
        id: "giftcard",
        nome: "Gift Card",
        preco: 20.00,
        imagem: "../../img/produtos/giftcard.png"
    },

    copo: {
        id: "copo",
        nome: "Copo Térmico",
        preco: 15.00,
        imagem: "../../img/produtos/copo.jpg"
    },

    boneco: {
        id: "boneco",
        nome: "Boneco Colecionável",
        preco: 18.00,
        imagem: "../../img/produtos/boneco.jpeg"
    }

};


// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const imagemProduto =
    document.getElementById("imagemProduto");

const nomeProduto =
    document.getElementById("nomeProduto");

const precoProduto =
    document.getElementById("precoProduto");

const botaoAdicionar =
    document.getElementById("adicionar");

const botaoCancelar =
    document.getElementById("cancelar");

const botaoFechar =
    document.getElementById("fechar");


// ==========================================
// PEGAR PRODUTO DA URL
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const produtoDaURL =
    parametros.get("produto");


// ==========================================
// PEGAR PRODUTO DO LOCALSTORAGE
// ==========================================

const produtoDoStorage =
    localStorage.getItem(
        "produtoEncontrado"
    );


// ==========================================
// ESCOLHER PRODUTO
// ==========================================

const produtoId =
    produtoDaURL ||
    produtoDoStorage;


console.log(
    "🔎 Produto recebido:",
    produtoId
);


// ==========================================
// VERIFICAR PRODUTO
// ==========================================

if (!produtoId) {

    console.error(
        "❌ Nenhum produto foi recebido."
    );

}
else {

    const produto =
        produtos[produtoId];


    if (!produto) {

        console.error(
            "❌ Produto não encontrado:",
            produtoId
        );

    }
    else {

        mostrarProduto(produto);

    }

}


// ==========================================
// MOSTRAR PRODUTO
// ==========================================

function mostrarProduto(produto) {

    console.log(
        "🛍️ Mostrando produto:",
        produto
    );


    // ======================================
    // NOME
    // ======================================

    if (nomeProduto) {

        nomeProduto.textContent =
            produto.nome;

    }


    // ======================================
    // PREÇO
    // ======================================

    if (precoProduto) {

        precoProduto.textContent =
            formatarPreco(
                produto.preco
            );

    }


    // ======================================
    // IMAGEM
    // ======================================

    if (imagemProduto) {

        const imagemCompleta =
            new URL(
                produto.imagem,
                window.location.href
            ).href;


        imagemProduto.src =
            imagemCompleta;


        imagemProduto.alt =
            produto.nome;


        console.log(
            "🖼️ Imagem do produto:",
            imagemCompleta
        );


        // ----------------------------------
        // VERIFICAR SE A IMAGEM CARREGOU
        // ----------------------------------

        imagemProduto.addEventListener(
            "load",
            function () {

                console.log(
                    "✅ Imagem carregada."
                );

            }
        );


        imagemProduto.addEventListener(
            "error",
            function () {

                console.error(
                    "❌ Erro ao carregar imagem:",
                    imagemCompleta
                );

            }
        );

    }


    // ======================================
    // SALVAR PRODUTO
    // ======================================

    localStorage.setItem(
        "produtoEncontrado",
        produto.id
    );


    // ======================================
    // SALVAR PRODUTO COMPLETO
    // ======================================

    localStorage.setItem(
        "produtoAtual",
        JSON.stringify({

            id: produto.id,

            nome: produto.nome,

            preco: Number(
                produto.preco
            ),

            imagem: new URL(
                produto.imagem,
                window.location.href
            ).href

        })
    );


    console.log(
        "💾 Produto atual salvo."
    );

}


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
// ADICIONAR AO CARRINHO
// ==========================================

if (botaoAdicionar) {

    botaoAdicionar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();
            evento.stopPropagation();


            console.log(
                "🛒 Adicionar ao carrinho clicado."
            );


            // ==================================
            // PEGAR PRODUTO
            // ==================================

            const produto =
                produtos[produtoId];


            if (!produto) {

                console.error(
                    "❌ Produto inválido:",
                    produtoId
                );

                return;

            }


            // ==================================
            // CARREGAR CARRINHO
            // ==================================

            let carrinho = [];


            const salvo =
                localStorage.getItem(
                    "carrinho"
                );


            console.log(
                "📦 Carrinho antes:",
                salvo
            );


            if (salvo) {

                try {

                    const dados =
                        JSON.parse(salvo);


                    if (
                        Array.isArray(dados)
                    ) {

                        carrinho = dados;

                    }

                }
                catch (erro) {

                    console.error(
                        "❌ Erro ao ler carrinho:",
                        erro
                    );

                    carrinho = [];

                }

            }


            // ==================================
            // IMAGEM COMPLETA
            // ==================================

            const imagemCompleta =
                new URL(
                    produto.imagem,
                    window.location.href
                ).href;


            // ==================================
            // VERIFICAR SE JÁ EXISTE
            // ==================================

            const produtoExistente =
                carrinho.find(
                    function (item) {

                        return (
                            item.id ===
                            produto.id
                        );

                    }
                );


            // ==================================
            // PRODUTO JÁ EXISTE
            // ==================================

            if (produtoExistente) {

                const quantidadeAtual =
                    Number(
                        produtoExistente.quantidade
                    ) || 0;


                if (
                    quantidadeAtual < 3
                ) {

                    produtoExistente.quantidade =
                        quantidadeAtual + 1;

                }


                console.log(
                    "➕ Quantidade aumentada:",
                    produtoExistente
                );

            }


            // ==================================
            // PRODUTO NOVO
            // ==================================

            else {

                carrinho.push({

                    id:
                        produto.id,

                    nome:
                        produto.nome,

                    preco:
                        Number(
                            produto.preco
                        ),

                    imagem:
                        imagemCompleta,

                    quantidade:
                        1

                });


                console.log(
                    "🆕 Produto adicionado:",
                    produto
                );

            }


            // ==================================
            // SALVAR CARRINHO
            // ==================================

            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );


            // ==================================
            // CONFERIR O QUE FOI SALVO
            // ==================================

            console.log(
                "🛒 CARRINHO DEPOIS DE SALVAR:",
                localStorage.getItem(
                    "carrinho"
                )
            );


            console.log(
                "🛒 Carrinho completo:",
                carrinho
            );


            // ==================================
            // IR PARA CARRINHO
            // ==================================

            const urlCarrinho =
                new URL(
                    "carrinho.html",
                    window.location.href
                );


            console.log(
                "➡️ Indo para:",
                urlCarrinho.href
            );


            window.location.assign(
                urlCarrinho.href
            );

        }
    );

}


// ==========================================
// VOLTAR PARA CÂMERA
// ==========================================

function voltarParaCamera() {

    const urlCamera =
        new URL(
            "camera.html",
            window.location.href
        );


    console.log(
        "📷 Voltando para câmera:",
        urlCamera.href
    );


    window.location.assign(
        urlCamera.href
    );

}


// ==========================================
// BOTÃO CANCELAR
// ==========================================

if (botaoCancelar) {

    botaoCancelar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            voltarParaCamera();

        }
    );

}


// ==========================================
// BOTÃO FECHAR
// ==========================================

if (botaoFechar) {

    botaoFechar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            voltarParaCamera();

        }
    );

}
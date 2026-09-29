
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
// ELEMENTOS
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
// DESCOBRIR QUAL PRODUTO FOI IDENTIFICADO
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const produtoDaURL =
    parametros.get("produto");


const produtoDoStorage =
    localStorage.getItem(
        "produtoEncontrado"
    );


const produtoId =
    produtoDaURL ||
    produtoDoStorage;


// ==========================================
// VERIFICAR PRODUTO
// ==========================================

console.log(
    "Produto recebido:",
    produtoId
);


if (!produtoId) {

    console.error(
        "❌ Nenhum produto foi recebido."
    );

} else {

    const produto =
        produtos[produtoId];


    if (!produto) {

        console.error(
            "❌ Produto não encontrado:",
            produtoId
        );

    } else {

        mostrarProduto(produto);

    }

}


// ==========================================
// MOSTRAR PRODUTO
// ==========================================

function mostrarProduto(produto) {

    // Nome

    if (nomeProduto) {

        nomeProduto.textContent =
            produto.nome;

    }


    // Preço

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
            "🖼️ Imagem:",
            imagemCompleta
        );

    }


    // ======================================
    // SALVAR NOVAMENTE
    // ======================================

    localStorage.setItem(
        "produtoEncontrado",
        produto.id
    );


    // Salva também as informações completas

    localStorage.setItem(
        "produtoAtual",
        JSON.stringify({

            id: produto.id,

            nome: produto.nome,

            preco: produto.preco,

            imagem: new URL(
                produto.imagem,
                window.location.href
            ).href

        })
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


            const produto =
                produtos[produtoId];


            if (!produto) {

                console.error(
                    "❌ Produto inválido."
                );

                return;

            }


            // =================================
            // PEGAR CARRINHO
            // =================================

            let carrinho = [];


            try {

                const salvo =
                    localStorage.getItem(
                        "carrinho",
                         JSON.stringify(carrinho)
                    );

                
                if (salvo) {

                    const dados =
                        JSON.parse(salvo);


                    if (Array.isArray(dados)) {

                        carrinho = dados;

                    }

                }

            } catch (erro) {

                console.error(
                    "Erro ao carregar carrinho:",
                    erro
                );

                carrinho = [];

            }


            // =================================
            // IMAGEM COMPLETA
            // =================================

            const imagemCompleta =
                new URL(
                    produto.imagem,
                    window.location.href
                ).href;


            // =================================
            // VERIFICAR SE JÁ EXISTE
            // =================================

            const produtoExistente =
                carrinho.find(
                    function (item) {

                        return item.id ===
                            produto.id;

                    }
                );


            if (produtoExistente) {

                // Máximo 3

                if (
                    Number(
                        produtoExistente.quantidade
                    ) < 3
                ) {

                    produtoExistente.quantidade =
                        Number(
                            produtoExistente.quantidade
                        ) + 1;

                }

            } else {

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

            }


            // =================================
            // SALVAR
            // =================================

            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );
            
            console.log(
    "🛒 CARRINHO DEPOIS DE SALVAR:",
    localStorage.getItem("carrinho")
);            

            console.log(
                "🛒 Carrinho salvo:",
                carrinho
            );


            // =================================
            // IR PARA CARRINHO
            // =================================

            const urlCarrinho =
                new URL(
                    "carrinho.html",
                    window.location.href
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


    window.location.assign(
        urlCamera.href
    );

}


if (botaoCancelar) {

    botaoCancelar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            voltarParaCamera();

        }
    );

}


if (botaoFechar) {

    botaoFechar.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            voltarParaCamera();

        }
    );

}



// ======================================================
// ELEMENTOS DA TELA
// ======================================================

const cena =
    document.getElementById("cena-ra");

const mensagemCamera =
    document.getElementById("mensagem-camera");

const toqueProduto =
    document.getElementById("toque-produto");

const erroCamera =
    document.getElementById("erro-camera");

const textoErro =
    document.getElementById("texto-erro");

const tentarNovamente =
    document.getElementById("tentar-novamente");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const botaoTrocarCamera =
    document.getElementById("trocar-camera");


// ======================================================
// MODELOS 3D
// ======================================================

const produtoLeite =
    document.getElementById("produto-leite");

const produtoFeijao =
    document.getElementById("produto-feijao");

const produtoArroz =
    document.getElementById("produto-arroz");

const produtoMacarrao =
    document.getElementById("produto-macarrao");

const produtoOleo =
    document.getElementById("produto-oleo");

const produtoAcucar =
    document.getElementById("produto-acucar");

const produtoBombons =
    document.getElementById("produto-bombons");

const produtoGiftcard =
    document.getElementById("produto-giftcard");

const produtoCopo =
    document.getElementById("produto-copo");

const produtoBoneco =
    document.getElementById("produto-boneco");


// ======================================================
// CATÁLOGO DE PRODUTOS
// ======================================================

const produtos = {

    leite: {
        nome: "Leite UHT Integral 1 L",
        preco: 7.50
    },

    feijao: {
        nome: "Feijão Carioca 1 kg",
        preco: 8.00
    },

    arroz: {
        nome: "Arroz Branco 5 kg",
        preco: 25.00
    },

    macarrao: {
        nome: "Macarrão 500 g",
        preco: 5.00
    },

    oleo: {
        nome: "Óleo de Soja 900 ml",
        preco: 8.00
    },

    acucar: {
        nome: "Açúcar Refinado 1 kg",
        preco: 5.00
    },

    bombons: {
        nome: "Caixa de Bombons",
        preco: 12.00
    },

    giftcard: {
        nome: "Gift Card",
        preco: 20.00
    },

    copo: {
        nome: "Copo Térmico",
        preco: 15.00
    },

    boneco: {
        nome: "Boneco Colecionável",
        preco: 18.00
    }

};


// ======================================================
// VARIÁVEIS DE CONTROLE
// ======================================================

// Produto atualmente reconhecido
let produtoIdAtivo = null;

// Evita abrir o card duas vezes
let abrindoCard = false;

// Evita touchend + click abrirem juntos
let ultimoToque = 0;

// Guarda se o AR já encontrou algum produto
let produtoEncontrado = false;


// ======================================================
// SALVAR PRODUTO IDENTIFICADO
// ======================================================

function salvarProduto(produtoId) {

    if (!produtoId) {

        console.warn(
            "⚠️ Nenhum ID de produto recebido."
        );

        return false;
    }


    const produto =
        produtos[produtoId];


    if (!produto) {

        console.error(
            "❌ Produto não encontrado no catálogo:",
            produtoId
        );

        return false;
    }


    // --------------------------------------------------
    // PRODUTO ATIVO
    // --------------------------------------------------

    produtoIdAtivo =
        produtoId;

    produtoEncontrado =
        true;


    // --------------------------------------------------
    // LOCAL STORAGE
    // --------------------------------------------------

    localStorage.setItem(
        "produtoEncontrado",
        produtoId
    );

    localStorage.setItem(
        "nomeProdutoEncontrado",
        produto.nome
    );

    localStorage.setItem(
        "precoProdutoEncontrado",
        produto.preco
    );


    // --------------------------------------------------
    // LOG
    // --------------------------------------------------

    console.log(
        "=========================================="
    );

    console.log(
        "🛒 PRODUTO IDENTIFICADO"
    );

    console.log(
        "ID:",
        produtoId
    );

    console.log(
        "Nome:",
        produto.nome
    );

    console.log(
        "Preço:",
        `R$ ${produto.preco.toFixed(2).replace(".", ",")}`
    );

    console.log(
        "=========================================="
    );


    return true;
}


// ======================================================
// ABRIR CARD DO PRODUTO
// ======================================================

function abrirCardProduto() {

    // --------------------------------------------------
    // EVITA DUPLICIDADE
    // --------------------------------------------------

    if (abrindoCard) {

        console.log(
            "⚠️ O card já está sendo aberto."
        );

        return;
    }


    // --------------------------------------------------
    // VERIFICA PRODUTO
    // --------------------------------------------------

    if (!produtoIdAtivo) {

        console.warn(
            "⚠️ Nenhum produto foi identificado."
        );

        return;
    }


    const produto =
        produtos[produtoIdAtivo];


    if (!produto) {

        console.error(
            "❌ Produto inválido:",
            produtoIdAtivo
        );

        return;
    }


    // --------------------------------------------------
    // BLOQUEIA NOVA ABERTURA
    // --------------------------------------------------

    abrindoCard = true;


    // --------------------------------------------------
    // GARANTE DADOS SALVOS
    // --------------------------------------------------

    salvarProduto(
        produtoIdAtivo
    );


    // --------------------------------------------------
    // ESCONDE MENSAGEM
    // --------------------------------------------------

    if (toqueProduto) {

        toqueProduto.style.display =
            "none";
    }


    // --------------------------------------------------
    // LOG
    // --------------------------------------------------

    console.log(
        "➡️ Abrindo card do produto:",
        produto.nome
    );


    // --------------------------------------------------
    // MONTA URL
    // --------------------------------------------------

    const url =
        new URL(
            "card-produto.html",
            window.location.href
        );


    url.searchParams.set(
        "produto",
        produtoIdAtivo
    );


    // --------------------------------------------------
    // NAVEGA
    // --------------------------------------------------

    window.location.assign(
        url.href
    );
}


// ======================================================
// CONFIGURAR TOQUE / CLIQUE
// ======================================================

function configurarToque() {

    if (!cena) {

        console.error(
            "❌ #cena-ra não encontrada."
        );

        return;
    }


    const canvas =
        cena.canvas;


    if (!canvas) {

        console.warn(
            "⚠️ Canvas do A-Frame ainda não disponível."
        );

        return;
    }


    // --------------------------------------------------
    // CONFIGURAÇÕES DO CANVAS
    // --------------------------------------------------

    canvas.style.touchAction =
        "manipulation";

    canvas.style.cursor =
        "pointer";


    // --------------------------------------------------
    // TOUCH END
    // --------------------------------------------------

    canvas.addEventListener(
        "touchend",
        function (evento) {

            console.log(
                "👆 Toque detectado no celular."
            );


            // Evita comportamento padrão
            evento.preventDefault();


            // Verifica produto
            if (!produtoIdAtivo) {

                console.log(
                    "⚠️ Nenhum produto ativo."
                );

                return;
            }


            // Registra momento do toque
            ultimoToque =
                Date.now();


            abrirCardProduto();

        },
        {
            passive: false
        }
    );


    // --------------------------------------------------
    // CLICK
    // --------------------------------------------------

    canvas.addEventListener(
        "click",
        function () {

            // Se acabou de acontecer um touch,
            // ignora o click gerado pelo navegador.
            if (
                Date.now() - ultimoToque <
                500
            ) {

                console.log(
                    "ℹ️ Clique ignorado após toque."
                );

                return;
            }


            console.log(
                "🖱️ Clique detectado no computador."
            );


            if (!produtoIdAtivo) {

                console.log(
                    "⚠️ Nenhum produto ativo."
                );

                return;
            }


            abrirCardProduto();

        }
    );


    console.log(
        "✅ Sistema de toque/clique configurado."
    );
}


// ======================================================
// MINDAR - AR PRONTO
// ======================================================

if (cena) {

    cena.addEventListener(
        "arReady",
        function () {

            console.log(
                "=========================================="
            );

            console.log(
                "🟢 MINDAR PRONTO!"
            );

            console.log(
                "📷 Câmera funcionando."
            );

            console.log(
                "=========================================="
            );


            if (mensagemCamera) {

                mensagemCamera.style.display =
                    "none";
            }

        }
    );


    // ==================================================
    // ERRO DO MINDAR
    // ==================================================

    cena.addEventListener(
        "arError",
        function (evento) {

            console.error(
                "❌ Erro no MindAR:",
                evento
            );


            mostrarErro(
                "Não foi possível iniciar a câmera."
            );

        }
    );

}


// ======================================================
// TARGETS DO MINDAR
// ======================================================

const targets =
    document.querySelectorAll(
        "[mindar-image-target]"
    );


console.log(
    "🎯 Targets encontrados:",
    targets.length
);


// ======================================================
// CONFIGURAR TARGETS
// ======================================================

targets.forEach(
    function (target) {

        const produto =
            target.dataset.produto;


        // ------------------------------------------------
        // TARGET ENCONTRADO
        // ------------------------------------------------

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "=========================================="
                );

                console.log(
                    "🎯 TARGET ENCONTRADO"
                );

                console.log(
                    "📦 Produto:",
                    produto
                );

                console.log(
                    "🔢 Target:",
                    target.getAttribute(
                        "mindar-image-target"
                    )
                );

                console.log(
                    "=========================================="
                );


                // ------------------------------------------------
                // VERIFICA PRODUTO
                // ------------------------------------------------

                if (!produtos[produto]) {

                    console.error(
                        "❌ Produto não cadastrado:",
                        produto
                    );

                    return;
                }


                // ------------------------------------------------
                // SALVA PRODUTO
                // ------------------------------------------------

                salvarProduto(
                    produto
                );


                // ------------------------------------------------
                // MOSTRA INSTRUÇÃO
                // ------------------------------------------------

                if (toqueProduto) {

                    toqueProduto.style.display =
                        "flex";
                }


                // ------------------------------------------------
                // ESCONDE MENSAGEM DA CÂMERA
                // ------------------------------------------------

                if (mensagemCamera) {

                    mensagemCamera.style.display =
                        "none";
                }


                // ------------------------------------------------
                // LOG ÚNICO PARA O MODELO 3D
                // ------------------------------------------------

                console.log(
                    `🟢 MODELO 3D IDENTIFICADO: ${produto.toUpperCase()}`
                );

            }
        );


        // ------------------------------------------------
        // TARGET PERDIDO
        // ------------------------------------------------

        target.addEventListener(
            "targetLost",
            function () {

                console.log(
                    "📭 Target perdido:",
                    produto
                );

                // Não apagamos produtoIdAtivo.
                // Assim o usuário ainda pode tocar
                // e abrir o produto identificado.

            }
        );

    }
);


// ======================================================
// CONFIGURAR MODELO 3D
// ======================================================

function configurarModelo3D(
    elemento,
    nome,
    arquivo,
    escala = "0.5 0.5 0.5",
    rotacao = "0 0 0"
) {

    // --------------------------------------------------
    // VERIFICAR ELEMENTO
    // --------------------------------------------------

    if (!elemento) {

        console.error(
            `❌ Elemento 3D do ${nome} não encontrado.`
        );

        return;
    }


    console.log(
        `🔎 Elemento 3D do ${nome} encontrado.`
    );


    // --------------------------------------------------
    // MODELO CARREGADO
    // --------------------------------------------------

    elemento.addEventListener(
        "model-loaded",
        function () {

            console.log(
                "=========================================="
            );

            console.log(
                `🟢 MODELO 3D DO ${nome.toUpperCase()} CARREGADO!`
            );

            console.log(
                `📦 Arquivo: ${arquivo}`
            );

            console.log(
                "=========================================="
            );


            // Aplica escala
            elemento.setAttribute(
                "scale",
                escala
            );


            // Aplica posição
            elemento.setAttribute(
                "position",
                "0 0 0.1"
            );


            // Aplica rotação
            elemento.setAttribute(
                "rotation",
                rotacao
            );

        }
    );


    // --------------------------------------------------
    // ERRO NO MODELO
    // --------------------------------------------------

    elemento.addEventListener(
        "model-error",
        function (evento) {

            console.error(
                "=========================================="
            );

            console.error(
                `❌ ERRO AO CARREGAR ${arquivo}`
            );

            console.error(
                evento
            );

            console.error(
                "=========================================="
            );

        }
    );

}


// ======================================================
// CONFIGURAÇÃO DOS 10 MODELOS 3D
// ======================================================

configurarModelo3D(
    produtoLeite,
    "leite",
    "leite3D.glb"
);


configurarModelo3D(
    produtoFeijao,
    "feijão",
    "feijao.glb"
);


configurarModelo3D(
    produtoArroz,
    "arroz",
    "arroz.glb"
);


configurarModelo3D(
    produtoMacarrao,
    "macarrão",
    "macarrao.glb"
);


configurarModelo3D(
    produtoOleo,
    "óleo",
    "oleo.glb"
);


configurarModelo3D(
    produtoAcucar,
    "açúcar",
    "acucar3D.glb"
);


configurarModelo3D(
    produtoBombons,
    "bombons",
    "bombons3D.glb"
);


configurarModelo3D(
    produtoGiftcard,
    "gift card",
    "giftcard.glb"
);


configurarModelo3D(
    produtoCopo,
    "copo",
    "copo3D.glb"
);


configurarModelo3D(
    produtoBoneco,
    "boneco",
    "gojo.glb",
    "0.5 0.5 0.5",
    "0 180 0"
);


// ======================================================
// BOTÃO CARRINHO
// ======================================================

if (botaoCarrinho) {

    botaoCarrinho.addEventListener(
        "click",
        function () {

            console.log(
                "🛒 Abrindo carrinho..."
            );

            window.location.href =
                "carrinho.html";

        }
    );

}


// ======================================================
// TROCAR CÂMERA
// ======================================================

if (botaoTrocarCamera) {

    botaoTrocarCamera.addEventListener(
        "click",
        function () {

            console.log(
                "🔄 Reiniciando câmera..."
            );

            window.location.reload();

        }
    );

}


// ======================================================
// TENTAR NOVAMENTE
// ======================================================

if (tentarNovamente) {

    tentarNovamente.addEventListener(
        "click",
        function () {

            console.log(
                "🔄 Tentando iniciar novamente..."
            );

            window.location.reload();

        }
    );

}


// ======================================================
// MOSTRAR ERRO
// ======================================================

function mostrarErro(mensagem) {

    if (erroCamera) {

        erroCamera.style.display =
            "flex";
    }


    if (textoErro) {

        textoErro.textContent =
            mensagem;
    }


    if (mensagemCamera) {

        mensagemCamera.style.display =
            "none";
    }

}


// ======================================================
// CONFIGURAR TOQUE APÓS CARREGAMENTO
// ======================================================

if (cena) {

    cena.addEventListener(
        "loaded",
        function () {

            console.log(
                "🟢 Cena A-Frame carregada."
            );


            setTimeout(
                function () {

                    configurarToque();

                },
                1000
            );

        }
    );

}


// ======================================================
// ORÇAMENTO
// ======================================================

const orcamentoSalvo =
    localStorage.getItem(
        "orcamentoSelecionado"
    );


if (orcamentoSalvo) {

    console.log(
        "💰 Orçamento da partida:",
        orcamentoSalvo
    );

} else {

    console.warn(
        "⚠️ Nenhum orçamento encontrado."
    );

}


// ======================================================
// DEBUG INICIAL
// ======================================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "=========================================="
        );

        console.log(
            "🚀 ESTOQUE ZERO - CAMERA.JS"
        );

        console.log(
            "=========================================="
        );


        console.log(
            "📷 Cena:",
            cena
        );


        console.log(
            "🎯 Quantidade de targets:",
            targets.length
        );


        console.log(
            "🥛 Leite 3D:",
            produtoLeite
        );


        console.log(
            "🫘 Feijão 3D:",
            produtoFeijao
        );


        console.log(
            "🍚 Arroz 3D:",
            produtoArroz
        );


        console.log(
            "🍝 Macarrão 3D:",
            produtoMacarrao
        );


        console.log(
            "🛢️ Óleo 3D:",
            produtoOleo
        );


        console.log(
            "🍬 Açúcar 3D:",
            produtoAcucar
        );


        console.log(
            "🍫 Bombons 3D:",
            produtoBombons
        );


        console.log(
            "🎁 Gift Card 3D:",
            produtoGiftcard
        );


        console.log(
            "🥤 Copo 3D:",
            produtoCopo
        );


        console.log(
            "🧸 Boneco 3D:",
            produtoBoneco
        );


        console.log(
            "💰 Orçamento:",
            orcamentoSalvo
        );


        console.log(
            "=========================================="
        );

    }
);
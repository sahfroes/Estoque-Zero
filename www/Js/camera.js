// ======================================================
// ESTOQUE ZERO - CÂMERA AR
// MindAR + A-Frame + modelos 3D clicáveis
// ======================================================


// ======================================================
// ELEMENTOS PRINCIPAIS
// ======================================================

const cenaRA = document.getElementById("cena-ra");

const saldoElemento =
    document.getElementById("saldo");

const tempoElemento =
    document.getElementById("tempo");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const botaoTrocarCamera =
    document.getElementById("trocar-camera");

const erroCamera =
    document.getElementById("erro-camera");

const mensagemCamera =
    document.getElementById("mensagem-camera");


// ======================================================
// PRODUTOS 3D
// IMPORTANTE:
// São os A-ENTITY que aparecem na cena.
// ======================================================

const modelos = {

    leite:
        document.getElementById("produto-leite"),

    feijao:
        document.getElementById("produto-feijao"),

    arroz:
        document.getElementById("produto-arroz"),

    macarrao:
        document.getElementById("produto-macarrao"),

    oleo:
        document.getElementById("produto-oleo"),

    acucar:
        document.getElementById("produto-acucar"),

    bombons:
        document.getElementById("produto-bombons"),

    giftcard:
        document.getElementById("produto-giftcard"),

    copo:
        document.getElementById("produto-copo"),

    boneco:
        document.getElementById("produto-boneco")

};


// ======================================================
// PRODUTOS
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
// VARIÁVEIS
// ======================================================

let produtoAtual = null;

let produtoDetectado = null;

let cameraAtual = "environment";

let abrindoCard = false;

let ultimoToque = 0;

let ultimoTarget = null;


// ======================================================
// RAYCASTER
// ======================================================

let raycaster = null;

let mouse = null;


// ======================================================
// FORMATAR PREÇO
// ======================================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ======================================================
// ESCONDER MENSAGEM DE CARREGAMENTO
// ======================================================

function esconderMensagemCamera() {

    if (!mensagemCamera) {
        return;
    }

    mensagemCamera.style.display = "none";

    console.log(
        "✅ Mensagem 'Iniciando câmera...' escondida."
    );

}


// ======================================================
// CARREGAR ORÇAMENTO
// ======================================================

function carregarOrcamento() {

    const valorSalvo =
        localStorage.getItem(
            "orcamentoSelecionado"
        );

    const orcamento =
        Number(valorSalvo);

    console.log(
        "================================="
    );

    console.log(
        "💰 VERIFICANDO ORÇAMENTO"
    );

    console.log(
        "Valor encontrado:",
        valorSalvo
    );

    console.log(
        "Valor convertido:",
        orcamento
    );


    if (
        !Number.isFinite(orcamento) ||
        orcamento <= 0
    ) {

        console.error(
            "❌ Nenhum orçamento válido encontrado."
        );

        if (saldoElemento) {

            saldoElemento.textContent =
                "R$ 0,00";

        }

        return 0;
    }


    if (saldoElemento) {

        saldoElemento.textContent =
            formatarPreco(orcamento);

    }


    console.log(
        "✅ Orçamento carregado:",
        formatarPreco(orcamento)
    );

    console.log(
        "================================="
    );


    return orcamento;

}


// ======================================================
// ORÇAMENTO ATUAL
// ======================================================

const orcamentoAtual =
    carregarOrcamento();


// ======================================================
// SALVAR PRODUTO
// ======================================================

function salvarProduto(chaveProduto) {

    const produto =
        produtos[chaveProduto];


    if (!produto) {

        console.error(
            "❌ Produto não encontrado:",
            chaveProduto
        );

        return false;
    }


    localStorage.setItem(
        "produtoEncontrado",
        chaveProduto
    );

    localStorage.setItem(
        "nomeProdutoEncontrado",
        produto.nome
    );

    localStorage.setItem(
        "precoProdutoEncontrado",
        String(produto.preco)
    );


    console.log(
        "================================="
    );

    console.log(
        "💾 PRODUTO SALVO"
    );

    console.log(
        "Produto:",
        produto.nome
    );

    console.log(
        "Preço:",
        formatarPreco(produto.preco)
    );

    console.log(
        "================================="
    );


    return true;

}


// ======================================================
// ABRIR CARD DO PRODUTO
// ======================================================

function abrirCardProduto(chaveProduto) {

    if (abrindoCard) {
        return;
    }


    const produto =
        produtos[chaveProduto];


    if (!produto) {

        console.error(
            "❌ Produto inválido:",
            chaveProduto
        );

        return;
    }


    console.log(
        "🛒 Produto clicado:",
        produto.nome
    );


    const salvo =
        salvarProduto(chaveProduto);


    if (!salvo) {
        return;
    }


    abrindoCard = true;


    console.log(
        "📦 Abrindo card do produto..."
    );


    setTimeout(
        function () {

            window.location.href =
                "card-produto.html?produto=" +
                encodeURIComponent(
                    chaveProduto
                );

        },
        100
    );

}


// ======================================================
// ESCONDER TODOS OS MODELOS
// ======================================================

function esconderTodosModelos() {

    Object.keys(modelos).forEach(
        function (chave) {

            const modelo =
                modelos[chave];


            if (modelo) {

                modelo.setAttribute(
                    "visible",
                    false
                );

            }

        }
    );

}


// ======================================================
// MOSTRAR MODELO
// ======================================================

function mostrarModelo(chaveProduto) {

    esconderTodosModelos();


    const modelo =
        modelos[chaveProduto];


    if (!modelo) {

        console.error(
            "❌ Modelo 3D não encontrado:",
            chaveProduto
        );

        return;
    }


    modelo.setAttribute(
        "visible",
        true
    );


    modelo.classList.add(
        "produto-3d"
    );


    produtoAtual =
        chaveProduto;

    produtoDetectado =
        chaveProduto;

    ultimoTarget =
        chaveProduto;


    console.log(
        "🎯 MODELO 3D ATIVO:",
        chaveProduto
    );


    console.log(
        "🛒 Produto pronto para clique:",
        produtos[chaveProduto].nome
    );

}


// ======================================================
// MAPEAMENTO DOS TARGETS
// ======================================================

const produtosPorTarget = {

    0: "leite",

    1: "feijao",

    2: "arroz",

    3: "macarrao",

    4: "oleo",

    5: "acucar",

    6: "bombons",

    7: "giftcard",

    8: "copo",

    9: "boneco"

};


// ======================================================
// EVENTOS DO MINDAR
// ======================================================

if (cenaRA) {


    // ==================================================
    // A-FRAME CARREGADO
    // ==================================================

    cenaRA.addEventListener(
        "loaded",
        function () {

            console.log(
                "✅ A-Frame carregado."
            );

            esconderMensagemCamera();

        }
    );


    // ==================================================
    // TARGET ENCONTRADO
    // ==================================================

    cenaRA.addEventListener(
        "targetFound",
        function (evento) {

            const indice =
                evento.targetIndex;


            console.log(
                "🎯 TARGET ENCONTRADO:",
                indice
            );


            const chaveProduto =
                produtosPorTarget[indice];


            if (!chaveProduto) {

                console.warn(
                    "⚠️ Nenhum produto para o target:",
                    indice
                );

                return;
            }


            mostrarModelo(
                chaveProduto
            );

        }
    );


    // ==================================================
    // TARGET PERDIDO
    // ==================================================

    cenaRA.addEventListener(
        "targetLost",
        function (evento) {

            const indice =
                evento.targetIndex;


            console.log(
                "❌ TARGET PERDIDO:",
                indice
            );


            const chaveProduto =
                produtosPorTarget[indice];


            /*
             * Não escondemos imediatamente.
             *
             * Isso evita que uma pequena perda
             * de rastreamento do MindAR faça o
             * modelo desaparecer antes do toque.
             */

            if (
                chaveProduto &&
                modelos[chaveProduto]
            ) {

                setTimeout(
                    function () {

                        if (
                            produtoDetectado ===
                            chaveProduto
                        ) {

                            modelos[
                                chaveProduto
                            ].setAttribute(
                                "visible",
                                false
                            );

                        }

                    },
                    500
                );

            }

        }
    );

}


// ======================================================
// INICIALIZAR RAYCASTER
// ======================================================

function iniciarRaycaster() {

    if (
        typeof THREE === "undefined"
    ) {

        console.error(
            "❌ THREE.js ainda não está disponível."
        );

        return false;
    }


    raycaster =
        new THREE.Raycaster();


    mouse =
        new THREE.Vector2();


    console.log(
        "✅ Raycaster inicializado."
    );


    return true;

}


// ======================================================
// PREPARAR COORDENADAS
// ======================================================

function prepararCoordenadas(
    clienteX,
    clienteY
) {

    if (!cenaRA) {
        return false;
    }


    const canvas =
        cenaRA.canvas;


    if (!canvas) {
        return false;
    }


    const retangulo =
        canvas.getBoundingClientRect();


    if (
        retangulo.width === 0 ||
        retangulo.height === 0
    ) {

        return false;
    }


    mouse.x =
        (
            (
                clienteX -
                retangulo.left
            ) /
            retangulo.width
        ) * 2 - 1;


    mouse.y =
        -(
            (
                clienteY -
                retangulo.top
            ) /
            retangulo.height
        ) * 2 + 1;


    return true;

}


// ======================================================
// PROCURAR PRODUTO NO TOQUE
// ======================================================

function procurarProdutoNoToque(
    clienteX,
    clienteY
) {

    if (!cenaRA) {
        return null;
    }


    if (!cenaRA.camera) {

        console.warn(
            "⚠️ Câmera A-Frame ainda não disponível."
        );

        return null;
    }


    if (!raycaster || !mouse) {

        console.warn(
            "⚠️ Raycaster ainda não inicializado."
        );

        return null;
    }


    if (
        !prepararCoordenadas(
            clienteX,
            clienteY
        )
    ) {

        return null;
    }


    // ==================================================
    // CONFIGURAR RAIO
    // ==================================================

    raycaster.setFromCamera(
        mouse,
        cenaRA.camera
    );


    // ==================================================
    // PRODUTO DETECTADO
    // ==================================================

    if (!produtoDetectado) {

        console.log(
            "⚠️ Nenhum produto detectado."
        );

        return null;
    }


    const modelo =
        modelos[produtoDetectado];


    if (!modelo) {

        console.log(
            "⚠️ Entidade 3D não encontrada:",
            produtoDetectado
        );

        return null;
    }


    const visivel =
        modelo.getAttribute(
            "visible"
        );


    if (visivel === false) {

        console.log(
            "⚠️ Modelo está invisível."
        );

        return null;
    }


    if (!modelo.object3D) {

        console.log(
            "⚠️ object3D ainda não carregou."
        );

        return null;
    }


    // ==================================================
    // RAYCAST
    // ==================================================

    const intersecoes =
        raycaster.intersectObject(
            modelo.object3D,
            true
        );


    console.log(
        "🔎 Interseções encontradas:",
        intersecoes.length
    );


    if (
        intersecoes.length === 0
    ) {

        console.log(
            "👆 O toque não atingiu o modelo 3D."
        );

        return null;
    }


    console.log(
        "🎯 TOQUE ATINGIU O MODELO 3D!"
    );


    return produtoDetectado;

}


// ======================================================
// PROCESSAR CLIQUE / TOQUE
// ======================================================

function processarClique(
    clienteX,
    clienteY
) {

    const agora =
        Date.now();


    if (
        agora - ultimoToque <
        400
    ) {

        return;
    }


    ultimoToque =
        agora;


    console.log(
        "================================="
    );


    console.log(
        "👆 CLIQUE/TOQUE DETECTADO"
    );


    console.log(
        "X:",
        clienteX,
        "Y:",
        clienteY
    );


    const chaveProduto =
        procurarProdutoNoToque(
            clienteX,
            clienteY
        );


    if (!chaveProduto) {

        console.log(
            "⚠️ Nenhum produto foi tocado."
        );

        console.log(
            "================================="
        );

        return;
    }


    console.log(
        "✅ PRODUTO SELECIONADO:",
        chaveProduto
    );


    console.log(
        "================================="
    );


    abrirCardProduto(
        chaveProduto
    );

}


// ======================================================
// CONFIGURAR INTERAÇÃO DOS MODELOS
// ======================================================

function configurarCliquesModelos() {

    console.log(
        "🖱️ Configurando cliques dos modelos 3D..."
    );


    Object.keys(modelos).forEach(
        function (chaveProduto) {

            const modelo =
                modelos[chaveProduto];


            if (!modelo) {

                console.error(
                    "❌ Modelo não encontrado:",
                    chaveProduto
                );

                return;
            }


            // ==================================================
            // CLICK DIRETO
            // ==================================================

            modelo.addEventListener(
                "click",
                function (evento) {

                    console.log(
                        "🖱️ CLICK DIRETO NO MODELO:",
                        chaveProduto
                    );


                    if (
                        evento &&
                        evento.stopPropagation
                    ) {

                        evento.stopPropagation();

                    }


                    abrirCardProduto(
                        chaveProduto
                    );

                }
            );


            // ==================================================
            // MODEL-LOADED
            // ==================================================

            modelo.addEventListener(
                "model-loaded",
                function () {

                    console.log(
                        "✅ GLB carregado:",
                        chaveProduto
                    );

                }
            );

        }
    );


    console.log(
        "✅ Cliques dos modelos configurados."
    );

}


// ======================================================
// CONFIGURAR INTERAÇÃO DO CANVAS
// ======================================================

function configurarInteracaoCanvas() {

    if (!cenaRA) {

        console.error(
            "❌ #cena-ra não encontrada."
        );

        return;
    }


    function iniciarEventos() {

        const canvas =
            cenaRA.canvas;


        if (!canvas) {

            console.warn(
                "⚠️ Canvas ainda não disponível."
            );


            setTimeout(
                iniciarEventos,
                500
            );


            return;
        }


        // ==================================================
        // RAYCASTER
        // ==================================================

        if (!raycaster) {

            iniciarRaycaster();

        }


        console.log(
            "✅ Canvas da câmera encontrado."
        );


        // ==================================================
        // DESKTOP
        // ==================================================

        canvas.addEventListener(
            "click",
            function (evento) {

                processarClique(
                    evento.clientX,
                    evento.clientY
                );

            }
        );


        // ==================================================
        // CELULAR
        // ==================================================

        canvas.addEventListener(
            "touchend",
            function (evento) {

                if (
                    !evento.changedTouches ||
                    evento.changedTouches.length === 0
                ) {

                    return;
                }


                const toque =
                    evento.changedTouches[0];


                processarClique(
                    toque.clientX,
                    toque.clientY
                );


                evento.preventDefault();

            },
            {
                passive: false
            }
        );


        console.log(
            "📱 Clique e toque configurados."
        );

    }


    if (cenaRA.hasLoaded) {

        iniciarEventos();

    }
    else {

        cenaRA.addEventListener(
            "loaded",
            iniciarEventos
        );

    }

}


// ======================================================
// INICIAR INTERAÇÃO
// ======================================================

configurarInteracaoCanvas();


// ======================================================
// CONFIGURAR CLIQUES DOS MODELOS
// ======================================================

configurarCliquesModelos();


// ======================================================
// BOTÃO DO CARRINHO
// ======================================================

if (botaoCarrinho) {

    botaoCarrinho.addEventListener(
        "click",
        function () {

            console.log(
                "🛒 Indo para o carrinho..."
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
        async function () {

            try {

                console.log(
                    "📷 Trocando câmera..."
                );


                cameraAtual =
                    cameraAtual ===
                    "environment"
                        ? "user"
                        : "environment";


                const sistemaMindAR =
                    cenaRA &&
                    cenaRA.systems
                        ? cenaRA.systems[
                            "mindar-image-system"
                        ]
                        : null;


                if (
                    sistemaMindAR &&
                    sistemaMindAR.stop
                ) {

                    sistemaMindAR.stop();

                }


                await new Promise(
                    function (resolve) {

                        setTimeout(
                            resolve,
                            300
                        );

                    }
                );


                if (
                    sistemaMindAR &&
                    sistemaMindAR.start
                ) {

                    await sistemaMindAR.start();

                }


                console.log(
                    "✅ Câmera alterada para:",
                    cameraAtual
                );

            }
            catch (erro) {

                console.error(
                    "❌ Erro ao trocar câmera:",
                    erro
                );

            }

        }
    );

}


// ======================================================
// VERIFICAR CÂMERA
// ======================================================

async function verificarCamera() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        console.error(
            "❌ Navegador sem suporte à câmera."
        );


        mostrarErroCamera(
            "Seu navegador não suporta o acesso à câmera."
        );


        return;
    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio: false
                }
            );


        stream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );


        console.log(
            "✅ Permissão da câmera disponível."
        );

    }
    catch (erro) {

        console.error(
            "❌ Não foi possível acessar a câmera:",
            erro
        );


        mostrarErroCamera(
            "Não foi possível acessar a câmera. Verifique a permissão do navegador."
        );

    }

}


// ======================================================
// MOSTRAR ERRO
// ======================================================

function mostrarErroCamera(mensagem) {

    if (!erroCamera) {
        return;
    }


    erroCamera.textContent =
        mensagem;


    erroCamera.style.display =
        "block";

}


// ======================================================
// ESCONDER ERRO
// ======================================================

function esconderErroCamera() {

    if (!erroCamera) {
        return;
    }


    erroCamera.style.display =
        "none";

}


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "📷 Estoque Zero - Câmera AR"
        );


        console.log(
            "💰 Orçamento:",
            formatarPreco(
                orcamentoAtual
            )
        );


        esconderErroCamera();

    }
);


// ======================================================
// VERIFICAR MODELOS
// ======================================================

console.log(
    "🔍 VERIFICANDO MODELOS 3D..."
);


Object.keys(modelos).forEach(
    function (chave) {

        if (modelos[chave]) {

            console.log(
                "✅ Modelo encontrado:",
                chave,
                modelos[chave].id
            );

        }
        else {

            console.error(
                "❌ Modelo NÃO encontrado:",
                chave
            );

        }

    }
);


// ======================================================
// SEGURANÇA:
// ESCONDER TELA DE "INICIANDO CÂMERA"
// ======================================================

setTimeout(
    function () {

        esconderMensagemCamera();

    },
    3000
);


// ======================================================
// FINAL
// ======================================================

console.log(
    "🚀 camera.js carregado."
);
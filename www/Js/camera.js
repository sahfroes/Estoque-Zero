
// ======================================================
// ELEMENTOS PRINCIPAIS
// ======================================================

const cenaRA =
    document.getElementById("cena-ra");

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

const toqueProduto =
    document.getElementById("toque-produto");


// ======================================================
// MODELOS 3D
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
// VARIÁVEIS
// ======================================================

let produtoDetectado = null;

let produtoAtual = null;

let cameraAtual = "environment";

let abrindoCard = false;

let ultimoToque = 0;


// ======================================================
// RAYCASTER
// ======================================================

let raycaster = null;

let mouse = null;

let canvasAR = null;

let raycasterConfigurado = false;


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
// ESCONDER MENSAGEM DA CÂMERA
// ======================================================

function esconderMensagemCamera() {

    if (!mensagemCamera) {
        return;
    }

    mensagemCamera.style.display = "none";

}


// ======================================================
// MOSTRAR MENSAGEM DO PRODUTO
// ======================================================

function mostrarMensagemProduto() {

    if (!toqueProduto) {
        return;
    }

    toqueProduto.classList.add("mostrar");

}


// ======================================================
// ESCONDER MENSAGEM DO PRODUTO
// ======================================================

function esconderMensagemProduto() {

    if (!toqueProduto) {
        return;
    }

    toqueProduto.classList.remove("mostrar");

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
        "💰 Orçamento salvo:",
        valorSalvo
    );


    if (
        !Number.isFinite(orcamento) ||
        orcamento <= 0
    ) {

        console.warn(
            "⚠️ Nenhum orçamento válido."
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
        "💾 Produto salvo:",
        produto.nome
    );


    console.log(
        "💰 Preço:",
        formatarPreco(produto.preco)
    );


    return true;

}


// ======================================================
// ABRIR CARD DO PRODUTO
// ======================================================

function abrirCardProduto(chaveProduto) {

    if (abrindoCard) {

        console.log(
            "⚠️ Card já está sendo aberto."
        );

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
        "================================="
    );


    console.log(
        "🛒 PRODUTO SELECIONADO"
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


    const salvo =
        salvarProduto(chaveProduto);


    if (!salvo) {
        return;
    }


    abrindoCard = true;


    esconderMensagemProduto();


    const url =
        "card-produto.html?produto=" +
        encodeURIComponent(chaveProduto);


    console.log(
        "➡️ Abrindo:",
        url
    );


    window.location.href =
        url;

}


// ======================================================
// ESCONDER TODOS OS MODELOS
// ======================================================

function esconderTodosModelos() {

    Object.keys(modelos).forEach(
        function (chaveProduto) {

            const modelo =
                modelos[chaveProduto];


            if (!modelo) {
                return;
            }


            modelo.setAttribute(
                "visible",
                false
            );

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
            "❌ Modelo não encontrado:",
            chaveProduto
        );

        return;

    }


    // ------------------------------------------
    // MOSTRAR GLB
    // ------------------------------------------

    modelo.setAttribute(
        "visible",
        true
    );


    // ------------------------------------------
    // DEFINIR PRODUTO ATUAL
    // ------------------------------------------

    produtoAtual =
        chaveProduto;

    produtoDetectado =
        chaveProduto;


    // ------------------------------------------
    // LOG
    // ------------------------------------------

    console.log(
        "================================="
    );

    console.log(
        "🎯 TARGET RECONHECIDO"
    );

    console.log(
        "Produto:",
        chaveProduto
    );

    console.log(
        "Nome:",
        produtos[chaveProduto].nome
    );

    console.log(
        "Preço:",
        formatarPreco(
            produtos[chaveProduto].preco
        )
    );

    console.log(
        "================================="
    );


    esconderMensagemCamera();

    mostrarMensagemProduto();


    // ------------------------------------------
    // GARANTIR QUE O MODELO ESTÁ PRONTO
    // ------------------------------------------

    setTimeout(
        function () {

            if (
                modelo.object3D
            ) {

                modelo.object3D.updateMatrixWorld(
                    true
                );

                console.log(
                    "✅ Modelo 3D pronto para Raycaster:",
                    chaveProduto
                );

            }

        },
        100
    );

}


// ======================================================
// MINDAR
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


            configurarRaycaster();


            configurarTargets();

        }
    );


    // ==================================================
    // FALLBACK
    //
    // Caso o evento loaded já tenha acontecido
    // antes deste JS terminar.
    // ==================================================

    setTimeout(
        function () {

            configurarRaycaster();

            configurarTargets();

        },
        1000
    );

}


// ======================================================
// CONFIGURAR TARGETS DO MINDAR
// ======================================================

function configurarTargets() {

    const targets =
        document.querySelectorAll(
            "[mindar-image-target]"
        );


    console.log(
        "🔎 Targets encontrados:",
        targets.length
    );


    targets.forEach(
        function (target) {

            // ------------------------------------------
            // TARGET ENCONTRADO
            // ------------------------------------------

            target.addEventListener(
                "targetFound",
                function () {

                    const atributo =
                        target.getAttribute(
                            "mindar-image-target"
                        );


                    if (!atributo) {
                        return;
                    }


                    const resultado =
                        atributo.match(
                            /targetIndex\s*:\s*(\d+)/
                        );


                    if (!resultado) {

                        console.warn(
                            "⚠️ Não foi possível descobrir targetIndex."
                        );

                        return;

                    }


                    const indice =
                        Number(
                            resultado[1]
                        );


                    const chaveProduto =
                        produtosPorTarget[indice];


                    console.log(
                        "🎯 Target encontrado:",
                        indice,
                        chaveProduto
                    );


                    if (!chaveProduto) {
                        return;
                    }


                    mostrarModelo(
                        chaveProduto
                    );

                }
            );


            // ------------------------------------------
            // TARGET PERDIDO
            // ------------------------------------------

            target.addEventListener(
                "targetLost",
                function () {

                    const atributo =
                        target.getAttribute(
                            "mindar-image-target"
                        );


                    if (!atributo) {
                        return;
                    }


                    const resultado =
                        atributo.match(
                            /targetIndex\s*:\s*(\d+)/
                        );


                    if (!resultado) {
                        return;
                    }


                    const indice =
                        Number(
                            resultado[1]
                        );


                    const chaveProduto =
                        produtosPorTarget[indice];


                    console.log(
                        "⚠️ Target perdido:",
                        chaveProduto
                    );


                    if (
                        produtoDetectado !==
                        chaveProduto
                    ) {

                        return;

                    }


                    setTimeout(
                        function () {

                            if (
                                produtoDetectado !==
                                chaveProduto
                            ) {

                                return;

                            }


                            const modelo =
                                modelos[
                                    chaveProduto
                                ];


                            if (modelo) {

                                modelo.setAttribute(
                                    "visible",
                                    false
                                );

                            }


                            esconderMensagemProduto();


                            console.log(
                                "👁️ Modelo escondido:",
                                chaveProduto
                            );

                        },
                        700
                    );

                }
            );

        }
    );

}


// ======================================================
// CONFIGURAR RAYCASTER
// ======================================================

function configurarRaycaster() {

    if (raycasterConfigurado) {
        return;
    }


    if (
        typeof THREE === "undefined"
    ) {

        console.error(
            "❌ THREE.js não está disponível."
        );

        return;

    }


    if (!cenaRA) {

        console.error(
            "❌ Cena AR não encontrada."
        );

        return;

    }


    // ------------------------------------------
    // RAYCASTER
    // ------------------------------------------

    raycaster =
        new THREE.Raycaster();


    mouse =
        new THREE.Vector2();


    // ------------------------------------------
    // CANVAS
    // ------------------------------------------

    canvasAR =
        cenaRA.canvas;


    if (!canvasAR) {

        console.warn(
            "⚠️ Canvas ainda não disponível."
        );

        setTimeout(
            configurarRaycaster,
            500
        );

        return;

    }


    // ------------------------------------------
    // CONFIGURAÇÃO
    // ------------------------------------------

    canvasAR.style.pointerEvents =
        "auto";


    canvasAR.style.touchAction =
        "manipulation";


    // ------------------------------------------
    // EVENTO POINTERUP
    // ------------------------------------------

    canvasAR.addEventListener(
        "pointerup",
        detectarCliqueNoProduto,
        true
    );


    // ------------------------------------------
    // EVENTO TOUCHEND
    //
    // Fallback para alguns celulares.
    // ------------------------------------------

    canvasAR.addEventListener(
        "touchend",
        detectarToqueNoProduto,
        {
            passive: false,
            capture: true
        }
    );


    raycasterConfigurado =
        true;


    console.log(
        "✅ Raycaster configurado."
    );

}


// ======================================================
// DETECTAR POINTERUP
// ======================================================

function detectarCliqueNoProduto(evento) {

    if (abrindoCard) {
        return;
    }


    // ------------------------------------------
    // IGNORAR UI
    // ------------------------------------------

    if (
        elementoEhInterface(evento.target)
    ) {

        return;

    }


    // ------------------------------------------
    // EVITAR DUPLO EVENTO
    // ------------------------------------------

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
        "👆 Pointer recebido:",
        evento.pointerType
    );


    detectarProdutoNoPonto(
        evento.clientX,
        evento.clientY
    );

}


// ======================================================
// DETECTAR TOUCHEND
// ======================================================

function detectarToqueNoProduto(evento) {

    if (abrindoCard) {
        return;
    }


    if (
        elementoEhInterface(evento.target)
    ) {

        return;

    }


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


    if (
        !evento.changedTouches ||
        !evento.changedTouches.length
    ) {

        return;

    }


    const toque =
        evento.changedTouches[0];


    console.log(
        "📱 Toque recebido."
    );


    detectarProdutoNoPonto(
        toque.clientX,
        toque.clientY
    );

}


// ======================================================
// VERIFICAR SE TOCOU NA INTERFACE
// ======================================================

function elementoEhInterface(elemento) {

    if (!elemento) {
        return false;
    }


    if (
        elemento.closest &&
        elemento.closest(
            "#botao-carrinho, " +
            "#trocar-camera, " +
            ".cabecalho, " +
            ".alerta-tempo, " +
            ".erro-camera, " +
            "button"
        )
    ) {

        return true;

    }


    return false;

}


// ======================================================
// DETECTAR PRODUTO NO PONTO
// ======================================================

function detectarProdutoNoPonto(
    clientX,
    clientY
) {

    if (
        !raycaster ||
        !mouse ||
        !canvasAR ||
        !cenaRA
    ) {

        console.warn(
            "⚠️ Raycaster ainda não está pronto."
        );

        return;

    }


    // ------------------------------------------
    // VERIFICAR CÂMERA THREE.JS
    // ------------------------------------------

    const camera =
        cenaRA.camera;


    if (!camera) {

        console.warn(
            "⚠️ Câmera do A-Frame ainda não disponível."
        );

        return;

    }


    // ------------------------------------------
    // TAMANHO REAL DO CANVAS
    // ------------------------------------------

    const rect =
        canvasAR.getBoundingClientRect();


    if (
        rect.width <= 0 ||
        rect.height <= 0
    ) {

        return;

    }


    // ------------------------------------------
    // TRANSFORMAR COORDENADAS
    // PARA NORMALIZED DEVICE COORDINATES
    // ------------------------------------------

    mouse.x =
        (
            (clientX - rect.left)
            /
            rect.width
        ) * 2 - 1;


    mouse.y =
        -(
            (clientY - rect.top)
            /
            rect.height
        ) * 2 + 1;


    console.log(
        "📍 Coordenadas Raycaster:",
        mouse.x,
        mouse.y
    );


    // ------------------------------------------
    // ATUALIZAR MATRIZES
    // ------------------------------------------

    camera.updateMatrixWorld(
        true
    );


    // ------------------------------------------
    // CRIAR RAY
    // ------------------------------------------

    raycaster.setFromCamera(
        mouse,
        camera
    );


    // ------------------------------------------
    // PROCURAR PRODUTO
    // ------------------------------------------

    let produtoEncontrado =
        null;


    let distanciaMaisProxima =
        Infinity;


    Object.keys(modelos).forEach(
        function (chaveProduto) {

            const modelo =
                modelos[chaveProduto];


            if (!modelo) {
                return;
            }


            // --------------------------------------
            // SÓ VERIFICAR MODELO ATUAL
            // --------------------------------------

            if (
                produtoDetectado !==
                chaveProduto
            ) {

                return;

            }


            // --------------------------------------
            // VERIFICAR VISIBILIDADE
            // --------------------------------------

            if (
                modelo.getAttribute(
                    "visible"
                ) === false
            ) {

                return;

            }


            if (
                !modelo.object3D ||
                !modelo.object3D.visible
            ) {

                return;

            }


            // --------------------------------------
            // ATUALIZAR MATRIZES DO MODELO
            // --------------------------------------

            modelo.object3D.updateMatrixWorld(
                true
            );


            // --------------------------------------
            // INTERSECTAR GLB
            //
            // TRUE = procura também nos filhos
            // do modelo GLTF.
            // --------------------------------------

            const intersecoes =
                raycaster.intersectObject(
                    modelo.object3D,
                    true
                );


            if (
                !intersecoes ||
                intersecoes.length === 0
            ) {

                return;

            }


            const primeira =
                intersecoes[0];


            if (
                primeira.distance <
                distanciaMaisProxima
            ) {

                distanciaMaisProxima =
                    primeira.distance;

                produtoEncontrado =
                    chaveProduto;

            }

        }
    );


    // ------------------------------------------
    // PRODUTO ENCONTRADO
    // ------------------------------------------

    if (produtoEncontrado) {

        console.log(
            "================================="
        );

        console.log(
            "🎯 GLB CLICADO!"
        );

        console.log(
            "Produto:",
            produtoEncontrado
        );

        console.log(
            "Nome:",
            produtos[
                produtoEncontrado
            ].nome
        );

        console.log(
            "Preço:",
            formatarPreco(
                produtos[
                    produtoEncontrado
                ].preco
            )
        );

        console.log(
            "================================="
        );


        abrirCardProduto(
            produtoEncontrado
        );


        return;

    }


    // ------------------------------------------
    // NENHUM GLB ATINGIDO
    // ------------------------------------------

    console.log(
        "❌ O toque não atingiu o modelo 3D."
    );

}


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


                // ----------------------------------
                // PARAR MINDAR
                // ----------------------------------

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


                // ----------------------------------
                // LIMPAR ESTADO
                // ----------------------------------

                produtoDetectado =
                    null;

                produtoAtual =
                    null;

                esconderTodosModelos();

                esconderMensagemProduto();


                // ----------------------------------
                // REINICIAR MINDAR
                // ----------------------------------

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
            "❌ Navegador não suporta câmera."
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
            "❌ Erro ao acessar câmera:",
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


    const textoErro =
        document.getElementById(
            "texto-erro"
        );


    if (textoErro) {

        textoErro.textContent =
            mensagem;

    }


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
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================="
        );

        console.log(
            "📷 ESTOQUE ZERO - CÂMERA AR"
        );

        console.log(
            "================================="
        );


        console.log(
            "💰 Orçamento:",
            formatarPreco(
                orcamentoAtual
            )
        );


        esconderErroCamera();


        setTimeout(
            function () {

                esconderMensagemCamera();

            },
            3000
        );

    }
);


// ======================================================
// VERIFICAR MODELOS
// ======================================================

console.log(
    "🔍 Verificando modelos 3D..."
);


Object.keys(modelos).forEach(
    function (chaveProduto) {

        if (
            modelos[chaveProduto]
        ) {

            console.log(
                "✅ Modelo encontrado:",
                chaveProduto
            );

        }
        else {

            console.error(
                "❌ Modelo NÃO encontrado:",
                chaveProduto
            );

        }

    }
);


// ======================================================
// FINAL
// ======================================================

console.log(
    "🚀 camera.js carregado com sucesso."
);


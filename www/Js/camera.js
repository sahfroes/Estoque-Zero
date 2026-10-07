// ============================================================
// ESTOQUE ZERO - CAMERA AR
// MindAR + A-Frame + modelos 3D clicáveis
// ============================================================

console.log("🚀 camera.js carregado");


// ============================================================
// ELEMENTOS PRINCIPAIS
// ============================================================

const cenaRA = document.querySelector("#cena-ra");

const saldoElemento = document.querySelector("#saldo");
const mensagemElemento = document.querySelector("#mensagem");
const mensagemProduto = document.querySelector("#mensagem-produto");

const botaoCarrinho = document.querySelector("#botao-carrinho");
const botaoTrocarCamera = document.querySelector("#trocar-camera");


// ============================================================
// PRODUTOS
// ============================================================

const produtos = {

    leite: {
        nome: "Leite UHT Integral 1L",
        preco: 7.50,
        imagem: "../../img/produtos/leite.png"
    },

    feijao: {
        nome: "Feijão Carioca 1kg",
        preco: 8.00,
        imagem: "../../img/produtos/feijao.png"
    },

    arroz: {
        nome: "Arroz Branco 5kg",
        preco: 25.00,
        imagem: "../../img/produtos/arroz.png"
    },

    macarrao: {
        nome: "Macarrão 500g",
        preco: 5.00,
        imagem: "../../img/produtos/macarrao.png"
    },

    oleo: {
        nome: "Óleo de Soja 900ml",
        preco: 8.00,
        imagem: "../../img/produtos/oleo.png"
    },

    acucar: {
        nome: "Açúcar Refinado 1kg",
        preco: 5.00,
        imagem: "../../img/produtos/acucar.png"
    },

    bombons: {
        nome: "Bombons",
        preco: 12.00,
        imagem: "../../img/produtos/bombons.png"
    },

    giftcard: {
        nome: "Gift Card",
        preco: 20.00,
        imagem: "../../img/produtos/giftcard.png"
    },

    copo: {
        nome: "Copo Térmico",
        preco: 15.00,
        imagem: "../../img/produtos/copo.png"
    },

    boneco: {
        nome: "Boneco Colecionável",
        preco: 18.00,
        imagem: "../../img/produtos/boneco.png"
    }
};


// ============================================================
// RELAÇÃO TARGET → PRODUTO
// ============================================================

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


// ============================================================
// MODELOS 3D
// ============================================================

const modelos = {

    leite: document.querySelector("#produto-leite"),

    feijao: document.querySelector("#produto-feijao"),

    arroz: document.querySelector("#produto-arroz"),

    macarrao: document.querySelector("#produto-macarrao"),

    oleo: document.querySelector("#produto-oleo"),

    acucar: document.querySelector("#produto-acucar"),

    bombons: document.querySelector("#produto-bombons"),

    giftcard: document.querySelector("#produto-giftcard"),

    copo: document.querySelector("#produto-copo"),

    boneco: document.querySelector("#produto-boneco")
};


// ============================================================
// VARIÁVEIS
// ============================================================

let produtoDetectado = null;

let produtoAtual = null;

let cameraAtual = "environment";

let abrindoCard = false;

let ultimoToque = 0;

let canvasInteracao = null;

let timerConfigurado = false;


// ============================================================
// RAYCASTER THREE.JS
// ============================================================

let raycaster = null;

let pontoMouse = null;


// ============================================================
// INICIALIZAÇÃO DO RAYCASTER
// ============================================================

function inicializarRaycaster() {

    if (typeof THREE === "undefined") {

        console.warn("⚠️ THREE ainda não está disponível.");

        return false;
    }

    if (!raycaster) {

        raycaster = new THREE.Raycaster();

        pontoMouse = new THREE.Vector2();

        console.log("✅ Raycaster THREE inicializado.");
    }

    return true;
}


// ============================================================
// ORÇAMENTO
// ============================================================

function carregarOrcamento() {

    const valorSalvo = localStorage.getItem("orcamentoSelecionado");

    if (!valorSalvo) {

        console.warn("⚠️ Nenhum orçamento encontrado.");

        if (saldoElemento) {

            saldoElemento.textContent = "R$ 0,00";

        }

        return 0;
    }

    const orcamento = Number(valorSalvo);

    console.log("💰 Orçamento carregado:", orcamento);

    if (saldoElemento) {

        saldoElemento.textContent = orcamento.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    return orcamento;
}


// ============================================================
// SALVAR PRODUTO
// ============================================================

function salvarProduto(chaveProduto) {

    const produto = produtos[chaveProduto];

    if (!produto) {

        console.error(
            "❌ Produto não encontrado:",
            chaveProduto
        );

        return;
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
        produto.preco
    );

    localStorage.setItem(
        "produtoAtual",
        JSON.stringify({
            id: chaveProduto,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        })
    );

    console.log(
        "💾 Produto salvo:",
        produto.nome,
        produto.preco
    );
}


// ============================================================
// ABRIR CARD DO PRODUTO
// ============================================================

function abrirCardProduto(chaveProduto) {

    if (!chaveProduto) {

        console.error(
            "❌ Tentativa de abrir produto sem chave."
        );

        return;
    }

    if (abrindoCard) {

        return;
    }

    if (!produtos[chaveProduto]) {

        console.error(
            "❌ Produto inválido:",
            chaveProduto
        );

        return;
    }

    abrindoCard = true;

    console.log(
        "🛒 Abrindo card do produto:",
        chaveProduto
    );

    salvarProduto(chaveProduto);

    /*
     * Mantemos a navegação para a mesma pasta.
     * O card-produto.js vai ler ?produto=
     */
    window.location.href =
        "card-produto.html?produto=" +
        encodeURIComponent(chaveProduto);
}


// ============================================================
// ESCONDER TODOS OS MODELOS
// ============================================================

function esconderTodosModelos() {

    Object.values(modelos).forEach((modelo) => {

        if (!modelo) {
            return;
        }

        modelo.setAttribute(
            "visible",
            "false"
        );
    });
}


// ============================================================
// MOSTRAR MODELO
// ============================================================

function mostrarModelo(chaveProduto) {

    if (!chaveProduto) {

        console.warn(
            "⚠️ Nenhum produto para mostrar."
        );

        return;
    }

    const modelo = modelos[chaveProduto];

    if (!modelo) {

        console.error(
            "❌ Modelo não encontrado:",
            chaveProduto
        );

        return;
    }

    esconderTodosModelos();

    modelo.setAttribute(
        "visible",
        "true"
    );

    produtoAtual = chaveProduto;

    produtoDetectado = chaveProduto;

    console.log(
        "🟢 PRODUTO 3D ATIVO:",
        chaveProduto
    );

    console.log(
        "🟢 PRODUTO ATIVO PARA CLIQUE:",
        chaveProduto
    );

    if (mensagemElemento) {

        mensagemElemento.style.display = "none";
    }

    if (mensagemProduto) {

        mensagemProduto.style.display = "block";

        mensagemProduto.textContent =
            "Toque no produto para ver detalhes";
    }

    /*
     * Garante que o produto esteja pronto para
     * receber o clique do A-Frame.
     */
    configurarCliquesModelos();
}


// ============================================================
// PEGAR CANVAS
// ============================================================

function obterCanvas() {

    if (!cenaRA) {

        return null;
    }

    if (cenaRA.canvas) {

        return cenaRA.canvas;
    }

    if (
        cenaRA.renderer &&
        cenaRA.renderer.domElement
    ) {

        return cenaRA.renderer.domElement;
    }

    return null;
}


// ============================================================
// PEGAR MODELO ATUAL
// ============================================================

function obterModeloAtual() {

    if (
        produtoDetectado &&
        modelos[produtoDetectado]
    ) {

        return modelos[produtoDetectado];
    }

    if (
        produtoAtual &&
        modelos[produtoAtual]
    ) {

        return modelos[produtoAtual];
    }

    for (const chave in modelos) {

        const modelo = modelos[chave];

        if (!modelo) {
            continue;
        }

        if (
            modelo.object3D &&
            modelo.object3D.visible
        ) {

            return modelo;
        }
    }

    return null;
}


// ============================================================
// DESCOBRIR PRODUTO PELO MODELO
// ============================================================

function descobrirProdutoDoModelo(modelo) {

    if (!modelo) {

        return null;
    }

    const produtoData =
        modelo.getAttribute("data-produto");

    if (
        produtoData &&
        produtos[produtoData]
    ) {

        return produtoData;
    }

    for (const chave in modelos) {

        if (modelos[chave] === modelo) {

            return chave;
        }
    }

    return produtoDetectado || produtoAtual;
}


// ============================================================
// TESTAR ÁREA DO MODELO NA TELA
// ============================================================

function toqueDentroDaAreaDoModelo(
    modelo,
    clientX,
    clientY
) {

    if (
        !modelo ||
        !modelo.object3D ||
        !cenaRA ||
        !cenaRA.camera
    ) {

        return false;
    }

    try {

        const canvas = obterCanvas();

        if (!canvas) {

            return false;
        }

        const rect =
            canvas.getBoundingClientRect();

        if (
            clientX < rect.left ||
            clientX > rect.right ||
            clientY < rect.top ||
            clientY > rect.bottom
        ) {

            return false;
        }

        /*
         * Calculamos o tamanho real do modelo
         * em coordenadas 3D.
         */
        const caixa =
            new THREE.Box3().setFromObject(
                modelo.object3D
            );

        if (caixa.isEmpty()) {

            return false;
        }

        /*
         * Pegamos os 8 cantos da caixa.
         */
        const pontos = [

            new THREE.Vector3(
                caixa.min.x,
                caixa.min.y,
                caixa.min.z
            ),

            new THREE.Vector3(
                caixa.min.x,
                caixa.min.y,
                caixa.max.z
            ),

            new THREE.Vector3(
                caixa.min.x,
                caixa.max.y,
                caixa.min.z
            ),

            new THREE.Vector3(
                caixa.min.x,
                caixa.max.y,
                caixa.max.z
            ),

            new THREE.Vector3(
                caixa.max.x,
                caixa.min.y,
                caixa.min.z
            ),

            new THREE.Vector3(
                caixa.max.x,
                caixa.min.y,
                caixa.max.z
            ),

            new THREE.Vector3(
                caixa.max.x,
                caixa.max.y,
                caixa.min.z
            ),

            new THREE.Vector3(
                caixa.max.x,
                caixa.max.y,
                caixa.max.z
            )
        ];

        let minX = Infinity;
        let maxX = -Infinity;

        let minY = Infinity;
        let maxY = -Infinity;

        pontos.forEach((ponto) => {

            ponto.project(cenaRA.camera);

            const x =
                rect.left +
                (ponto.x + 1) *
                0.5 *
                rect.width;

            const y =
                rect.top +
                (1 - ponto.y) *
                0.5 *
                rect.height;

            minX = Math.min(minX, x);

            maxX = Math.max(maxX, x);

            minY = Math.min(minY, y);

            maxY = Math.max(maxY, y);
        });

        /*
         * Aumentamos um pouco a área clicável.
         * Isso é especialmente importante no celular.
         */
        const margemX =
            Math.max(
                25,
                (maxX - minX) * 0.20
            );

        const margemY =
            Math.max(
                25,
                (maxY - minY) * 0.20
            );

        minX -= margemX;
        maxX += margemX;

        minY -= margemY;
        maxY += margemY;

        const dentro =
            clientX >= minX &&
            clientX <= maxX &&
            clientY >= minY &&
            clientY <= maxY;

        console.log(
            "📐 Área do modelo:",
            {
                minX,
                maxX,
                minY,
                maxY,
                clientX,
                clientY,
                dentro
            }
        );

        return dentro;

    } catch (erro) {

        console.error(
            "❌ Erro ao calcular área do modelo:",
            erro
        );

        return false;
    }
}


// ============================================================
// DETECTAR CLIQUE COM THREE.RAYCASTER
// ============================================================

function detectarCliqueNoProduto(
    clientX,
    clientY,
    evento = null
) {

    console.log(
        "👆 TOQUE RECEBIDO:",
        clientX,
        clientY,
        "produto:",
        produtoDetectado
    );

    if (abrindoCard) {

        return;
    }

    if (!cenaRA) {

        return;
    }

    if (!inicializarRaycaster()) {

        return;
    }

    const canvas = obterCanvas();

    if (!canvas) {

        console.warn(
            "⚠️ Canvas ainda não encontrado."
        );

        return;
    }

    const modelo = obterModeloAtual();

    if (!modelo) {

        console.warn(
            "⚠️ Nenhum modelo 3D ativo."
        );

        return;
    }

    /*
     * Ignora os botões HTML da interface.
     */
    if (
        evento &&
        evento.target &&
        typeof evento.target.closest === "function"
    ) {

        const elementoUI =
            evento.target.closest(
                "#botao-carrinho, #trocar-camera, button, a"
            );

        if (elementoUI) {

            console.log(
                "ℹ️ Toque em elemento da interface."
            );

            return;
        }
    }

    const rect =
        canvas.getBoundingClientRect();

    if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
    ) {

        return;
    }

    /*
     * Primeiro tentamos o raycast real.
     */
    const mouseX =
        (
            (clientX - rect.left) /
            rect.width
        ) * 2 - 1;

    const mouseY =
        -(
            (
                (clientY - rect.top) /
                rect.height
            ) * 2 - 1
        );

    pontoMouse.set(
        mouseX,
        mouseY
    );

    try {

        raycaster.setFromCamera(
            pontoMouse,
            cenaRA.camera
        );

        const intersecoes =
            raycaster.intersectObject(
                modelo.object3D,
                true
            );

        console.log(
            "🎯 Interseções:",
            intersecoes.length
        );

        if (intersecoes.length > 0) {

            const produto =
                descobrirProdutoDoModelo(
                    modelo
                );

            console.log(
                "✅ RAYCAST DETECTOU:",
                produto
            );

            abrirCardProduto(produto);

            return;
        }

    } catch (erro) {

        console.error(
            "❌ Erro no raycast:",
            erro
        );
    }

    /*
     * Se o raycast não conseguir acertar o GLB,
     * usamos a área projetada como fallback.
     */
    const dentroDaArea =
        toqueDentroDaAreaDoModelo(
            modelo,
            clientX,
            clientY
        );

    if (dentroDaArea) {

        const produto =
            descobrirProdutoDoModelo(
                modelo
            );

        console.log(
            "✅ FALLBACK DETECTOU:",
            produto
        );

        abrirCardProduto(produto);

        return;
    }

    console.log(
        "❌ Toque não atingiu o produto."
    );
}


// ============================================================
// CONFIGURAR CLIQUE NATIVO DO A-FRAME
// ============================================================

function configurarCliquesModelos() {

    Object.entries(modelos).forEach(
        ([chave, modelo]) => {

            if (!modelo) {

                console.warn(
                    "⚠️ Modelo não encontrado:",
                    chave
                );

                return;
            }

            /*
             * Evita adicionar o listener várias vezes.
             */
            if (
                modelo.dataset &&
                modelo.dataset.cliqueConfigurado === "true"
            ) {

                return;
            }

            if (modelo.dataset) {

                modelo.dataset.cliqueConfigurado =
                    "true";
            }

            /*
             * Garante que o modelo seja reconhecido
             * pelo raycaster do A-Frame.
             */
            modelo.classList.add(
                "produto-3d"
            );

            modelo.addEventListener(
                "click",
                function (evento) {

                    if (abrindoCard) {

                        return;
                    }

                    const produto =
                        descobrirProdutoDoModelo(
                            modelo
                        );

                    console.log(
                        "🖱️ CLICK A-FRAME:",
                        produto
                    );

                    abrirCardProduto(
                        produto
                    );
                }
            );

            /*
             * Apenas para diagnóstico.
             */
            modelo.addEventListener(
                "raycaster-intersected",
                function () {

                    console.log(
                        "🎯 Raycaster encontrou:",
                        chave
                    );
                }
            );

            console.log(
                "✅ Clique configurado:",
                chave
            );
        }
    );
}


// ============================================================
// CONFIGURAR INTERAÇÃO MANUAL
// ============================================================

function configurarInteracao3D() {

    const canvas = obterCanvas();

    if (
        !canvas ||
        !cenaRA ||
        !cenaRA.camera
    ) {

        console.log(
            "⏳ Aguardando canvas/câmera..."
        );

        setTimeout(
            configurarInteracao3D,
            500
        );

        return;
    }

    inicializarRaycaster();

    configurarCliquesModelos();

    /*
     * Evita cadastrar listeners duplicados.
     */
    if (canvasInteracao === canvas) {

        return;
    }

    canvasInteracao = canvas;

    console.log(
        "✅ Interação manual configurada."
    );


    // ========================================================
    // POINTERUP
    // ========================================================

    canvas.addEventListener(
        "pointerup",
        function (evento) {

            /*
             * Ignoramos botões físicos/mouse secundário.
             */
            if (
                evento.pointerType === "mouse" &&
                evento.button !== 0
            ) {

                return;
            }

            const agora =
                Date.now();

            /*
             * Evita eventos duplicados.
             */
            if (
                agora - ultimoToque < 350
            ) {

                return;
            }

            ultimoToque = agora;

            detectarCliqueNoProduto(
                evento.clientX,
                evento.clientY,
                evento
            );
        },
        {
            passive: false
        }
    );


    // ========================================================
    // FALLBACK TOUCH
    // ========================================================

    /*
     * Alguns celulares/navegadores podem não disparar
     * corretamente o pointerup.
     *
     * Só cadastramos esse fallback se PointerEvent
     * não estiver disponível.
     */

    if (!window.PointerEvent) {

        canvas.addEventListener(
            "touchend",
            function (evento) {

                if (
                    !evento.changedTouches ||
                    !evento.changedTouches.length
                ) {

                    return;
                }

                const agora =
                    Date.now();

                if (
                    agora - ultimoToque < 350
                ) {

                    return;
                }

                ultimoToque = agora;

                const toque =
                    evento.changedTouches[0];

                detectarCliqueNoProduto(
                    toque.clientX,
                    toque.clientY,
                    evento
                );

            },
            {
                passive: false
            }
        );
    }
}


// ============================================================
// EVENTOS DO MINDAR
// ============================================================

if (cenaRA) {


    // ========================================================
    // MINDAR CARREGADO
    // ========================================================

    cenaRA.addEventListener(
        "loaded",
        function () {

            console.log(
                "✅ A-Frame carregado."
            );

            configurarCliquesModelos();

            configurarInteracao3D();
        }
    );


    // ========================================================
    // RENDER START
    // ========================================================

    cenaRA.addEventListener(
        "renderstart",
        function () {

            console.log(
                "🎥 Renderização iniciada."
            );

            configurarCliquesModelos();

            configurarInteracao3D();
        }
    );


    // ========================================================
    // TARGET ENCONTRADO
    // ========================================================

    cenaRA.addEventListener(
        "targetFound",
        function (evento) {

            const targetIndex =
                evento.targetIndex;

            console.log(
                "🎯 TARGET ENCONTRADO:",
                targetIndex
            );

            const chaveProduto =
                produtosPorTarget[targetIndex];

            if (!chaveProduto) {

                console.error(
                    "❌ Target sem produto:",
                    targetIndex
                );

                return;
            }

            console.log(
                "📦 Produto identificado:",
                chaveProduto
            );

            mostrarModelo(
                chaveProduto
            );

            /*
             * Reconfigura o clique depois que
             * o target aparece.
             */
            setTimeout(
                configurarCliquesModelos,
                100
            );
        }
    );


    // ========================================================
    // TARGET PERDIDO
    // ========================================================

    cenaRA.addEventListener(
        "targetLost",
        function (evento) {

            const targetIndex =
                evento.targetIndex;

            console.log(
                "⚠️ TARGET PERDIDO:",
                targetIndex
            );

            const chaveProduto =
                produtosPorTarget[targetIndex];

            /*
             * Esperamos um pouco antes de esconder.
             * Isso evita que pequenas perdas do tracking
             * façam o produto desaparecer imediatamente.
             */
            setTimeout(
                function () {

                    if (
                        produtoDetectado ===
                        chaveProduto
                    ) {

                        const modelo =
                            modelos[chaveProduto];

                        if (modelo) {

                            modelo.setAttribute(
                                "visible",
                                "false"
                            );
                        }

                        if (mensagemProduto) {

                            mensagemProduto.style.display =
                                "none";
                        }

                        produtoDetectado = null;

                        produtoAtual = null;

                    }

                },
                700
            );
        }
    );

} else {

    console.error(
        "❌ #cena-ra não encontrada."
    );
}


// ============================================================
// BOTÃO CARRINHO
// ============================================================

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


// ============================================================
// TROCAR CÂMERA
// ============================================================

if (botaoTrocarCamera) {

    botaoTrocarCamera.addEventListener(
        "click",
        async function () {

            if (abrindoCard) {

                return;
            }

            console.log(
                "🔄 Trocando câmera..."
            );

            try {

                /*
                 * MindAR fornece o controller através
                 * do sistema mindar-image-system.
                 */
                const sistema =
                    cenaRA.systems[
                        "mindar-image-system"
                    ];

                if (!sistema) {

                    console.warn(
                        "⚠️ Sistema MindAR não encontrado."
                    );

                    return;
                }

                /*
                 * Paramos temporariamente o AR.
                 */
                if (
                    sistema.controller &&
                    sistema.controller.stop
                ) {

                    await sistema.controller.stop();
                }

                /*
                 * Alternamos câmera.
                 */
                if (
                    cameraAtual === "environment"
                ) {

                    cameraAtual = "user";

                } else {

                    cameraAtual = "environment";
                }

                console.log(
                    "📷 Nova câmera:",
                    cameraAtual
                );

                /*
                 * Alguns navegadores não permitem
                 * trocar o facingMode do MindAR
                 * depois que a câmera já iniciou.
                 *
                 * Então recarregamos a página.
                 */
                sessionStorage.setItem(
                    "cameraPreferida",
                    cameraAtual
                );

                window.location.reload();

            } catch (erro) {

                console.error(
                    "❌ Erro ao trocar câmera:",
                    erro
                );
            }
        }
    );
}


// ============================================================
// RECUPERAR CÂMERA ESCOLHIDA
// ============================================================

const cameraSalva =
    sessionStorage.getItem(
        "cameraPreferida"
    );

if (cameraSalva) {

    cameraAtual = cameraSalva;
}


// ============================================================
// MOSTRAR ORÇAMENTO
// ============================================================

carregarOrcamento();


// ============================================================
// TENTATIVAS EXTRAS DE CONFIGURAÇÃO
// ============================================================

setTimeout(
    function () {

        configurarCliquesModelos();

        configurarInteracao3D();

    },
    1000
);

setTimeout(
    function () {

        configurarCliquesModelos();

        configurarInteracao3D();

    },
    2000
);

setTimeout(
    function () {

        configurarCliquesModelos();

        configurarInteracao3D();

    },
    3000
);

// ============================================================
// LOG FINAL
// ============================================================

console.log(
    "✅ camera.js pronto."
);
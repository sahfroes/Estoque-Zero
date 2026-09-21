/* =====================================
   ESTOQUE ZERO
   CÂMERA E LEITOR DE QR CODE
===================================== */

/* =====================================
   PEGAR ELEMENTOS DO HTML
===================================== */
const camera = document.getElementById("camera");
const canvas = document.getElementById("canvasQR");
const contexto = canvas.getContext("2d", { willReadFrequently: true });

const botaoCamera = document.getElementById("botaoCamera");
const aviso = document.getElementById("aviso");

// Elementos do Modal do Produto
const modalProduto = document.getElementById("produtoEncontrado");
const produtoImagem = document.getElementById("produtoImagem");
const produtoNome = document.getElementById("produtoNome");
const produtoPreco = document.getElementById("produtoPreco");
const produtoCategoria = document.getElementById("produtoCategoria");
const fecharProduto = document.getElementById("fecharProduto");
const cancelarBtn = document.getElementById("cancelarBtn");

/* =====================================
   PRODUTOS
===================================== */
const produtos = {
    "LEITE": {
        nome: "Leite integral",
        preco: 7.50,
        imagem: "🥛",
        categoria: "Alimentação"
    },
    "MACA": {
        nome: "Maçã",
        preco: 5.00,
        imagem: "🍎",
        categoria: "Alimentação"
    },
    "PAO": {
        nome: "Pão",
        preco: 6.00,
        imagem: "🥖",
        categoria: "Alimentação"
    },
    "ARROZ": {
        nome: "Arroz",
        preco: 8.50,
        imagem: "🍚",
        categoria: "Alimentação"
    },
    "CHOCOLATE": {
        nome: "Chocolate",
        preco: 6.50,
        imagem: "🍫",
        categoria: "Supérfluo"
    }
};

/* =====================================
   ABRIR A CÂMERA
===================================== */
async function iniciarCamera() {
    console.log("Tentando abrir a câmera...");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        mostrarAviso("❌ Seu navegador não permite acesso à câmera.");
        return;
    }

    try {
        console.log("Solicitando permissão...");

        // Configuração compatível com a maioria dos telemóveis
        const transmissao = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        console.log("Câmera autorizada!");

        camera.srcObject = transmissao;
        camera.setAttribute("playsinline", true); // Essencial para iOS/Safari

        camera.onloadedmetadata = async function () {
            try {
                await camera.play();
                console.log("Câmera funcionando!");

                canvas.width = camera.videoWidth;
                canvas.height = camera.videoHeight;

                botaoCamera.style.display = "none";

                procurarQRCode();
            } catch (erro) {
                console.error("Erro ao reproduzir câmera:", erro);
            }
        };

    } catch (erro) {
        console.error("Erro ao acessar câmera:", erro);

        if (erro.name === "NotAllowedError" || erro.name === "PermissionDeniedError") {
            mostrarAviso("📷 Você precisa permitir o acesso à câmera.");
            return;
        }

        if (erro.name === "NotFoundError" || erro.name === "DevicesNotFoundError") {
            mostrarAviso("📷 Nenhuma câmera foi encontrada.");
            return;
        }

        if (erro.name === "NotReadableError" || erro.name === "TrackStartError") {
            mostrarAviso("📷 A câmera está sendo usada por outro aplicativo.");
            return;
        }

        mostrarAviso("❌ Não foi possível abrir a câmera.");
    }
}

/* =====================================
   PROCURAR QR CODE
===================================== */
let lendoQRCode = true;
let ultimoCodigo = "";
let ultimoDetectado = 0;

function procurarQRCode() {
    if (!lendoQRCode) {
        requestAnimationFrame(procurarQRCode);
        return;
    }

    if (camera.readyState >= camera.HAVE_ENOUGH_DATA) {
        canvas.width = camera.videoWidth;
        canvas.height = camera.videoHeight;

        contexto.drawImage(camera, 0, 0, canvas.width, canvas.height);

        const imagem = contexto.getImageData(0, 0, canvas.width, canvas.height);

        const codigo = jsQR(
            imagem.data,
            imagem.width,
            imagem.height,
            { inversionAttempts: "attemptBoth" }
        );

        if (codigo) {
            const texto = codigo.data.trim().toUpperCase();
            const agora = Date.now();

            if (texto !== ultimoCodigo || agora - ultimoDetectado > 3000) {
                ultimoCodigo = texto;
                ultimoDetectado = agora;

                console.log("QR Code encontrado:", texto);
                produtoDetectado(texto);
            }
        }
    }

    requestAnimationFrame(procurarQRCode);
}

/* =====================================
   PRODUTO ENCONTRADO
===================================== */
function produtoDetectado(codigo) {
    const produto = produtos[codigo];

    if (!produto) {
        mostrarAviso("❌ Produto não cadastrado: " + codigo);
        return;
    }

    // Preenche as informações no Modal do HTML
    produtoImagem.textContent = produto.imagem;
    produtoNome.textContent = produto.nome;
    produtoPreco.textContent = "R$ " + produto.preco.toFixed(2).replace(".", ",");
    produtoCategoria.textContent = produto.categoria;

    // Exibe o modal
    modalProduto.classList.remove("escondido");

    // Pausa a leitura enquanto a janela está aberta
    lendoQRCode = false;
}

/* =====================================
   FECHAR MODAL DO PRODUTO
===================================== */
function fecharModal() {
    modalProduto.classList.add("escondido");
    // Retoma a leitura do QR Code
    lendoQRCode = true;
}

if (fecharProduto) fecharProduto.addEventListener("click", fecharModal);
if (cancelarBtn) cancelarBtn.addEventListener("click", fecharModal);

/* =====================================
   MOSTRAR AVISO
===================================== */
let avisoTimer;

function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.classList.remove("escondido");

    clearTimeout(avisoTimer);

    avisoTimer = setTimeout(function () {
        aviso.classList.add("escondido");
    }, 3000);
}

/* =====================================
   EVENTOS
===================================== */
botaoCamera.addEventListener("click", iniciarCamera);
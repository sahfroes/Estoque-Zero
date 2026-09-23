// ==========================================
// CONFIGURAÇÕES
// ==========================================

const camera = document.getElementById("camera");

const mensagemCamera =
    document.getElementById("mensagem-camera");

const erroCamera =
    document.getElementById("erro-camera");

const textoErro =
    document.getElementById("texto-erro");

const tentarNovamente =
    document.getElementById("tentar-novamente");

const trocarCamera =
    document.getElementById("trocar-camera");

const botaoCarrinho =
    document.getElementById("botao-carrinho");

const quantidadeCarrinho =
    document.getElementById("quantidade-carrinho");


// ==========================================
// VARIÁVEIS
// ==========================================

let fluxoCamera = null;

let usandoCameraTraseira = true;

let quantidadeProdutos = 0;


// ==========================================
// INICIAR CÂMERA
// ==========================================

async function iniciarCamera() {

    console.log("Tentando iniciar a câmera...");

    // Mostra mensagem
    mensagemCamera.style.display = "block";

    // Esconde erro
    erroCamera.style.display = "none";


    // Verifica se o navegador possui câmera
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        mostrarErro(
            "Seu navegador não permite acesso à câmera."
        );

        return;
    }


    // Para a câmera anterior
    pararCamera();


    try {

        // ==========================================
        // CONFIGURAÇÃO DA CÂMERA
        // ==========================================

        const configuracao = {

            video: {

                // TRUE = câmera traseira
                facingMode: {
                    ideal: "environment"
                },

                width: {
                    ideal: 1280
                },

                height: {
                    ideal: 720
                }

            },

            audio: false
        };


        // Solicita permissão
        fluxoCamera =
            await navigator.mediaDevices.getUserMedia(
                configuracao
            );


        console.log("Câmera autorizada!");

        console.log(
            fluxoCamera.getVideoTracks()
        );


        // Coloca a câmera no vídeo
        camera.srcObject = fluxoCamera;


        // Garante que o vídeo fique funcionando
        await camera.play();


        // Esconde mensagem
        mensagemCamera.style.display = "none";


        console.log(
            "Câmera traseira iniciada!"
        );

    }

    catch (erro) {

        console.error(
            "Erro ao acessar câmera:",
            erro
        );


        mostrarErro(
            descobrirErro(erro)
        );

    }

}


// ==========================================
// PARAR CÂMERA
// ==========================================

function pararCamera() {

    if (fluxoCamera) {

        fluxoCamera
            .getTracks()
            .forEach(function (faixa) {

                faixa.stop();

            });

        fluxoCamera = null;
    }


    camera.srcObject = null;
}


// ==========================================
// TROCAR CÂMERA
// ==========================================

async function trocarCameraCelular() {

    usandoCameraTraseira =
        !usandoCameraTraseira;


    pararCamera();


    try {

        const configuracao = {

            video: {

                facingMode: usandoCameraTraseira
                    ? "environment"
                    : "user",

                width: {
                    ideal: 1280
                },

                height: {
                    ideal: 720
                }

            },

            audio: false

        };


        fluxoCamera =
            await navigator.mediaDevices.getUserMedia(
                configuracao
            );


        camera.srcObject =
            fluxoCamera;


        await camera.play();


        console.log(
            usandoCameraTraseira
                ? "Câmera traseira"
                : "Câmera frontal"
        );

    }

    catch (erro) {

        console.error(erro);

        mostrarErro(
            "Não foi possível trocar a câmera."
        );

    }

}


// ==========================================
// MOSTRAR ERRO
// ==========================================

function mostrarErro(mensagem) {

    mensagemCamera.style.display = "none";

    erroCamera.style.display = "block";

    textoErro.textContent = mensagem;

}


// ==========================================
// IDENTIFICAR ERRO
// ==========================================

function descobrirErro(erro) {

    if (erro.name === "NotAllowedError") {

        return (
            "O acesso à câmera foi bloqueado. " +
            "Permita o uso da câmera nas configurações " +
            "do navegador."
        );

    }


    if (erro.name === "NotFoundError") {

        return (
            "Nenhuma câmera foi encontrada neste dispositivo."
        );

    }


    if (erro.name === "NotReadableError") {

        return (
            "A câmera está sendo usada por outro aplicativo."
        );

    }


    if (erro.name === "SecurityError") {

        return (
            "O navegador bloqueou o acesso à câmera. " +
            "Verifique se o site está usando HTTPS."
        );

    }


    return (
        "Não foi possível acessar a câmera. " +
        "Verifique as permissões do navegador."
    );

}


// ==========================================
// BOTÃO TENTAR NOVAMENTE
// ==========================================

tentarNovamente.addEventListener(
    "click",
    function () {

        iniciarCamera();

    }
);


// ==========================================
// BOTÃO TROCAR CÂMERA
// ==========================================

trocarCamera.addEventListener(
    "click",
    function () {

        trocarCameraCelular();

    }
);


// ==========================================
// BOTÃO CARRINHO
// ==========================================

botaoCarrinho.addEventListener(
    "click",
    function () {

        console.log(
            "Abrindo carrinho..."
        );


        // Aqui você poderá mandar para
        // carrinho.html

        window.location.href = "carrinho.html";

    }
);


// ==========================================
// INICIAR AO ABRIR A PÁGINA
// ==========================================

window.addEventListener(
    "load",
    function () {

        iniciarCamera();

    }
);


// ==========================================
// LIMPAR CÂMERA AO SAIR
// ==========================================

window.addEventListener(
    "beforeunload",
    function () {

        pararCamera();

    }
);
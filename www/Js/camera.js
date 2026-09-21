```javascript
/* =====================================
   ESTOQUE ZERO
   CÂMERA E LEITOR DE QR CODE
===================================== */


/* =====================================
   PEGAR ELEMENTOS DO HTML
===================================== */

const camera =
    document.getElementById("camera");

const canvas =
    document.getElementById("canvasQR");

const contexto =
    canvas.getContext("2d", {
        willReadFrequently: true
    });


const botaoCamera =
    document.getElementById("botaoCamera");


const aviso =
    document.getElementById("aviso");


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

    console.log(
        "Tentando abrir a câmera..."
    );


    /*
        Verifica se o navegador
        possui acesso à câmera
    */

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        mostrarAviso(
            "❌ Seu navegador não permite acesso à câmera."
        );

        return;

    }


    try {

        console.log(
            "Solicitando permissão..."
        );


        /*
            Solicita a câmera traseira
            do celular
        */

        const transmissao =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: {
                        ideal: "environment"
                    }

                },

                audio: false

            });


        console.log(
            "Câmera autorizada!"
        );


        /*
            Coloca a câmera
            dentro do vídeo
        */

        camera.srcObject =
            transmissao;


        /*
            Quando o vídeo estiver pronto
        */

        camera.onloadedmetadata =
            async function () {


                try {

                    await camera.play();


                    console.log(
                        "Câmera funcionando!"
                    );


                    /*
                        Define o tamanho
                        do canvas
                    */

                    canvas.width =
                        camera.videoWidth;

                    canvas.height =
                        camera.videoHeight;


                    /*
                        Esconde o botão
                    */

                    botaoCamera.style.display =
                        "none";


                    /*
                        Começa a procurar
                        QR Codes
                    */

                    procurarQRCode();


                } catch (erro) {

                    console.error(
                        "Erro ao reproduzir câmera:",
                        erro
                    );

                }

            };


    } catch (erro) {


        console.error(
            "Erro ao acessar câmera:",
            erro
        );


        /*
            Usuário não permitiu
        */

        if (
            erro.name ===
            "NotAllowedError"
        ) {

            mostrarAviso(
                "📷 Você precisa permitir o acesso à câmera."
            );

            return;

        }


        /*
            Não encontrou câmera
        */

        if (
            erro.name ===
            "NotFoundError"
        ) {

            mostrarAviso(
                "📷 Nenhuma câmera foi encontrada."
            );

            return;

        }


        /*
            Câmera já está sendo usada
        */

        if (
            erro.name ===
            "NotReadableError"
        ) {

            mostrarAviso(
                "📷 A câmera está sendo usada por outro aplicativo."
            );

            return;

        }


        /*
            Outros erros
        */

        mostrarAviso(
            "❌ Não foi possível abrir a câmera."
        );

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

        requestAnimationFrame(
            procurarQRCode
        );

        return;

    }


    /*
        Verifica se o vídeo
        está realmente funcionando
    */

    if (
        camera.readyState >=
        camera.HAVE_ENOUGH_DATA
    ) {


        canvas.width =
            camera.videoWidth;

        canvas.height =
            camera.videoHeight;


        /*
            Copia a imagem da câmera
            para o canvas
        */

        contexto.drawImage(
            camera,
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
            Pega os pixels
        */

        const imagem =
            contexto.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );


        /*
            Procura QR Code
        */

        const codigo =
            jsQR(
                imagem.data,
                imagem.width,
                imagem.height,
                {
                    inversionAttempts:
                        "attemptBoth"
                }
            );


        /*
            Encontrou um QR Code
        */

        if (codigo) {


            const texto =
                codigo.data
                    .trim()
                    .toUpperCase();


            const agora =
                Date.now();


            /*
                Evita detectar
                o mesmo QR várias vezes
            */

            if (
                texto !== ultimoCodigo ||
                agora - ultimoDetectado >
                3000
            ) {


                ultimoCodigo =
                    texto;


                ultimoDetectado =
                    agora;


                console.log(
                    "QR Code encontrado:",
                    texto
                );


                produtoDetectado(
                    texto
                );

            }

        }

    }


    requestAnimationFrame(
        procurarQRCode
    );

}


/* =====================================
   PRODUTO ENCONTRADO
===================================== */

function produtoDetectado(codigo) {


    const produto =
        produtos[codigo];


    /*
        Se não existe
    */

    if (!produto) {

        mostrarAviso(
            "❌ Produto não cadastrado: " +
            codigo
        );

        return;

    }


    console.log(
        "Produto encontrado:",
        produto.nome
    );


    /*
        Aqui depois vamos
        abrir a tela do produto
    */

    mostrarAviso(
        "🛒 " +
        produto.nome +
        " encontrado!"
    );


    /*
        Para o leitor
        temporariamente
    */

    lendoQRCode = false;


    /*
        Depois de alguns segundos
        pode procurar novamente
    */

    setTimeout(
        function () {

            lendoQRCode = true;

        },
        3000
    );

}


/* =====================================
   MOSTRAR AVISO
===================================== */

let avisoTimer;


function mostrarAviso(texto) {


    aviso.textContent =
        texto;


    aviso.classList.remove(
        "escondido"
    );


    clearTimeout(
        avisoTimer
    );


    avisoTimer =
        setTimeout(
            function () {

                aviso.classList.add(
                    "escondido"
                );

            },
            3000
        );

}


/* =====================================
   BOTÃO ABRIR CÂMERA
===================================== */

botaoCamera.addEventListener(
    "click",
    iniciarCamera
);
```

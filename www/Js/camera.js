

/* =====================================
   PEGAR ELEMENTOS DO HTML
===================================== */

const camera =
    document.getElementById("camera");

const canvas =
    document.getElementById("qrCanvas");

const contexto =
    canvas.getContext("2d", {
        willReadFrequently: true
    });


const saldoElemento =
    document.getElementById("saldo");

const tempoElemento =
    document.getElementById("tempo");


const produtoEncontrado =
    document.getElementById(
        "produtoEncontrado"
    );

const produtoImagem =
    document.getElementById(
        "produtoImagem"
    )

const produtoNome =
    document.getElementById(
        "produtoNome"
    );

const produtoPreco =
    document.getElementById(
        "produtoPreco"
    );

const produtoCategoria =
    document.getElementById(
        "produtoCategoria"
    );

const comprarBotao =
    document.getElementById(
        "comprarBtn"
    );

const cancelarBotao =
    document.getElementById(
        "cancelarBtn"
    );

const fecharBotao =
    document.getElementById(
        "fecharProduto"
    );

const aviso =
    document.getElementById(
        "aviso"
    );

/* =====================================
   PRODUTOS

   O código precisa ser igual
   ao conteúdo do QR Code.
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
   SALDO INICIAL
===================================== */

let saldo =
    Number(
        localStorage.getItem(
            "estoqueZeroSaldo"
        )
    );

/*
   Se ainda não existir saldo,
   começa com R$ 50,00.
*/

if (Number.isNaN(saldo)) {

    saldo = 50.00;

    localStorage.setItem(
        "estoqueZeroSaldo",
        saldo
    );
}

/* =====================================
   MOSTRAR SALDO
===================================== */

function atualizarSaldo() {

    saldoElemento.textContent =
        formatarDinheiro(saldo);
}

function formatarDinheiro(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

atualizarSaldo();

// =====================================
// ABRIR CÂMERA DO CELULAR
// =====================================

async function iniciarCamera() {

    console.log("Iniciando câmera...");


    // Verifica se o navegador possui câmera

    if (!navigator.mediaDevices) {

        mostrarAviso(
            "❌ Este navegador não permite acesso à câmera."
        );

        console.error(
            "navigator.mediaDevices não está disponível."
        );

        return;
    }


    try {

        console.log("Pedindo permissão para câmera...");


        // Pede a câmera TRASEIRA

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

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

            });


        console.log(
            "✅ Câmera liberada!"
        );


        // Coloca a câmera no vídeo

        camera.srcObject = stream;


        // Força o vídeo a começar

        await camera.play();


        console.log(
            "✅ Vídeo da câmera iniciado!"
        );


        camera.addEventListener(
            "loadedmetadata",
            () => {

                canvas.width =
                    camera.videoWidth;

                canvas.height =
                    camera.videoHeight;


                console.log(
                    "Tamanho da câmera:",
                    camera.videoWidth,
                    "x",
                    camera.videoHeight
                );


                procurarQRCode();

            },
            {
                once: true
            }
        );


    }

    catch (erro) {

        console.error(
            "❌ ERRO DA CÂMERA:",
            erro.name,
            erro.message
        );


        // =================================
        // MOSTRAR O ERRO NA TELA
        // =================================

        if (
            erro.name ===
            "NotAllowedError"
        ) {

            mostrarAviso(
                "🔒 Permita o acesso à câmera neste navegador."
            );

        }

        else if (
            erro.name ===
            "NotFoundError"
        ) {

            mostrarAviso(
                "📷 Nenhuma câmera foi encontrada."
            );

        }

        else if (
            erro.name ===
            "NotReadableError"
        ) {

            mostrarAviso(
                "📷 A câmera está sendo usada por outro aplicativo."
            );

        }

        else if (
            erro.name ===
            "OverconstrainedError"
        ) {

            mostrarAviso(
                "📷 Não foi possível selecionar a câmera traseira."
            );

        }

        else {

            mostrarAviso(
                "❌ Erro ao abrir a câmera: " +
                erro.name
            );

        }

    }

}

/* =====================================
   LER QR CODE
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

    if (
        camera.readyState ===
        camera.HAVE_ENOUGH_DATA
    ) {

        canvas.width =
            camera.videoWidth;

        canvas.height =
            camera.videoHeight;

        /*
           Copia a imagem da câmera
           para o canvas.
        */

        contexto.drawImage(

            camera,

            0,
            0,

            canvas.width,
            canvas.height
        );

        /*
           Pega os pixels da imagem.
        */

        const imagem =
            contexto.getImageData(

                0,
                0,

                canvas.width,
                canvas.height
            );

        /*
           Procura o QR Code.
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
           Encontrou QR Code?
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
               o mesmo QR várias vezes.
            */

            if (

                texto !== ultimoCodigo ||

                agora - ultimoDetectado > 3000

            ) {

                ultimoCodigo =
                    texto;

                ultimoDetectado =
                    agora;

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

let produtoAtual = null;

function produtoDetectado(codigo) {

    /*
       Procura o produto
       dentro da lista.
    */

    const produto =
        produtos[codigo];

    /*
       QR Code não cadastrado.
    */

    if (!produto) {

        mostrarAviso(

            "❌ Produto não cadastrado: " +
            codigo

        );

        return;
    }

    /*
       Guarda o produto encontrado.
    */

    produtoAtual =
        produto;

    /*
       Coloca os dados
       na tela.
    */

    produtoImagem.textContent =
        produto.imagem;

    produtoNome.textContent =
        produto.nome;

    produtoPreco.textContent =
        formatarDinheiro(
            produto.preco
        );

    produtoCategoria.textContent =
        produto.categoria;


    /*
       Mostra a janela.
    */

    produtoEncontrado
        .classList
        .remove("escondido");

    /*
       Para temporariamente
       a leitura da câmera.
    */

    lendoQRCode = false;
}

/* =====================================
   BOTÃO COMPRAR
===================================== */

comprarBotao.addEventListener(
    "click",
    () => {

        /*
           Segurança:
           não existe produto.
        */

        if (!produtoAtual) {

            return;
        }

        /*
           Verifica se tem dinheiro.
        */

        if (
            produtoAtual.preco >
            saldo
        ) {

            mostrarAviso(

                "💸 Saldo insuficiente!"

            );

            return;
        }

        /*
           DESCONTA O PRODUTO
           DO SALDO
        */

        saldo -=
            produtoAtual.preco;

        /*
           Corrige possíveis
           casas decimais.
        */

        saldo =
            Math.round(
                saldo * 100
            ) / 100;

        /*
           Salva o novo saldo.
        */

        localStorage.setItem(

            "estoqueZeroSaldo",

            saldo
        );

        /*
           Atualiza a tela.
        */

        atualizarSaldo();

        /*
           Guarda o nome
           antes de fechar.
        */

        const nome =
            produtoAtual.nome;

        const preco =
            produtoAtual.preco;

        /*
           Fecha a janela.
        */

        fecharModal();

        /*
           Mostra confirmação.
        */

        mostrarAviso(

            "🛒 Você comprou " +
            nome +
            " por " +
            formatarDinheiro(preco) +
            "!"

        );

        /*
           Se acabou o dinheiro.
        */

        if (saldo === 0) {

            setTimeout(
                () => {

                    mostrarAviso(

                        "⚠️ Você gastou todo o orçamento!"

                    );

                },
                2500
            );
        }

    }
);

/* =====================================
   FECHAR PRODUTO
===================================== */

function fecharModal() {

    produtoEncontrado
        .classList
        .add("escondido");

    produtoAtual = null;

    /*
       Aguarda um pouco para
       não detectar o mesmo QR
       imediatamente.
    */

    setTimeout(
        () => {

            lendoQRCode = true;

        },
        700
    );
}

cancelarBotao.addEventListener(
    "click",
    fecharModal
);

fecharBotao.addEventListener(
    "click",
    fecharModal
);

/* =====================================
   AVISOS
===================================== */

let avisoTimer;

function mostrarAviso(texto) {

    aviso.textContent =
        texto;

    aviso.classList
        .remove("escondido");


    clearTimeout(
        avisoTimer
    );

    avisoTimer =
        setTimeout(
            () => {

                aviso.classList
                    .add("escondido");

            },
            2500
        );
}

/* =====================================
   CRONÔMETRO

   120 segundos = 2 minutos
===================================== */

let segundos = 120;

let jogoTerminou = false;

function atualizarTempo() {

    /*
       Se acabou o jogo,
       não continua.
    */

    if (jogoTerminou) {

        return;
    }

    const minutos =
        Math.floor(
            segundos / 60
        );

    const segundosRestantes =
        segundos % 60;

    /*
       Mostra:

       02:00
       01:59
       01:58
       ...
    */

    tempoElemento.textContent =

        String(minutos)
            .padStart(2, "0")

        + ":" +

        String(segundosRestantes)
            .padStart(2, "0");

    /*
       Tempo acabou.
    */

    if (segundos <= 0) {

        jogoTerminou = true;

        mostrarAviso(

            "⏰ Tempo encerrado! Veja seu resultado."

        );

        return;
    }

    segundos--;
}

/*
   Começa o cronômetro.
*/

atualizarTempo();

setInterval(
    atualizarTempo,
    1000
);


document
    .getElementById("abrirCamera")
    .addEventListener(
        "click",
        iniciarCamera
    );
/* =====================================
   INICIAR O JOGO
===================================== */
iniciarCamera();
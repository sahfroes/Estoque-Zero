/* =====================================
   ESTOQUE ZERO
   JAVASCRIPT DO PERFIL
===================================== */


/* =========================
   PEGAR ELEMENTOS
========================= */

const nome =
    document.getElementById("nome");

const email =
    document.getElementById("email");

const senha =
    document.getElementById("senha");

const perfilFinanceiro =
    document.getElementById(
        "perfilFinanceiro"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


/* =========================
   CARREGAR PERFIL
========================= */

function carregarPerfil() {

    const perfilSalvo =
        JSON.parse(
            localStorage.getItem(
                "estoqueZeroPerfil"
            )
        );


    /*
       Se já existe um perfil,
       coloca os dados nos campos.
    */

    if (perfilSalvo) {

        nome.value =
            perfilSalvo.nome || "";

        email.value =
            perfilSalvo.email || "";

        senha.value =
            perfilSalvo.senha || "";

        perfilFinanceiro.value =
            perfilSalvo.perfil ||
            "consciente";

    }

}


/* =========================
   SALVAR PERFIL
========================= */

function salvarPerfil() {


    /*
       Verifica se o nome
       foi preenchido.
    */

    if (
        nome.value.trim() === ""
    ) {

        mostrarMensagem(
            "⚠️ Digite seu nome."
        );

        nome.focus();

        return;

    }


    /*
       Verifica o e-mail.
    */

    if (
        email.value.trim() === ""
    ) {

        mostrarMensagem(
            "⚠️ Digite seu e-mail."
        );

        email.focus();

        return;

    }


    /*
       Cria o objeto do perfil.
    */

    const dadosPerfil = {

        nome:
            nome.value.trim(),

        email:
            email.value.trim(),

        senha:
            senha.value,

        perfil:
            perfilFinanceiro.value

    };


    /*
       Salva no navegador.
    */

    localStorage.setItem(

        "estoqueZeroPerfil",

        JSON.stringify(
            dadosPerfil
        )

    );


    /*
       Mostra confirmação.
    */

    mostrarMensagem(
        "✅ Perfil salvo com sucesso!"
    );

}


/* =========================
   MOSTRAR / ESCONDER SENHA
========================= */

function mostrarSenha() {

    if (
        senha.type === "password"
    ) {

        senha.type = "text";

    }
    else {

        senha.type = "password";

    }

}


/* =========================
   ALTERAR FOTO
========================= */

function alterarFoto() {

    mostrarMensagem(

        "📷 A alteração da foto ficará disponível em breve."

    );

}


/* =========================
   MOSTRAR MENSAGEM
========================= */

let mensagemTimer;


function mostrarMensagem(texto) {

    mensagem.textContent =
        texto;


    mensagem.classList.remove(
        "escondido"
    );


    clearTimeout(
        mensagemTimer
    );


    mensagemTimer =
        setTimeout(
            function() {

                mensagem.classList.add(
                    "escondido"
                );

            },
            2500
        );

}


/* =========================
   IR PARA DESEMPENHO
========================= */

function abrirDesempenho() {

    window.location.href =
        "desempenho.html";

}


/* =========================
   IR PARA RANKING
========================= */

function abrirRanking() {

    window.location.href =
        "ranking.html";

}


/* =========================
   VOLTAR
========================= */

function voltar() {

    window.location.href =
        "camera.html";

}


/* =========================
   INICIAR
========================= */

carregarPerfil();
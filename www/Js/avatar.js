// ======================================
// LISTA DOS 10 PERSONAGENS
// ======================================

const personagens = [

    {
        nome: "Gigis",
        seed: "gigis-estoque-zero"
    },

    {
        nome: "Alexa",
        seed: "alexa-estoque-zero"
    },

    {
        nome: "Vivi",
        seed: "vivi-estoque-zero"
    },

    {
        nome: "Gao",
        seed: "gao-estoque-zero"
    },

    {
        nome: "Tuco",
        seed: "tuco-estoque-zero"
    },

    {
        nome: "Pulma",
        seed: "pulma-estoque-zero"
    },

    {
        nome: "Robs",
        seed: "robs-estoque-zero"
    },

    {
        nome: "Prin",
        seed: "prin-estoque-zero"
    },

    {
        nome: "Mark",
        seed: "mark-estoque-zero"
    },

    {
        nome: "Ligi",
        seed: "ligi-estoque-zero"
    }

];


// ======================================
// ELEMENTOS DA PÁGINA
// ======================================

const listaAvatares =
    document.getElementById("listaAvatares");

const personagemEscolhido =
    document.getElementById("personagemEscolhido");

const btnContinuar =
    document.getElementById("btnContinuar");

const btnVoltar =
    document.getElementById("btnVoltar");


// Guarda o personagem escolhido

let avatarSelecionado = null;


// ======================================
// CRIAR OS AVATARES
// ======================================

personagens.forEach(function(personagem) {


    // Cria o card
    const card = document.createElement("div");

    card.classList.add("avatar-card");


    // URL da API do DiceBear
    const urlAvatar =
        `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(personagem.seed)}&backgroundColor=e9ddff`;


    // Cria a imagem
    const imagem =
        document.createElement("img");

    imagem.src = urlAvatar;

    imagem.alt =
        `Avatar ${personagem.nome}`;


    // Nome
    const nome =
        document.createElement("span");

    nome.classList.add("nome-avatar");

    nome.textContent =
        personagem.nome;


    // Check de seleção
    const check =
        document.createElement("span");

    check.classList.add("check");

    check.textContent = "✓";


    // Coloca tudo dentro do card
    card.appendChild(imagem);

    card.appendChild(nome);

    card.appendChild(check);


    // Coloca o card na tela
    listaAvatares.appendChild(card);


    // ==================================
    // QUANDO CLICAR NO AVATAR
    // ==================================

    card.addEventListener("click", function() {


        // Remove seleção de todos
        document
            .querySelectorAll(".avatar-card")
            .forEach(function(outroCard) {

                outroCard.classList.remove(
                    "selecionado"
                );

            });


        // Seleciona este
        card.classList.add("selecionado");


        // Guarda personagem
        avatarSelecionado = personagem;


        // Mostra mensagem
        personagemEscolhido.textContent =
            `Você escolheu: ${personagem.nome} 💜`;


        // Libera botão
        btnContinuar.disabled = false;

    });

});


// ======================================
// BOTÃO CONTINUAR
// ======================================

btnContinuar.addEventListener(
    "click",
    function() {


        // Verifica se escolheu
        if (!avatarSelecionado) {

            alert(
                "Escolha um personagem primeiro!"
            );

            return;

        }


        // =================================
        // SALVAR ESCOLHA
        // =================================

        localStorage.setItem(
            "avatarNome",
            avatarSelecionado.nome
        );


        localStorage.setItem(
            "avatarSeed",
            avatarSelecionado.seed
        );


        // =================================
        // IR PARA PRÓXIMA TELA
        // =================================

             window.location.href = "id-criada.html";

    }
);


// ======================================
// BOTÃO VOLTAR
// ======================================

btnVoltar.addEventListener(
    "click",
    function() {

        window.location.href =
            "entrar.html";

    }
);
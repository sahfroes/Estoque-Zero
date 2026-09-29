// ======================================
// LISTA DOS 10 PERSONAGENS
// ======================================

const personagens = [

    {
        id: "gigis",
        nome: "Gigis",
        seed: "gigis-estoque-zero"
    },

    {
        id: "alexa",
        nome: "Alexa",
        seed: "alexa-estoque-zero"
    },

    {
        id: "vivi",
        nome: "Vivi",
        seed: "vivi-estoque-zero"
    },

    {
        id: "gao",
        nome: "Gao",
        seed: "gao-estoque-zero"
    },

    {
        id: "tuco",
        nome: "Tuco",
        seed: "tuco-estoque-zero"
    },

    {
        id: "pulma",
        nome: "Pulma",
        seed: "pulma-estoque-zero"
    },

    {
        id: "robs",
        nome: "Robs",
        seed: "robs-estoque-zero"
    },

    {
        id: "prin",
        nome: "Prin",
        seed: "prin-estoque-zero"
    },

    {
        id: "mark",
        nome: "Mark",
        seed: "mark-estoque-zero"
    },

    {
        id: "ligi",
        nome: "Ligi",
        seed: "ligi-estoque-zero"
    }

];


// ======================================
// ELEMENTOS DA TELA
// ======================================

const listaAvatares =
    document.getElementById(
        "listaAvatares"
    );

const personagemEscolhido =
    document.getElementById(
        "personagemEscolhido"
    );

const btnContinuar =
    document.getElementById(
        "btnContinuar"
    );

const btnVoltar =
    document.getElementById(
        "btnVoltar"
    );


// ======================================
// SALA ATUAL
// ======================================

const codigoTurma =
    localStorage.getItem(
        "codigoTurma"
    );


// ======================================
// VERIFICAR SE ENTROU EM UMA SALA
// ======================================

if (!codigoTurma) {

    alert(
        "Nenhuma sala foi encontrada. Entre em uma sala primeiro."
    );

    window.location.href =
        "entrar.html";

}


// ======================================
// VARIÁVEIS
// ======================================

let avatarSelecionado = null;

let personagensOcupados = new Set();


// ======================================
// CSS DOS PERSONAGENS OCUPADOS
// ======================================

const estiloOcupado =
    document.createElement("style");

estiloOcupado.textContent = `

    .avatar-card.ocupado {
        opacity: 0.45;
        filter: grayscale(1);
        cursor: not-allowed;
        position: relative;
    }

    .avatar-card.ocupado::after {
        content: "🔒 Ocupado";
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 4px 8px;
        border-radius: 10px;
        font-size: 11px;
        white-space: nowrap;
    }

`;

document.head.appendChild(
    estiloOcupado
);


// ======================================
// CRIAR AVATARES
// ======================================

personagens.forEach(
    function (personagem) {

        // ------------------------------
        // CARD
        // ------------------------------

        const card =
            document.createElement(
                "div"
            );

        card.classList.add(
            "avatar-card"
        );

        card.dataset.personagemId =
            personagem.id;


        // ------------------------------
        // AVATAR DICEBEAR
        // ------------------------------

        const urlAvatar =
            `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(
                personagem.seed
            )}&backgroundColor=e9ddff`;


        const imagem =
            document.createElement(
                "img"
            );

        imagem.src =
            urlAvatar;

        imagem.alt =
            `Avatar ${personagem.nome}`;


        // ------------------------------
        // NOME
        // ------------------------------

        const nome =
            document.createElement(
                "span"
            );

        nome.classList.add(
            "nome-avatar"
        );

        nome.textContent =
            personagem.nome;


        // ------------------------------
        // CHECK
        // ------------------------------

        const check =
            document.createElement(
                "span"
            );

        check.classList.add(
            "check"
        );

        check.textContent =
            "✓";


        // ------------------------------
        // MONTAR CARD
        // ------------------------------

        card.appendChild(imagem);

        card.appendChild(nome);

        card.appendChild(check);

        listaAvatares.appendChild(card);


        // ------------------------------
        // CLIQUE
        // ------------------------------

        card.addEventListener(
            "click",
            function () {

                // Se estiver ocupado,
                // não deixa selecionar.

                if (
                    personagensOcupados.has(
                        personagem.id
                    )
                ) {

                    alert(
                        "⚠️ Esse personagem já foi escolhido. Escolha outro."
                    );

                    return;

                }


                // --------------------------
                // REMOVE SELEÇÃO ANTERIOR
                // --------------------------

                document
                    .querySelectorAll(
                        ".avatar-card"
                    )
                    .forEach(
                        function (outroCard) {

                            outroCard.classList.remove(
                                "selecionado"
                            );

                        }
                    );


                // --------------------------
                // SELECIONA
                // --------------------------

                card.classList.add(
                    "selecionado"
                );


                avatarSelecionado =
                    personagem;


                personagemEscolhido.textContent =
                    `Você escolheu: ${personagem.nome}`;


                btnContinuar.disabled =
                    false;

            }
        );

    }
);


// ======================================
// BUSCAR PERSONAGENS OCUPADOS
// ======================================

async function carregarPersonagensOcupados() {

    try {

        const resposta =
            await fetch(
                `/api/jogadores/ocupados?codigo=${encodeURIComponent(
                    codigoTurma
                )}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar jogadores."
            );

        }


        const dados =
            await resposta.json();


        personagensOcupados =
            new Set(
                dados.ocupados || []
            );


        atualizarCardsOcupados();


    } catch (erro) {

        console.error(
            "Erro ao carregar personagens ocupados:",
            erro
        );

    }

}


// ======================================
// ATUALIZAR VISUAL DOS CARDS
// ======================================

function atualizarCardsOcupados() {

    document
        .querySelectorAll(
            ".avatar-card"
        )
        .forEach(
            function (card) {

                const id =
                    card.dataset.personagemId;


                if (
                    personagensOcupados.has(id)
                ) {

                    card.classList.add(
                        "ocupado"
                    );


                    // Se esse personagem estava
                    // selecionado e outra pessoa
                    // pegou primeiro:

                    if (
                        avatarSelecionado &&
                        avatarSelecionado.id === id
                    ) {

                        avatarSelecionado =
                            null;

                        card.classList.remove(
                            "selecionado"
                        );

                        personagemEscolhido.textContent =
                            "Esse personagem acabou de ser escolhido. Escolha outro.";

                        btnContinuar.disabled =
                            true;

                    }

                } else {

                    card.classList.remove(
                        "ocupado"
                    );

                }

            }
        );

}


// ======================================
// CONTINUAR
// ======================================

btnContinuar.addEventListener(
    "click",
    async function () {

        // ------------------------------
        // VERIFICAR SE ESCOLHEU
        // ------------------------------

        if (!avatarSelecionado) {

            alert(
                "Escolha um personagem primeiro!"
            );

            return;

        }


        // ------------------------------
        // DESABILITAR BOTÃO
        // ------------------------------

        btnContinuar.disabled =
            true;

        btnContinuar.textContent =
            "Entrando...";


        try {

            // --------------------------
            // ORÇAMENTO
            // --------------------------

            const orcamento =
                Number(
                    localStorage.getItem(
                        "orcamentoSelecionado"
                    )
                ) || 50;


            // --------------------------
            // ENVIAR PARA SERVIDOR
            // --------------------------

            const resposta =
                await fetch(
                    "/api/jogadores/entrar",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                codigo:
                                    codigoTurma,

                                personagemId:
                                    avatarSelecionado.id,

                                orcamento:
                                    orcamento

                            })

                    }
                );


            const dados =
                await resposta.json();


            // --------------------------
            // PERSONAGEM JÁ OCUPADO
            // --------------------------

            if (
                resposta.status === 409
            ) {

                alert(
                    "⚠️ " +
                    (
                        dados.mensagem ||
                        "Esse personagem já foi escolhido."
                    )
                );


                personagensOcupados.add(
                    avatarSelecionado.id
                );


                atualizarCardsOcupados();


                avatarSelecionado =
                    null;


                btnContinuar.disabled =
                    true;

                btnContinuar.textContent =
                    "Continuar →";


                return;

            }


            // --------------------------
            // OUTRO ERRO
            // --------------------------

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao entrar no jogo."
                );

            }


            // --------------------------
            // SALVAR PERSONAGEM
            // --------------------------

            localStorage.setItem(
                "personagemId",
                avatarSelecionado.id
            );


            localStorage.setItem(
                "avatarNome",
                avatarSelecionado.nome
            );


            localStorage.setItem(
                "avatarSeed",
                avatarSelecionado.seed
            );


            localStorage.setItem(
                "codigoTurma",
                codigoTurma
            );


            // --------------------------
            // IR PARA PRÓXIMA TELA
            // --------------------------

            window.location.href =
                "id-criada.html";


        } catch (erro) {

            console.error(
                "Erro ao reservar personagem:",
                erro
            );


            alert(
                "Não foi possível entrar com esse personagem. Tente novamente."
            );


            btnContinuar.disabled =
                false;

            btnContinuar.textContent =
                "Continuar →";

        }

    }
);


// ======================================
// BOTÃO VOLTAR
// ======================================

btnVoltar.addEventListener(
    "click",
    function () {

        window.location.href =
            "entrar.html";

    }
);


// ======================================
// PRIMEIRA CONSULTA
// ======================================

carregarPersonagensOcupados();


// ======================================
// ATUALIZAR A CADA 2 SEGUNDOS
// ======================================
//
// Isso faz com que, se a pessoa A
// escolher "Robs", a pessoa B veja
// Robs como ocupado rapidamente.
//

const intervaloOcupados =
    setInterval(
        carregarPersonagensOcupados,
        2000
    );
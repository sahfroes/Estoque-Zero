/* ==========================================
   VERIFICAÇÃO DE ACESSO
========================================== */

const autorizada =
    sessionStorage.getItem(
        "professoraAutorizada"
    );

const codigo =
    localStorage.getItem(
        "codigoTurmaProfessora"
    );


if (
    autorizada !== "true" ||
    !codigo
) {

    window.location.href =
        "login-professora.html";

}


/* ==========================================
   ELEMENTOS
========================================== */

const nomeTurma =
    document.getElementById("nomeTurma");

const totalParticipantes =
    document.getElementById(
        "totalParticipantes"
    );

const totalFinalizados =
    document.getElementById(
        "totalFinalizados"
    );

const totalGastoTurma =
    document.getElementById(
        "totalGastoTurma"
    );

const corpoRanking =
    document.getElementById(
        "corpoRanking"
    );

const carregando =
    document.getElementById(
        "carregando"
    );

const botaoSair =
    document.getElementById(
        "botaoSair"
    );

const botaoRanking =
    document.getElementById(
        "botaoRanking"
    );


/* ==========================================
   MOEDA
========================================== */

function moeda(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* ==========================================
   TEMPO
========================================== */

function formatarTempo(segundos) {

    segundos = Number(segundos || 0);

    const minutos =
        Math.floor(segundos / 60);

    const segundosRestantes =
        segundos % 60;

    return (
        String(minutos).padStart(2, "0")
        + ":" +
        String(segundosRestantes).padStart(2, "0")
    );

}


/* ==========================================
   AVATAR
========================================== */

function gerarAvatar(jogador) {

    const seed =
        jogador.avatar ||
        jogador.personagemId ||
        jogador.nome ||
        "estoque-zero";

    return (
        "https://api.dicebear.com/10.x/adventurer/svg" +
        "?seed=" +
        encodeURIComponent(seed)
    );

}


/* ==========================================
   CARREGAR RANKING
========================================== */

async function carregarRanking() {

    try {

        carregando.style.display =
            "block";

        const resposta =
            await fetch(
                "/api/jogadores/ranking?codigo=" +
                encodeURIComponent(codigo)
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar ranking."
            );

        }


        const jogadores =
            dados.jogadores || [];


        nomeTurma.textContent =
            "Turma: " + codigo;


        totalParticipantes.textContent =
            jogadores.length;


        const finalizados =
            jogadores.filter(
                jogador =>
                    jogador.finalizou === true
            );


        totalFinalizados.textContent =
            finalizados.length;


        const gastoTotal =
            jogadores.reduce(
                (total, jogador) => {

                    return total +
                        Number(
                            jogador.totalGasto || 0
                        );

                },
                0
            );


        totalGastoTurma.textContent =
            moeda(gastoTotal);


        /*
         * Ordenação:
         * 1. Pontuação
         * 2. Quantidade de itens
         * 3. Saldo
         */

        jogadores.sort(
            (a, b) => {

                const pontosA =
                    Number(
                        a.pontuacao || 0
                    );

                const pontosB =
                    Number(
                        b.pontuacao || 0
                    );

                if (
                    pontosA !== pontosB
                ) {

                    return pontosB - pontosA;

                }


                const itensA =
                    Number(
                        a.quantidadeTotalItens || 0
                    );

                const itensB =
                    Number(
                        b.quantidadeTotalItens || 0
                    );


                if (
                    itensA !== itensB
                ) {

                    return itensB - itensA;

                }


                return Number(
                    b.saldoRestante || 0
                ) -
                Number(
                    a.saldoRestante || 0
                );

            }
        );


        corpoRanking.innerHTML = "";


        jogadores.forEach(
            (jogador, indice) => {

                const linha =
                    document.createElement("tr");


                const tempo =
                    jogador.tempoJogado ??
                    jogador.tempoRestante ??
                    0;


                linha.innerHTML = `

                    <td class="posicao">
                        ${indice + 1}º
                    </td>

                    <td>

                        <div class="jogador">

                            <img
                                class="avatar"
                                src="${gerarAvatar(jogador)}"
                                alt="Avatar"
                            >

                            <div>

                                <div class="nome">
                                    ${
                                        jogador.nome ||
                                        jogador.personagemId ||
                                        "Jogador"
                                    }
                                </div>

                            </div>

                        </div>

                    </td>

                    <td>
                        ${
                            jogador.quantidadeTotalItens ||
                            0
                        }
                    </td>

                    <td>
                        ${moeda(jogador.orcamento)}
                    </td>

                    <td>
                        ${moeda(jogador.totalGasto)}
                    </td>

                    <td>
                        ${moeda(jogador.saldoRestante)}
                    </td>

                    <td>
                        ${formatarTempo(tempo)}
                    </td>

                    <td class="pontos">
                        ${
                            jogador.pontuacao ||
                            0
                        } pts
                    </td>

                    <td>

                        <button
                            class="botao-detalhes"
                            data-id="${
                                jogador.personagemId
                            }"
                        >
                            Ver
                        </button>

                    </td>

                `;


                corpoRanking.appendChild(
                    linha
                );

            }
        );


        document
            .querySelectorAll(
                ".botao-detalhes"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.id;


                        localStorage.setItem(
                            "personagemSelecionadoProfessora",
                            id
                        );


                        window.location.href =
                            "perfil-aluno.html";

                    }
                );

            });


    } catch (erro) {

        console.error(erro);

        carregando.textContent =
            "Não foi possível carregar os resultados.";

    } finally {

        carregando.style.display =
            "none";

    }

}


/* ==========================================
   NAVEGAÇÃO
========================================== */

botaoRanking.addEventListener(
    "click",
    function () {

        window.location.href =
            "ranking-professora.html";

    }
);


botaoSair.addEventListener(
    "click",
    function () {

        sessionStorage.removeItem(
            "professoraAutorizada"
        );

        localStorage.removeItem(
            "codigoTurmaProfessora"
        );

        localStorage.removeItem(
            "personagemSelecionadoProfessora"
        );

        window.location.href =
            "login-professora.html";

    }
);


/* ==========================================
   INICIAR
========================================== */

carregarRanking();
const codigo =
    localStorage.getItem(
        "codigoTurmaProfessora"
    );


if (
    sessionStorage.getItem(
        "professoraAutorizada"
    ) !== "true" ||
    !codigo
) {

    window.location.href =
        "login-professora.html";

}


document.getElementById(
    "turma"
).textContent =
    "Turma: " + codigo;


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


function avatar(jogador) {

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


async function carregarRanking() {

    try {

        const resposta =
            await fetch(
                "/api/jogadores/ranking?codigo=" +
                encodeURIComponent(codigo)
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem
            );

        }


        const jogadores =
            dados.jogadores || [];


        jogadores.sort(
            (a, b) =>
                Number(b.pontuacao || 0) -
                Number(a.pontuacao || 0)
        );


        mostrarPodio(jogadores);

        mostrarLista(jogadores);


    } catch (erro) {

        console.error(erro);

        document.getElementById(
            "listaRanking"
        ).textContent =
            "Erro ao carregar ranking.";

    }

}


function mostrarPodio(jogadores) {

    const lugares = [
        "segundo",
        "primeiro",
        "terceiro"
    ];


    const indices = [
        1,
        0,
        2
    ];


    lugares.forEach(
        (id, indice) => {

            const jogador =
                jogadores[indices[indice]];


            if (!jogador) {

                document.getElementById(id)
                    .innerHTML =
                    "Sem participante";

                return;

            }


            document.getElementById(id)
                .innerHTML = `

                    <img
                        src="${avatar(jogador)}"
                        alt="Avatar"
                    >

                    <h3>
                        ${
                            jogador.nome ||
                            jogador.personagemId
                        }
                    </h3>

                    <strong>
                        ${
                            jogador.pontuacao || 0
                        } pts
                    </strong>

                    <small>
                        ${
                            moeda(
                                jogador.saldoRestante
                            )
                        }
                        restantes
                    </small>

                `;

        }
    );

}


function mostrarLista(jogadores) {

    const lista =
        document.getElementById(
            "listaRanking"
        );


    lista.innerHTML = "";


    jogadores.forEach(
        (jogador, indice) => {

            const div =
                document.createElement("div");


            div.className =
                "jogador";


            div.innerHTML = `

                <div class="posicao">
                    ${indice + 1}º
                </div>

                <div>

                    <img
                        class="avatar"
                        src="${avatar(jogador)}"
                        alt="Avatar"
                    >

                    <span class="nome">
                        ${
                            jogador.nome ||
                            jogador.personagemId
                        }
                    </span>

                    <div class="info">
                        ${
                            jogador.quantidadeTotalItens ||
                            0
                        } itens
                    </div>

                </div>

                <div class="valor">

                    ${
                        jogador.pontuacao ||
                        0
                    }

                    <small>pts</small>

                </div>

                <div class="valor extra">

                    ${
                        moeda(
                            jogador.totalGasto
                        )
                    }

                </div>

                <div class="valor extra">

                    ${
                        moeda(
                            jogador.saldoRestante
                        )
                    }

                </div>

            `;


            lista.appendChild(div);

        }
    );

}


document.getElementById(
    "voltar"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "painel-professora.html";

    }
);


carregarRanking();
// ======================================================
// ELEMENTOS
// ======================================================

const mensagemRanking =
    document.getElementById(
        "mensagemRanking"
    );

const podio =
    document.getElementById(
        "podio"
    );

const primeiroLugar =
    document.getElementById(
        "primeiroLugar"
    );

const segundoLugar =
    document.getElementById(
        "segundoLugar"
    );

const terceiroLugar =
    document.getElementById(
        "terceiroLugar"
    );

const listaRanking =
    document.getElementById(
        "listaRanking"
    );

const minhaPosicao =
    document.getElementById(
        "minhaPosicao"
    );

const minhaPontuacao =
    document.getElementById(
        "minhaPontuacao"
    );


// ======================================================
// SALA
// ======================================================

const codigoTurma =
    localStorage.getItem(
        "codigoTurma"
    );


// ======================================================
// PERSONAGEM ATUAL
// ======================================================

const meuPersonagemId =
    localStorage.getItem(
        "personagemId"
    );


// ======================================================
// VERIFICAR SALA
// ======================================================

if (!codigoTurma) {

    mensagemRanking.textContent =
        "Nenhuma sala foi encontrada.";

    listaRanking.innerHTML =
        `
            <p style="text-align:center;">
                Entre em uma sala primeiro.
            </p>
        `;

} else {

    carregarRanking();

}


// ======================================================
// CALCULAR PONTUAÇÃO
// ======================================================

function calcularPontuacao(jogador) {

    const orcamento =
        Number(jogador.orcamento) || 50;

    const saldo =
        Number(jogador.saldoRestante) || 0;


    if (orcamento <= 0) {

        return 0;

    }


    const porcentagemGuardada =
        saldo / orcamento;


    let pontuacao =
        Math.round(
            porcentagemGuardada * 100
        );


    return Math.max(
        0,
        Math.min(
            100,
            pontuacao
        )
    );

}


// ======================================================
// BUSCAR RANKING
// ======================================================

async function carregarRanking() {

    try {

        mensagemRanking.textContent =
            "Carregando participantes...";


        const resposta =
            await fetch(
                `/api/jogadores/ranking?codigo=${encodeURIComponent(
                    codigoTurma
                )}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o ranking."
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "📊 Dados recebidos do Firebase:",
            dados
        );


        let jogadores =
            dados.jogadores || [];


        // ==================================================
        // NORMALIZAR DADOS
        // ==================================================

        jogadores =
            jogadores.map(
                function (jogador) {

                    const produtos =
                        Array.isArray(
                            jogador.produtos
                        )
                            ? jogador.produtos
                            : [];


                    // Se o Firebase tiver pontuação,
                    // usa a pontuação salva.
                    //
                    // Se ainda não tiver,
                    // calcula novamente.

                    let pontuacao =
                        Number(
                            jogador.pontuacao
                        );


                    if (
                        !Number.isFinite(
                            pontuacao
                        )
                    ) {

                        pontuacao =
                            calcularPontuacao(
                                jogador
                            );

                    }


                    return {

                        ...jogador,

                        pontuacao:
                            pontuacao,

                        produtos:
                            produtos

                    };

                }
            );


        // ==================================================
        // ORDENAR
        // ==================================================

        jogadores.sort(
            function (a, b) {

                // 1º critério:
                // maior pontuação

                if (
                    b.pontuacao !==
                    a.pontuacao
                ) {

                    return (
                        b.pontuacao -
                        a.pontuacao
                    );

                }


                // 2º critério:
                // maior saldo

                const saldoA =
                    Number(
                        a.saldoRestante
                    ) || 0;

                const saldoB =
                    Number(
                        b.saldoRestante
                    ) || 0;


                if (
                    saldoB !==
                    saldoA
                ) {

                    return (
                        saldoB -
                        saldoA
                    );

                }


                // 3º critério:
                // maior quantidade de itens

                const quantidadeA =
                    Number(
                        a.quantidadeTotalItens
                    ) || 0;

                const quantidadeB =
                    Number(
                        b.quantidadeTotalItens
                    ) || 0;


                return (
                    quantidadeB -
                    quantidadeA
                );

            }
        );


        // ==================================================
        // MENSAGEM
        // ==================================================

        const finalizados =
            jogadores.filter(
                jogador =>
                    jogador.finalizou === true
            ).length;


        mensagemRanking.textContent =
            `${finalizados} de ${jogadores.length} jogador(es) finalizaram a missão.`;



        // ==================================================
        // NENHUM JOGADOR
        // ==================================================

        if (
            jogadores.length === 0
        ) {

            listaRanking.innerHTML =
                `
                    <p style="
                        text-align:center;
                        padding:20px;
                        color:#766b86;
                    ">
                        Nenhum jogador entrou na sala ainda.
                    </p>
                `;


            limparPodio();

            return;

        }


        // ==================================================
        // MOSTRAR PÓDIO
        // ==================================================

        mostrarPodio(
            jogadores
        );


        // ==================================================
        // MOSTRAR LISTA
        // ==================================================

        mostrarLista(
            jogadores
        );


        // ==================================================
        // MINHA POSIÇÃO
        // ==================================================

        mostrarMinhaPosicao(
            jogadores
        );


    } catch (erro) {

        console.error(
            "❌ Erro no ranking:",
            erro
        );


        mensagemRanking.textContent =
            "Não foi possível carregar o ranking.";


        listaRanking.innerHTML =
            `
                <p style="
                    text-align:center;
                    padding:20px;
                    color:#b00020;
                ">
                    Erro ao carregar os jogadores.
                </p>
            `;

    }

}


// ======================================================
// MOSTRAR PÓDIO
// ======================================================

function mostrarPodio(jogadores) {

    if (jogadores[0]) {

        primeiroLugar.innerHTML =
            criarJogadorPodio(
                jogadores[0],
                "🥇"
            );

    } else {

        primeiroLugar.innerHTML = "";

    }


    if (jogadores[1]) {

        segundoLugar.innerHTML =
            criarJogadorPodio(
                jogadores[1],
                "🥈"
            );

    } else {

        segundoLugar.innerHTML = "";

    }


    if (jogadores[2]) {

        terceiroLugar.innerHTML =
            criarJogadorPodio(
                jogadores[2],
                "🥉"
            );

    } else {

        terceiroLugar.innerHTML = "";

    }

}


// ======================================================
// CARD DO PÓDIO
// ======================================================

function criarJogadorPodio(
    jogador,
    medalha
) {

    const avatar =
        criarUrlAvatar(
            jogador.avatarSeed
        );


    return `

        <div class="medalha">
            ${medalha}
        </div>

        <div class="avatar">

            <img
                src="${avatar}"
                alt="Avatar de ${jogador.personagemNome}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                    border-radius:50%;
                "
            >

        </div>

        <strong>
            ${jogador.personagemNome}
        </strong>

        <span>
            ${jogador.pontuacao} pontos
        </span>

    `;

}


// ======================================================
// MOSTRAR LISTA
// ======================================================

function mostrarLista(jogadores) {

    listaRanking.innerHTML = "";


    jogadores.forEach(
        function (jogador, index) {

            const posicao =
                index + 1;


            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "item-ranking"
            );


            if (
                jogador.personagemId ===
                meuPersonagemId
            ) {

                item.classList.add(
                    "destaque"
                );

            }


            const avatar =
                criarUrlAvatar(
                    jogador.avatarSeed
                );


            const saldo =
                Number(
                    jogador.saldoRestante
                ) || 0;


            const totalGasto =
                Number(
                    jogador.totalGasto
                ) || 0;


            const quantidade =
                Number(
                    jogador.quantidadeTotalItens
                ) || 0;


            // ==================================================
            // PRODUTOS COMPRADOS
            // ==================================================

            const produtosTexto =
                criarTextoProdutos(
                    jogador.produtos
                );


            item.innerHTML = `

                <div class="posicao">
                    ${posicao}º
                </div>


                <div class="avatar-pequeno">

                    <img
                        src="${avatar}"
                        alt="Avatar"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:contain;
                            border-radius:50%;
                        "
                    >

                </div>


                <div class="informacoes">

                    <strong>
                        ${jogador.personagemNome}
                    </strong>


                    <small>
                        Saldo:
                        R$ ${formatarMoeda(saldo)}
                    </small>


                    <small>
                        ${quantidade}
                        item(ns) ·
                        R$ ${formatarMoeda(totalGasto)}
                        gasto
                    </small>


                    <small>
                        🛒 ${produtosTexto}
                    </small>

                </div>


                <div class="pontos">

                    ${jogador.pontuacao}

                    <small>
                        pontos
                    </small>

                </div>

            `;


            listaRanking.appendChild(
                item
            );

        }
    );

}


// ======================================================
// CRIAR TEXTO DOS PRODUTOS
// ======================================================

function criarTextoProdutos(
    produtos
) {

    if (
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {

        return "Nenhuma compra";

    }


    const lista =
        produtos.map(
            function (produto) {

                const nome =
                    produto.nome ||
                    produto.id ||
                    produto.produto ||
                    "Produto";


                const quantidade =
                    Number(
                        produto.quantidade
                    ) || 1;


                return (
                    nome +
                    " (" +
                    quantidade +
                    "x)"
                );

            }
        );


    return lista.join(", ");

}


// ======================================================
// MINHA POSIÇÃO
// ======================================================

function mostrarMinhaPosicao(
    jogadores
) {

    if (!meuPersonagemId) {

        minhaPosicao.textContent =
            "--";

        minhaPontuacao.textContent =
            "0";

        return;

    }


    const indice =
        jogadores.findIndex(
            jogador =>
                jogador.personagemId ===
                meuPersonagemId
        );


    if (indice === -1) {

        minhaPosicao.textContent =
            "--";

        minhaPontuacao.textContent =
            "0";

        return;

    }


    const jogador =
        jogadores[indice];


    minhaPosicao.textContent =
        `${indice + 1}º lugar`;


    minhaPontuacao.textContent =
        jogador.pontuacao;

}


// ======================================================
// AVATAR
// ======================================================

function criarUrlAvatar(seed) {

    if (!seed) {

        seed =
            "estoque-zero";

    }


    return (
        "https://api.dicebear.com/10.x/adventurer/svg" +
        "?seed=" +
        encodeURIComponent(seed) +
        "&backgroundColor=e9ddff"
    );

}


// ======================================================
// MOEDA
// ======================================================

function formatarMoeda(valor) {

    return Number(valor)
        .toFixed(2)
        .replace(".", ",");

}


// ======================================================
// LIMPAR PÓDIO
// ======================================================

function limparPodio() {

    primeiroLugar.innerHTML = "";

    segundoLugar.innerHTML = "";

    terceiroLugar.innerHTML = "";

}


// ======================================================
// VOLTAR PARA RESULTADO
// ======================================================

function voltarResultado() {

    window.location.href =
        "vitoria.html";

}


// ======================================================
// VOLTAR PARA INÍCIO
// ======================================================

function voltarInicio() {

    window.location.href =
        "orcamento.html";

}


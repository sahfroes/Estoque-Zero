
// ======================================================
// ESTOQUE ZERO — RANKING
// Pontuação, classificação, pódio e emblemas
// ======================================================

// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const mensagemRanking =
    document.getElementById("mensagemRanking");

const podio =
    document.getElementById("podio");

const primeiroLugar =
    document.getElementById("primeiroLugar");

const segundoLugar =
    document.getElementById("segundoLugar");

const terceiroLugar =
    document.getElementById("terceiroLugar");

const listaRanking =
    document.getElementById("listaRanking");

const minhaPosicao =
    document.getElementById("minhaPosicao");

const minhaPontuacao =
    document.getElementById("minhaPontuacao");


// ======================================================
// SALA E PERSONAGEM ATUAL
// ======================================================

const codigoTurma =
    localStorage.getItem("codigoTurma");

const meuPersonagemId =
    localStorage.getItem("personagemId");


// ======================================================
// CAMINHOS DOS EMBLEMAS
// ======================================================
// Considera ranking.html em Frontend/View/
// e a pasta img na raiz pública do projeto.
// ======================================================

const EMBLEMAS = {
    primeiro: "../../img/emblemas/primeiro-lugar.png",
    segundo: "../../img/emblemas/segundo-lugar.png",
    terceiro: "../../img/emblemas/terceiro-lugar.png"
};


// ======================================================
// VERIFICAR SALA
// ======================================================

if (!codigoTurma) {

    mensagemRanking.textContent =
        "Nenhuma sala foi encontrada.";

    listaRanking.innerHTML = `
        <p style="text-align:center; padding:20px;">
            Entre em uma sala primeiro.
        </p>
    `;

    limparPodio();

} else {

    carregarRanking();

}


// ======================================================
// CALCULAR PONTUAÇÃO
// ======================================================
// Quantidade de itens: até 40 pontos.
// Equilíbrio dos gastos: até 60 pontos.
// Pontuação final limitada entre 0 e 100.
// ======================================================

function calcularPontuacao(jogador) {

    const orcamento =
        Number(jogador.orcamento) || 0;

    const totalGasto =
        Number(jogador.totalGasto) || 0;

    const quantidadeCompras =
        Number(jogador.quantidadeTotalItens) || 0;

    if (orcamento <= 0) {
        return 0;
    }

    // --------------------------------------
    // PONTOS PELA QUANTIDADE DE ITENS
    // --------------------------------------

    const quantidadeConsiderada =
        Math.min(Math.max(quantidadeCompras, 0), 5);

    const pontosQuantidade =
        (quantidadeConsiderada / 5) * 40;

    // --------------------------------------
    // PONTOS PELO EQUILÍBRIO DOS GASTOS
    // --------------------------------------

    const percentualGasto =
        totalGasto / orcamento;

    let pontosGasto = 0;

    if (percentualGasto < 0.40) {

        pontosGasto =
            (percentualGasto / 0.40) * 60;

    } else if (percentualGasto <= 0.70) {

        pontosGasto = 60;

    } else {

        pontosGasto =
            ((1 - percentualGasto) / 0.30) * 60;

    }

    // --------------------------------------
    // TOTAL ENTRE 0 E 100
    // --------------------------------------

    const pontuacao =
        pontosQuantidade + pontosGasto;

    return Math.round(
        Math.max(0, Math.min(100, pontuacao))
    );

}


// ======================================================
// CARREGAR RANKING
// ======================================================

async function carregarRanking() {

    try {

        mensagemRanking.textContent =
            "Carregando participantes...";

        const resposta = await fetch(
            `/api/jogadores/ranking?codigo=${encodeURIComponent(codigoTurma)}`
        );

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar o ranking."
            );
        }

        const dados = await resposta.json();

        console.log(
            "Dados recebidos do servidor:",
            dados
        );

        let jogadores = Array.isArray(dados.jogadores)
            ? dados.jogadores
            : [];

        // --------------------------------------
        // NORMALIZAR DADOS DOS PARTICIPANTES
        // --------------------------------------

        jogadores = jogadores.map(function (jogador) {

            const produtos = Array.isArray(jogador.produtos)
                ? jogador.produtos
                : [];

            // Se a pontuação estiver salva, utilizá-la.
            // Se não estiver, calcular uma pontuação de reserva.

            const pontuacaoSalva =
                jogador.pontuacao !== null &&
                jogador.pontuacao !== undefined &&
                jogador.pontuacao !== "";

            const pontuacao = pontuacaoSalva
                ? Number(jogador.pontuacao)
                : calcularPontuacao(jogador);

            return {
                ...jogador,
                pontuacao: Number.isFinite(pontuacao)
                    ? pontuacao
                    : calcularPontuacao(jogador),
                produtos: produtos
            };

        });

        // --------------------------------------
        // ORDENAR CLASSIFICAÇÃO
        // 1. Maior pontuação
        // 2. Maior quantidade de itens
        // 3. Maior saldo restante
        // --------------------------------------

        jogadores.sort(function (a, b) {

            const diferencaPontuacao =
                b.pontuacao - a.pontuacao;

            if (diferencaPontuacao !== 0) {
                return diferencaPontuacao;
            }

            const quantidadeA =
                Number(a.quantidadeTotalItens) || 0;

            const quantidadeB =
                Number(b.quantidadeTotalItens) || 0;

            if (quantidadeB !== quantidadeA) {
                return quantidadeB - quantidadeA;
            }

            const saldoA =
                Number(a.saldoRestante) || 0;

            const saldoB =
                Number(b.saldoRestante) || 0;

            return saldoB - saldoA;

        });

        // --------------------------------------
        // MENSAGEM DE FINALIZAÇÃO
        // --------------------------------------

        const finalizados = jogadores.filter(
            jogador => jogador.finalizou === true
        ).length;

        mensagemRanking.textContent =
            `${finalizados} de ${jogadores.length} jogador(es) finalizaram a missão.`;

        // --------------------------------------
        // NENHUM PARTICIPANTE
        // --------------------------------------

        if (jogadores.length === 0) {

            listaRanking.innerHTML = `
                <p style="
                    text-align:center;
                    padding:20px;
                    color:#766b86;
                ">
                    Nenhum jogador entrou na sala ainda.
                </p>
            `;

            limparPodio();
            mostrarMinhaPosicao([]);

            return;

        }

        // --------------------------------------
        // ATUALIZAR A INTERFACE
        // --------------------------------------

        mostrarPodio(jogadores);
        mostrarLista(jogadores);
        mostrarMinhaPosicao(jogadores);

    } catch (erro) {

        console.error(
            "Erro ao carregar o ranking:",
            erro
        );

        mensagemRanking.textContent =
            "Não foi possível carregar o ranking.";

        listaRanking.innerHTML = `
            <p style="
                text-align:center;
                padding:20px;
                color:#b00020;
            ">
                Erro ao carregar os jogadores.
                Tente atualizar a página.
            </p>
        `;

    }

}


// ======================================================
// MOSTRAR PÓDIO COM OS TRÊS EMBLEMAS
// ======================================================

function mostrarPodio(jogadores) {

    // PRIMEIRO LUGAR

    if (jogadores[0]) {

        primeiroLugar.innerHTML =
            criarJogadorPodio(
                jogadores[0],
                EMBLEMAS.primeiro,
                "Emblema de primeiro lugar"
            );

    } else {

        primeiroLugar.innerHTML = "";

    }

    // SEGUNDO LUGAR

    if (jogadores[1]) {

        segundoLugar.innerHTML =
            criarJogadorPodio(
                jogadores[1],
                EMBLEMAS.segundo,
                "Emblema de segundo lugar"
            );

    } else {

        segundoLugar.innerHTML = "";

    }

    // TERCEIRO LUGAR

    if (jogadores[2]) {

        terceiroLugar.innerHTML =
            criarJogadorPodio(
                jogadores[2],
                EMBLEMAS.terceiro,
                "Emblema de terceiro lugar"
            );

    } else {

        terceiroLugar.innerHTML = "";

    }

}


// ======================================================
// CRIAR CARD DO PÓDIO
// ======================================================

function criarJogadorPodio(
    jogador,
    caminhoEmblema,
    descricaoEmblema
) {

    const avatar =
        criarUrlAvatar(jogador.avatarSeed);

    const nome =
        escaparHTML(jogador.personagemNome || "Participante");

    return `

        <div class="emblema-podio">

            <img
                src="${caminhoEmblema}"
                alt="${descricaoEmblema}"
                class="imagem-emblema"
            >

        </div>

        <div class="avatar">

            <img
                src="${avatar}"
                alt="Avatar de ${nome}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                    border-radius:50%;
                "
            >

        </div>

        <strong>${nome}</strong>

        <span>
            ${jogador.pontuacao} pontos
        </span>

    `;

}


// ======================================================
// MOSTRAR LISTA COMPLETA DO RANKING
// ======================================================

function mostrarLista(jogadores) {

    listaRanking.innerHTML = "";

    jogadores.forEach(function (jogador, index) {

        const posicao = index + 1;

        const item = document.createElement("div");

        item.classList.add("item-ranking");

        // Destacar o jogador atual.

        if (
            jogador.personagemId === meuPersonagemId
        ) {
            item.classList.add("destaque");
        }

        const avatar =
            criarUrlAvatar(jogador.avatarSeed);

        const saldo =
            Number(jogador.saldoRestante) || 0;

        const totalGasto =
            Number(jogador.totalGasto) || 0;

        const quantidade =
            Number(jogador.quantidadeTotalItens) || 0;

        const nome =
            escaparHTML(jogador.personagemNome || "Participante");

        const produtosTexto =
            escaparHTML(criarTextoProdutos(jogador.produtos));

        item.innerHTML = `

            <div class="posicao">
                ${posicao}º
            </div>

            <div class="avatar-pequeno">

                <img
                    src="${avatar}"
                    alt="Avatar de ${nome}"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                        border-radius:50%;
                    "
                >

            </div>

            <div class="informacoes">

                <strong>${nome}</strong>

                <small>
                    Saldo: R$ ${formatarMoeda(saldo)}
                </small>

                <small>
                    ${quantidade} item(ns) ·
                    R$ ${formatarMoeda(totalGasto)} gasto
                </small>

                <small>
                    🛒 ${produtosTexto}
                </small>

            </div>

            <div class="pontos">

                ${jogador.pontuacao}

                <small>pontos</small>

            </div>

        `;

        listaRanking.appendChild(item);

    });

}


// ======================================================
// CRIAR TEXTO DOS PRODUTOS
// ======================================================

function criarTextoProdutos(produtos) {

    if (
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {
        return "Nenhuma compra";
    }

    return produtos.map(function (produto) {

        const nome =
            produto.nome ||
            produto.id ||
            produto.produto ||
            "Produto";

        const quantidade =
            Number(produto.quantidade) || 1;

        return `${nome} (${quantidade}x)`;

    }).join(", ");

}


// ======================================================
// MOSTRAR POSIÇÃO DO PARTICIPANTE ATUAL
// ======================================================

function mostrarMinhaPosicao(jogadores) {

    if (!meuPersonagemId) {

        minhaPosicao.textContent = "--";
        minhaPontuacao.textContent = "0";

        return;

    }

    const indice = jogadores.findIndex(
        jogador =>
            jogador.personagemId === meuPersonagemId
    );

    if (indice === -1) {

        minhaPosicao.textContent = "--";
        minhaPontuacao.textContent = "0";

        return;

    }

    const jogador = jogadores[indice];

    minhaPosicao.textContent =
        `${indice + 1}º lugar`;

    minhaPontuacao.textContent =
        jogador.pontuacao;

}


// ======================================================
// CRIAR URL DO AVATAR
// ======================================================

function criarUrlAvatar(seed) {

    if (!seed) {
        seed = "estoque-zero";
    }

    return (
        "https://api.dicebear.com/10.x/adventurer/svg" +
        "?seed=" +
        encodeURIComponent(seed) +
        "&backgroundColor=e9ddff"
    );

}


// ======================================================
// FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor) {

    return Number(valor)
        .toFixed(2)
        .replace(".", ",");

}


// ======================================================
// ESCAPAR TEXTO EXIBIDO NO HTML
// ======================================================

function escaparHTML(valor) {

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

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

    window.location.href = "vitoria.html";

}

// ======================================================
// VOLTAR PARA INÍCIO
// ======================================================

function voltarInicio() {

    window.location.href = "orcamento.html";

}

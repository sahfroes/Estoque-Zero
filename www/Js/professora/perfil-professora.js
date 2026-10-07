const codigo =
    localStorage.getItem(
        "codigoTurmaProfessora"
    );

const personagemId =
    localStorage.getItem(
        "personagemSelecionadoProfessora"
    );


if (
    sessionStorage.getItem(
        "professoraAutorizada"
    ) !== "true" ||
    !codigo ||
    !personagemId
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


function formatarTempo(segundos) {

    segundos =
        Number(segundos || 0);

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


function definirCategoria(jogador) {

    const orcamento =
        Number(jogador.orcamento || 0);

    const gasto =
        Number(jogador.totalGasto || 0);


    if (orcamento <= 0) {

        return "Sem dados";

    }


    const percentual =
        (gasto / orcamento) * 100;


    if (percentual < 40) {

        return "Econômico";

    }


    if (percentual <= 70) {

        return "Moderado";

    }


    return "Consumista";

}


async function carregarPerfil() {

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


        const jogador =
            jogadores.find(
                item =>
                    item.personagemId ===
                    personagemId
            );


        if (!jogador) {

            throw new Error(
                "Participante não encontrado."
            );

        }


        preencherPerfil(jogador);


    } catch (erro) {

        console.error(erro);

        document.getElementById(
            "listaProdutos"
        ).textContent =
            "Não foi possível carregar o perfil.";

    }

}


function preencherPerfil(jogador) {

    document.getElementById(
        "avatar"
    ).src =
        gerarAvatar(jogador);


    document.getElementById(
        "nome"
    ).textContent =
        jogador.nome ||
        jogador.personagemId ||
        "Jogador";


    document.getElementById(
        "categoria"
    ).textContent =
        definirCategoria(jogador);


    document.getElementById(
        "pontuacao"
    ).textContent =
        `${jogador.pontuacao || 0} pts`;


    document.getElementById(
        "orcamento"
    ).textContent =
        moeda(jogador.orcamento);


    document.getElementById(
        "gasto"
    ).textContent =
        moeda(jogador.totalGasto);


    document.getElementById(
        "saldo"
    ).textContent =
        moeda(jogador.saldoRestante);


    document.getElementById(
        "itens"
    ).textContent =
        jogador.quantidadeTotalItens || 0;


    const tempo =
        jogador.tempoJogado ??
        jogador.tempoRestante ??
        0;


    document.getElementById(
        "tempo"
    ).textContent =
        formatarTempo(tempo);


    mostrarProdutos(
        jogador.produtos || []
    );

}


function mostrarProdutos(produtos) {

    const lista =
        document.getElementById(
            "listaProdutos"
        );


    if (!produtos.length) {

        lista.innerHTML = `
            <p>
                Este participante ainda não
                realizou compras.
            </p>
        `;

        return;

    }


    lista.innerHTML = "";


    produtos.forEach(produto => {

        const quantidade =
            Number(
                produto.quantidade || 1
            );


        const preco =
            Number(
                produto.preco || 0
            );


        const total =
            preco * quantidade;


        const div =
            document.createElement("div");


        div.className =
            "produto";


        div.innerHTML = `

            <div class="produto-info">

                <strong>
                    ${
                        produto.nome ||
                        "Produto"
                    }
                </strong>

                <span>
                    Quantidade:
                    ${quantidade}
                </span>

            </div>


            <div class="produto-valor">

                ${moeda(total)}

                <br>

                <small>
                    ${moeda(preco)} cada
                </small>

            </div>

        `;


        lista.appendChild(div);

    });

}


document.getElementById(
    "voltar"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "ranking-professora.html";

    }
);


carregarPerfil();
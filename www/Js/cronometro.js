// ==========================================
// ESTOQUE ZERO
// CRONÔMETRO DA PARTIDA
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

// 2 minutos = 120 segundos
const DURACAO_PARTIDA = 120;


// Chaves usadas no localStorage
const CHAVE_INICIO =
    "estoqueZeroInicio";

const CHAVE_DURACAO =
    "estoqueZeroDuracao";

const CHAVE_FINALIZADO =
    "estoqueZeroFinalizado";


// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const elementoTempo =
    document.getElementById("tempo");

const alertaTempo =
    document.getElementById("alerta-tempo");

const elementoTempoContainer =
    document.querySelector(".tempo");


// ==========================================
// FORMATAR TEMPO
// ==========================================

function formatarTempo(segundos) {

    const minutos =
        Math.floor(segundos / 60);

    const segundosRestantes =
        segundos % 60;


    return (
        String(minutos).padStart(2, "0")
        +
        ":"
        +
        String(segundosRestantes).padStart(2, "0")
    );

}


// ==========================================
// PEGAR TEMPO RESTANTE
// ==========================================

function obterTempoRestante() {

    const inicioSalvo =
        localStorage.getItem(CHAVE_INICIO);


    // Se não existe partida iniciada
    if (!inicioSalvo) {

        return null;

    }


    const inicio =
        Number(inicioSalvo);


    const duracaoSalva =
        Number(
            localStorage.getItem(CHAVE_DURACAO)
        ) || DURACAO_PARTIDA;


    const agora =
        Date.now();


    const segundosPassados =
        Math.floor(
            (agora - inicio) / 1000
        );


    const restante =
        duracaoSalva - segundosPassados;


    return Math.max(
        0,
        restante
    );

}


// ==========================================
// INICIAR NOVA PARTIDA
// ==========================================

function iniciarNovaPartida() {

    // Só cria um novo horário
    // se ainda não existir.

    if (
        !localStorage.getItem(CHAVE_INICIO)
    ) {

        localStorage.setItem(
            CHAVE_INICIO,
            Date.now().toString()
        );

        localStorage.setItem(
            CHAVE_DURACAO,
            DURACAO_PARTIDA.toString()
        );

        localStorage.setItem(
            CHAVE_FINALIZADO,
            "false"
        );

        console.log(
            "⏱️ Nova partida iniciada!"
        );

    }

}


// ==========================================
// ATUALIZAR TEMPO NA TELA
// ==========================================

function atualizarCronometro() {

    const tempoRestante =
        obterTempoRestante();


    // Não existe partida
    if (tempoRestante === null) {

        return;

    }


    // --------------------------------------
    // MOSTRAR TEMPO
    // --------------------------------------

    if (elementoTempo) {

        elementoTempo.textContent =
            formatarTempo(
                tempoRestante
            );

    }


    // --------------------------------------
    // ÚLTIMOS 10 SEGUNDOS
    // --------------------------------------

    if (
        tempoRestante <= 10 &&
        tempoRestante > 0
    ) {

        if (alertaTempo) {

            alertaTempo.style.display =
                "block";

        }


        if (elementoTempoContainer) {

            elementoTempoContainer.classList.add(
                "tempo-critico"
            );

        }

    }


    // --------------------------------------
    // TEMPO ESGOTADO
    // --------------------------------------

    if (
        tempoRestante <= 0
    ) {

        finalizarCronometro();

    }

}


// ==========================================
// FINALIZAR CRONÔMETRO
// ==========================================

function finalizarCronometro() {

    // Evita executar várias vezes

    if (
        localStorage.getItem(
            CHAVE_FINALIZADO
        ) === "true"
    ) {

        return;

    }


    localStorage.setItem(
        CHAVE_FINALIZADO,
        "true"
    );


    console.log(
        "⏰ TEMPO ESGOTADO!"
    );


    // Mostrar 00:00

    if (elementoTempo) {

        elementoTempo.textContent =
            "00:00";

    }


    // Mostrar alerta

    if (alertaTempo) {

        alertaTempo.style.display =
            "block";

        alertaTempo.innerHTML = `

            <div class="icone-alerta">
                ⏰
            </div>

            <strong>
                Tempo esgotado!
            </strong>

            <span>
                Suas compras foram finalizadas.
            </span>

        `;

    }


    // Ir para vitória

    setTimeout(
        function () {

            window.location.href =
                "vitoria.html";

        },
        1500
    );

}


// ==========================================
// VERIFICAR SE JÁ TERMINOU
// ==========================================

function verificarCronometro() {

    const finalizado =
        localStorage.getItem(
            CHAVE_FINALIZADO
        );


    if (
        finalizado === "true"
    ) {

        if (elementoTempo) {

            elementoTempo.textContent =
                "00:00";

        }

        return;

    }


    atualizarCronometro();

}


// ==========================================
// ATUALIZAÇÃO AUTOMÁTICA
// ==========================================

// Atualiza a tela a cada segundo

setInterval(
    function () {

        verificarCronometro();

    },
    1000
);

// ==========================================
// AO ABRIR A PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        verificarCronometro();

    }
);
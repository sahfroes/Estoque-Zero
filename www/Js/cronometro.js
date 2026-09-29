// ==========================================
// ESTOQUE ZERO
// CRONÔMETRO DA PARTIDA
// ==========================================

// ==========================================
// CONFIGURAÇÕES
// ==========================================

// 2 minutos = 120 segundos
const DURACAO_PARTIDA = 120;


// ==========================================
// CHAVES DO LOCALSTORAGE
// ==========================================

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

    // Ainda não começou
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

    return Math.max(0, restante);
}


// ==========================================
// INICIAR NOVA PARTIDA
// ==========================================

function iniciarNovaPartida() {

    // Se já existe uma partida,
    // NÃO cria outra.
    if (
        localStorage.getItem(CHAVE_INICIO)
    ) {

        console.log(
            "⏱️ Partida já estava iniciada."
        );

        return;
    }

    // Cria o momento exato em que
    // a partida começou.

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
        "⏱️ NOVA PARTIDA INICIADA!"
    );
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


    // ======================================
    // MOSTRAR TEMPO
    // ======================================

    if (elementoTempo) {

        elementoTempo.textContent =
            formatarTempo(
                tempoRestante
            );
    }


    // ======================================
    // ÚLTIMOS 10 SEGUNDOS
    // ======================================

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


    // ======================================
    // TEMPO ESGOTADO
    // ======================================

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


    // Marca como finalizado

    localStorage.setItem(
        CHAVE_FINALIZADO,
        "true"
    );


    console.log(
        "⏰ TEMPO ESGOTADO!"
    );


    // ======================================
    // MOSTRAR 00:00
    // ======================================

    if (elementoTempo) {

        elementoTempo.textContent =
            "00:00";
    }


    // ======================================
    // MOSTRAR ALERTA
    // ======================================

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


    // ======================================
    // IR PARA VITÓRIA
    // ======================================

    setTimeout(
        function () {

            const url =
                new URL(
                    "vitoria.html",
                    window.location.href
                );

            window.location.href =
                url.href;

        },
        1500
    );
}


// ==========================================
// VERIFICAR CRONÔMETRO
// ==========================================

function verificarCronometro() {

    const finalizado =
        localStorage.getItem(
            CHAVE_FINALIZADO
        );


    // ======================================
    // JÁ FINALIZOU
    // ======================================

    if (
        finalizado === "true"
    ) {

        if (elementoTempo) {

            elementoTempo.textContent =
                "00:00";
        }

        return;
    }


    // ======================================
    // ATUALIZAR
    // ======================================

    atualizarCronometro();
}


// ==========================================
// INICIAR / CONTINUAR PARTIDA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * IMPORTANTE:
         *
         * A partida deve começar na CÂMERA.
         *
         * Nas telas CARD e CARRINHO,
         * ela apenas continua.
         */

        const paginaAtual =
            window.location.pathname;


        // Verifica se já existe uma partida

        const inicioExistente =
            localStorage.getItem(
                CHAVE_INICIO
            );


        // ==================================
        // CÂMERA
        // ==================================

        if (
            paginaAtual.includes("camera.html")
        ) {

            // Se não existe partida,
            // começa agora.

            if (!inicioExistente) {

                iniciarNovaPartida();

            }

        }


        // ==================================
        // CARD / CARRINHO
        // ==================================

        /*
         * Se já existe uma partida,
         * não fazemos nada.
         *
         * O tempo continua sendo calculado
         * pelo Date.now().
         */


        // Atualiza imediatamente

        verificarCronometro();


        // Atualiza a cada segundo

        setInterval(
            function () {

                verificarCronometro();

            },
            1000
        );

    }
);
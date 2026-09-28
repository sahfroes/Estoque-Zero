// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const cena =
    document.getElementById("cena-ra");

const mensagemCamera =
    document.getElementById("mensagem-camera");

const erroCamera =
    document.getElementById("erro-camera");

const textoErro =
    document.getElementById("texto-erro");

const tentarNovamente =
    document.getElementById("tentar-novamente");

const botaoCarrinho =
    document.getElementById("botao-carrinho");


// ==========================================
// PRODUTO ATUAL
// ==========================================

let produtoAtualId = null;

let produtoAtualAR = null;

let produtoAtualTarget = null;

let produtoFoiEncontrado = false;

let abrindoCard = false;


// ==========================================
// PRODUTOS
// ==========================================

const produtos = {

    leite: "Leite UHT",

    feijao: "Feijão Carioca",

    arroz: "Arroz Branco",

    macarrao: "Macarrão",

    oleo: "Óleo de Soja",

    acucar: "Açúcar Refinado",

    bombons: "Caixa de Bombons",

    giftcard: "Gift Card",

    copo: "Copo Térmico",

    boneco: "Boneco Colecionável"

};


// ==========================================
// MINDAR PRONTO
// ==========================================

if (cena) {

    cena.addEventListener(
        "arReady",
        function () {

            console.log("==============================");
            console.log("✅ MINDAR PRONTO!");
            console.log("==============================");

            if (mensagemCamera) {

                mensagemCamera.style.display =
                    "none";

            }

        }
    );


    cena.addEventListener(
        "arError",
        function (evento) {

            console.error(
                "❌ ERRO NO MINDAR:",
                evento
            );

            mostrarErro(
                "Não foi possível iniciar a realidade aumentada."
            );

        }
    );

}


// ==========================================
// PEGAR TODOS OS TARGETS
// ==========================================

const targets =
    document.querySelectorAll(
        "[mindar-image-target]"
    );


console.log(
    "================================"
);

console.log(
    "🔎 QUANTIDADE DE TARGETS:",
    targets.length
);

console.log(
    "================================"
);


// ==========================================
// MOSTRAR TARGETS NO CONSOLE
// ==========================================

targets.forEach(
    function (target, index) {

        console.log(
            "Target",
            index,
            "→",
            target.dataset.produto
        );

    }
);


// ==========================================
// CONFIGURAR TARGETS
// ==========================================

targets.forEach(
    function (target) {


        // ======================================
        // TARGET ENCONTRADO
        // ======================================

        target.addEventListener(
            "targetFound",
            function () {

                const produtoEncontrado =
                    target.dataset.produto;


                console.log("");
                console.log("==============================");
                console.log("🎯 TARGET ENCONTRADO!");
                console.log("==============================");

                console.log(
                    "📦 Produto:",
                    produtoEncontrado
                );

                // ----------------------------------
                // VERIFICAR PRODUTO
                // ----------------------------------

                if (
                    !produtoEncontrado ||
                    !produtos[produtoEncontrado]
                ) {

                    console.error(
                        "❌ Produto não cadastrado:",
                        produtoEncontrado
                    );

                    return;

                }

                // ----------------------------------
                // PRODUTO ATUAL
                // ----------------------------------

                produtoAtualId =
                    produtoEncontrado;


                produtoAtualTarget =
                    target;


                // ----------------------------------
                // IMAGEM AR
                // ----------------------------------

                produtoAtualAR =
                    target.querySelector(
                        ".produto-ar"
                    );


                if (!produtoAtualAR) {

                    console.error(
                        "❌ Imagem AR não encontrada:",
                        produtoEncontrado
                    );

                    return;

                }

                console.log(
                    "🖼️ Imagem AR:",
                    produtoAtualAR.id
                );

                // ----------------------------------
                // SALVAR PRODUTO
                // ----------------------------------

                localStorage.setItem(
                    "produtoEncontrado",
                    produtoEncontrado
                );


                localStorage.setItem(
                    "nomeProdutoEncontrado",
                    produtos[produtoEncontrado]
                );


                // ----------------------------------
                // LIBERAR INTERAÇÃO
                // ----------------------------------

                produtoFoiEncontrado =
                    true;


                console.log(
                    "💾 Produto salvo:",
                    produtoEncontrado
                );


                console.log(
                    "✨ PRODUTO APARECEU EM AR!"
                );


                console.log(
                    "👆 Toque no produto para abrir o card."
                );


                if (mensagemCamera) {

                    mensagemCamera.style.display =
                        "none";

                }

            }
        );

        // ======================================
        // TARGET PERDIDO
        // ======================================

        target.addEventListener(
            "targetLost",
            function () {

                console.log(
                    "👋 Target perdido:",
                    target.dataset.produto
                );


                if (
                    produtoAtualId ===
                    target.dataset.produto
                ) {

                    produtoAtualAR = null;

                    produtoAtualTarget = null;

                    produtoAtualId = null;

                    produtoFoiEncontrado = false;

                }

            }
        );

    }
);


// ==========================================
// ABRIR CARD DO PRODUTO
// ==========================================

function abrirCardProduto() {

    if (abrindoCard) {

        return;

    }


    if (!produtoFoiEncontrado) {

        return;

    }

    const produto =
        localStorage.getItem(
            "produtoEncontrado"
        );


    if (!produto) {

        console.error(
            "❌ Nenhum produto salvo."
        );

        return;

    }

    console.log(
        "🛒 Abrindo card:",
        produto
    );


    abrindoCard = true;


    window.location.href =
        "card-produto.html";

}

// ==========================================
// CLIQUE / TOQUE NO PRODUTO
// ==========================================

if (cena) {

    cena.addEventListener(
        "loaded",
        function () {

            const canvas =
                cena.canvas;


            if (!canvas) {

                console.error(
                    "❌ Canvas não encontrado."
                );

                return;

            }

            console.log(
                "👆 Interação ativada."
            );


            canvas.addEventListener(
                "pointerup",
                function (evento) {

                    // ------------------------------
                    // VERIFICAR PRODUTO
                    // ------------------------------

                    if (
                        !produtoFoiEncontrado ||
                        !produtoAtualAR
                    ) {

                        return;

                    }

                    if (
                        !produtoAtualAR.object3D ||
                        !produtoAtualAR.object3D.visible
                    ) {

                        return;

                    }

                    // ------------------------------
                    // POSIÇÃO DO TOQUE
                    // ------------------------------

                    const rect =
                        canvas.getBoundingClientRect();


                    const mouse =
                      new THREE.Vector2();

                    mouse.x =
                        (
                            (evento.clientX - rect.left)
                            / rect.width
                        ) * 2 - 1;

                    mouse.y =
                        -(
                            (evento.clientY - rect.top)
                            / rect.height
                        ) * 2 + 1;

                    // ------------------------------
                    // RAYCASTER
                    // ------------------------------

                    const raycaster =
                        new THREE.Raycaster();


                    raycaster.setFromCamera(
                        mouse,
                        cena.camera
                    );

                    // ------------------------------
                    // VERIFICAR PRODUTO ATUAL
                    // ------------------------------

                    const intersecoes =
                        raycaster.intersectObject(
                            produtoAtualAR.object3D,
                            true
                        );


                    console.log(
                        "🔎 Interseções:",
                        intersecoes.length
                    );

                    // ------------------------------
                    // PRODUTO TOCADO
                    // ------------------------------

                    if (
                        intersecoes.length > 0
                    ) {

                        console.log(
                            "🎯 PRODUTO TOCADO!"
                        );


                        console.log(
                            "📦 Produto:",
                            produtoAtualId
                        );


                        abrirCardProduto();

                    }

                }
            );

        }
    );

}


// ==========================================
// BOTÃO CARRINHO
// ==========================================

if (botaoCarrinho) {

    botaoCarrinho.addEventListener(
        "click",
        function () {

            window.location.href =
                "carrinho.html";

        }
    );

}


// ==========================================
// MOSTRAR ERRO
// ==========================================

function mostrarErro(mensagem) {

    if (mensagemCamera) {

        mensagemCamera.style.display =
            "none";

    }

    if (erroCamera) {

        erroCamera.style.display =
            "block";

    }

    if (textoErro) {

        textoErro.textContent =
            mensagem;

    }

}


// ==========================================
// TENTAR NOVAMENTE
// ==========================================

if (tentarNovamente) {

    tentarNovamente.addEventListener(
        "click",
        function () {

            location.reload();

        }
    );

}


// ==========================================
// CRONÔMETRO DA MISSÃO
// ==========================================

// Duração da missão: 2 minutos
const DURACAO_MISSAO = 120;

// Chaves usadas no localStorage
const CHAVE_TEMPO_FIM = "estoqueZeroTempoFim";
const CHAVE_JOGO_INICIADO = "estoqueZeroJogoIniciado";


// ==========================================
// ELEMENTOS
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
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundosRestantes).padStart(2, "0")
    );

}

// ==========================================
// CRIAR / RECUPERAR TEMPO DA MISSÃO
// ==========================================

function obterTempoFim() {

    let tempoFim =
        Number(
            localStorage.getItem(
                CHAVE_TEMPO_FIM
            )
        );

    // Se ainda não existe,
    // cria os 2 minutos

    if (!tempoFim || isNaN(tempoFim)) {

        tempoFim =
            Date.now() +
            (DURACAO_MISSAO * 1000);

        localStorage.setItem(
            CHAVE_TEMPO_FIM,
            tempoFim
        );

        localStorage.setItem(
            CHAVE_JOGO_INICIADO,
            "true"
        );

    }

    return tempoFim;

}


// ==========================================
// ATUALIZAR TEMPO
// ==========================================

function atualizarTempo() {

    if (!elementoTempo) {
        return;
    }

    const tempoFim =
        obterTempoFim();

    // Calcula quanto tempo realmente falta
    const agora = Date.now();

    let tempoRestante =
        Math.ceil(
            (tempoFim - agora) / 1000
        );

    // Não deixa ficar negativo
    if (tempoRestante < 0) {
        tempoRestante = 0;
    }


    // Mostra na tela
    elementoTempo.textContent =
        formatarTempo(tempoRestante);

    // ======================================
    // ALERTA DOS 10 SEGUNDOS
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

    if (tempoRestante <= 0) {

        if (intervaloTempo) {

            clearInterval(
                intervaloTempo
            );

            intervaloTempo = null;

        }

        finalizarJogo();
    }

}


// ==========================================
// INICIAR ATUALIZAÇÃO
// ==========================================

let intervaloTempo = null;
function iniciarCronometro() {

    // Atualiza imediatamente
    atualizarTempo();

    // Depois atualiza a cada segundo
    if (!intervaloTempo) {

        intervaloTempo =
            setInterval(
                atualizarTempo,
                1000
            );

    }

}

// ==========================================
// FINALIZAR JOGO
// ==========================================

function finalizarJogo() {

    // Evita executar várias vezes

    if (
        localStorage.getItem(
            "estoqueZeroTempoFinalizado"
        ) === "true"
    ) {

        return;

    }


    localStorage.setItem(
        "estoqueZeroTempoFinalizado",
        "true"
    );


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

    setTimeout(
        function () {

            window.location.href =
                "vitoria.html";

        },
        3000
    );

}

// ==========================================
// ORÇAMENTO ESCOLHIDO
// ==========================================

// Pega o orçamento escolhido na tela anterior
const valorSalvo =
    localStorage.getItem("orcamentoSelecionado");

// Converte para número
const saldoInicial =
    Number(valorSalvo);

// Elemento que mostra o saldo na câmera
const elementoSaldo =
    document.getElementById("saldo");


// ==========================================
// MOSTRAR SALDO NA CÂMERA
// ==========================================

if (
    elementoSaldo &&
    !isNaN(saldoInicial)
) {

    elementoSaldo.textContent =
        saldoInicial.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

} else {

    elementoSaldo.textContent =
        "R$ 0,00";

}
// ==========================================
// INICIAR
// ==========================================

iniciarCronometro();
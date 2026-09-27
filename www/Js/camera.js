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
// CRONÔMETRO
// ==========================================

let tempoRestante = 120;

let intervaloTempo = null;


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
// ATUALIZAR TEMPO
// ==========================================

function atualizarTempo() {

    if (!elementoTempo) {

        return;

    }


    elementoTempo.textContent =
        formatarTempo(tempoRestante);


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


    if (
        tempoRestante <= 0
    ) {

        tempoRestante = 0;

        elementoTempo.textContent =
            "00:00";

        pararCronometro();

        finalizarJogo();

    }

}


// ==========================================
// INICIAR CRONÔMETRO
// ==========================================

function iniciarCronometro() {

    if (
        intervaloTempo !== null
    ) {

        return;

    }


    tempoRestante = 120;

    atualizarTempo();


    intervaloTempo =
        setInterval(
            function () {

                tempoRestante--;

                atualizarTempo();

            },
            1000
        );

}


// ==========================================
// PARAR CRONÔMETRO
// ==========================================

function pararCronometro() {

    if (
        intervaloTempo !== null
    ) {

        clearInterval(
            intervaloTempo
        );

        intervaloTempo = null;

    }

}


// ==========================================
// FINALIZAR JOGO
// ==========================================

function finalizarJogo() {

    if (!alertaTempo) {

        return;

    }


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


    setTimeout(
        function () {

            window.location.href =
                "vitoria.html";

        },
        3000
    );

}


// ==========================================
// ORÇAMENTO
// ==========================================

const valorSalvo =
    localStorage.getItem(
        "orcamentoSelecionado"
    );


const saldoInicial =
    Number(valorSalvo);


const elementoSaldo =
    document.getElementById("saldo");


if (
    elementoSaldo &&
    !isNaN(saldoInicial) &&
    saldoInicial >= 0
) {

    elementoSaldo.textContent =
        "R$ " +
        saldoInicial
            .toFixed(2)
            .replace(".", ",");

}

else if (elementoSaldo) {

    elementoSaldo.textContent =
        "R$ 0,00";

}


// ==========================================
// INICIAR CRONÔMETRO
// ==========================================

iniciarCronometro();
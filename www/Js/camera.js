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

const produtoLeite =
    document.getElementById("produto-leite");

// ==========================================
// CONTROLE DE DETECÇÃO
// ==========================================

let produtoFoiEncontrado = false;
let abrindoCard = false;

// ==========================================
// PRODUTOS
// ==========================================

const produtos = {

    arroz: "Arroz Branco",
    feijao: "Feijão Carioca",
    leite: "Leite UHT",
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

            console.log(
                "✅ MindAR pronto!"
            );

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
                "❌ Erro no MindAR:",
                evento
            );

            mostrarErro(
                "Não foi possível iniciar a realidade aumentada."
            );

        }
    );

}

// ==========================================
// PEGAR TARGETS
// ==========================================

const targets =
    document.querySelectorAll(
        "[mindar-image-target]"
    );

// ==========================================
// CONFIGURAR TARGETS
// ==========================================

targets.forEach(
    function (target) {

        // ======================================
        // PRODUTO ENCONTRADO
        // ======================================

        target.addEventListener(
            "targetFound",
            function () {

                console.log(
                    "🎯 TARGET ENCONTRADO!"
                );


                const produtoEncontrado =
                    target.dataset.produto;


                console.log(
                    "Produto:",
                    produtoEncontrado
                );


                // ==================================
                // VERIFICAR PRODUTO
                // ==================================

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


                // ==================================
                // SALVAR PRODUTO
                // ==================================

                localStorage.setItem(
                    "produtoEncontrado",
                    produtoEncontrado
                );


                localStorage.setItem(
                    "nomeProdutoEncontrado",
                    produtos[produtoEncontrado]
                );


                console.log(
                    "✅ Produto salvo:",
                    produtos[produtoEncontrado]
                );


                // ==================================
                // LIBERAR INTERAÇÃO
                // ==================================

                produtoFoiEncontrado =
                    true;


                console.log(
                    "🥛 Produto apareceu em AR!"
                );


                console.log(
                    "👆 Clique/toque no produto para abrir o card."
                );


                // ==================================
                // MOSTRAR INSTRUÇÃO
                // ==================================

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

                // Não bloqueamos imediatamente
                // a interação caso o usuário
                // toque no produto.

            }
        );

    }
);


// ==========================================
// ABRIR CARD
// ==========================================

function abrirCardProduto() {


    if (abrindoCard) {

        return;

    }


    // ======================================
    // VERIFICAR RECONHECIMENTO
    // ======================================

    if (!produtoFoiEncontrado) {

        console.log(
            "⚠️ Primeiro aponte para o produto."
        );

        return;

    }


    // ======================================
    // PEGAR PRODUTO
    // ======================================

    const produto =
        localStorage.getItem(
            "produtoEncontrado"
        );


    if (!produto) {

        console.error(
            "❌ Nenhum produto encontrado."
        );

        return;

    }


    console.log(
        "🛒 Abrindo card do:",
        produto
    );


    abrindoCard = true;


    // ======================================
    // ABRIR CARD
    // ======================================

    window.location.href =
        "card-produto.html";

}


// ==========================================
// CLIQUE / TOQUE NO PRODUTO
// FUNCIONA COM MOUSE E CELULAR
// ==========================================

if (cena) {


    cena.addEventListener(
        "loaded",
        function () {


            console.log(
                "✅ Cena A-Frame carregada!"
            );


            const canvas =
                cena.canvas;


            if (!canvas) {

                console.error(
                    "❌ Canvas do A-Frame não encontrado."
                );

                return;

            }


            console.log(
                "🖱️👆 Sistema de clique/toque ativado!"
            );


            // ======================================
            // RAYCASTER
            // ======================================

            const raycaster =
                new THREE.Raycaster();


            const mouse =
                new THREE.Vector2();


            // ======================================
            // CLIQUE / TOQUE
            // ======================================

            canvas.addEventListener(
                "pointerup",
                function (evento) {


                    // Se ainda não encontrou
                    // o produto, não faz nada.

                    if (!produtoFoiEncontrado) {

                        console.log(
                            "⚠️ Produto ainda não reconhecido."
                        );

                        return;

                    }


                    // ==================================
                    // POSIÇÃO DO CLIQUE
                    // ==================================

                    const rect =
                        canvas.getBoundingClientRect();


                    mouse.x =
                        (
                            (
                                evento.clientX -
                                rect.left
                            ) /
                            rect.width
                        ) * 2 - 1;


                    mouse.y =
                        -(
                            (
                                evento.clientY -
                                rect.top
                            ) /
                            rect.height
                        ) * 2 + 1;


                    console.log(
                        "📍 Clique:",
                        mouse.x,
                        mouse.y
                    );


                    // ==================================
                    // CRIAR RAIO
                    // ==================================

                    raycaster.setFromCamera(
                        mouse,
                        cena.camera
                    );


                    // ==================================
                    // VERIFICAR PRODUTO
                    // ==================================

                    if (!produtoLeite) {

                        console.error(
                            "❌ Produto AR não encontrado."
                        );

                        return;

                    }


                    const objetosEncontrados =
                        raycaster.intersectObject(
                            produtoLeite.object3D,
                            true
                        );


                    // ==================================
                    // PRODUTO FOI CLICADO
                    // ==================================

                    if (
                        objetosEncontrados.length > 0
                    ) {

                        console.log(
                            "🥛 PRODUTO CLICADO/TOCADO!"
                        );


                        abrirCardProduto();

                    }

                    else {

                        console.log(
                            "👆 Clique fora do produto."
                        );

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
// PÁGINA CARREGADA
// ==========================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "📱 Página da câmera carregada."
        );


        console.log(
            "🔎 Quantidade de targets:",
            targets.length
        );

    }
);


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
// ATUALIZAR CRONÔMETRO
// ==========================================

function atualizarTempo() {

    if (!elementoTempo) {

        return;
    }

    elementoTempo.textContent =
        formatarTempo(tempoRestante);

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

    if (tempoRestante <= 0) {

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

    if (intervaloTempo !== null) {

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

    if (intervaloTempo !== null) {


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
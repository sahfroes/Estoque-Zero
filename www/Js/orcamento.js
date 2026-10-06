// ======================================================
// ESTOQUE ZERO - ESCOLHA DO ORÇAMENTO
// ======================================================


// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const cartoesOpcao =
    document.querySelectorAll(".cartao-opcao");

const botaoContinuar =
    document.getElementById("btnContinuar");


// ======================================================
// SELECIONAR CARTÃO DE ORÇAMENTO
// ======================================================

cartoesOpcao.forEach(function (cartao) {

    cartao.addEventListener("click", function () {

        // Remove o destaque de todos os cartões
        cartoesOpcao.forEach(function (c) {
            c.classList.remove("ativo");
        });

        // Adiciona o destaque ao cartão escolhido
        cartao.classList.add("ativo");

        // Marca o radio correspondente
        const radio =
            cartao.querySelector(
                'input[type="radio"]'
            );

        if (radio) {
            radio.checked = true;
        }

    });

});


// ======================================================
// BOTÃO "COMEÇAR"
// ======================================================

if (botaoContinuar) {

    botaoContinuar.addEventListener(
        "click",
        function () {

            // Procura o orçamento selecionado
            const opcaoSelecionada =
                document.querySelector(
                    'input[name="orcamento"]:checked'
                );


            // --------------------------------------------------
            // VERIFICA SE ALGUM ORÇAMENTO FOI SELECIONADO
            // --------------------------------------------------

            if (!opcaoSelecionada) {

                alert(
                    "Escolha um orçamento!"
                );

                return;
            }


            // --------------------------------------------------
            // PEGA O VALOR ESCOLHIDO
            // --------------------------------------------------

            const valor =
                Number(
                    opcaoSelecionada.value
                );


            // --------------------------------------------------
            // VERIFICA SE O VALOR É VÁLIDO
            // --------------------------------------------------

            if (
                !Number.isFinite(valor) ||
                valor <= 0
            ) {

                alert(
                    "Orçamento inválido!"
                );

                console.error(
                    "❌ Valor de orçamento inválido:",
                    opcaoSelecionada.value
                );

                return;
            }


            // ==================================================
            // SALVA O ORÇAMENTO
            // ==================================================

            localStorage.setItem(
                "orcamentoSelecionado",
                String(valor)
            );


            // Também salva como saldo inicial
            localStorage.setItem(
                "saldoInicial",
                String(valor)
            );


            // ==================================================
            // COMEÇA UMA NOVA PARTIDA
            // ==================================================

            // Limpa o carrinho da partida anterior
            localStorage.setItem(
                "carrinho",
                JSON.stringify([])
            );


            // --------------------------------------------------
            // LIMPA DADOS DE PRODUTOS ANTERIORES
            // --------------------------------------------------

            localStorage.removeItem(
                "produtoEncontrado"
            );

            localStorage.removeItem(
                "nomeProdutoEncontrado"
            );

            localStorage.removeItem(
                "precoProdutoEncontrado"
            );


            // --------------------------------------------------
            // LIMPA RESULTADOS DA PARTIDA ANTERIOR
            // --------------------------------------------------

            localStorage.removeItem(
                "totalGasto"
            );

            localStorage.removeItem(
                "saldoFinal"
            );

            localStorage.removeItem(
                "resultadoPartida"
            );


            // --------------------------------------------------
            // LIMPA CONTROLE DO TEMPO
            // --------------------------------------------------

            localStorage.removeItem(
                "estoqueZeroTempoFim"
            );

            localStorage.removeItem(
                "estoqueZeroTempoFinalizado"
            );

            localStorage.removeItem(
                "estoqueZeroInicio"
            );

            localStorage.removeItem(
                "estoqueZeroDuracao"
            );

            localStorage.removeItem(
                "estoqueZeroFinalizado"
            );


            // ==================================================
            // CONFERÊNCIA NO CONSOLE
            // ==================================================

            console.log(
                "================================="
            );

            console.log(
                "💰 NOVA PARTIDA"
            );

            console.log(
                "💰 Orçamento escolhido:",
                valor
            );

            console.log(
                "💾 Orçamento salvo:",
                localStorage.getItem(
                    "orcamentoSelecionado"
                )
            );

            console.log(
                "🛒 Carrinho:",
                localStorage.getItem(
                    "carrinho"
                )
            );

            console.log(
                "================================="
            );


            // ==================================================
            // VAI PARA A CONTAGEM
            // ==================================================

            window.location.href =
                "contagem.html";

        }
    );

}
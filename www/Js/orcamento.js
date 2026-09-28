const cartoesOpcao =
    document.querySelectorAll(".cartao-opcao");

const botaoContinuar =
    document.getElementById("btnContinuar");


// ==========================================
// ESCOLHER ORÇAMENTO
// ==========================================

cartoesOpcao.forEach(function (cartao) {

    cartao.addEventListener("click", function () {

        cartoesOpcao.forEach(function (c) {
            c.classList.remove("ativo");
        });

        cartao.classList.add("ativo");

        const radio =
            cartao.querySelector(
                'input[type="radio"]'
            );

        if (radio) {
            radio.checked = true;
        }

    });

});


// ==========================================
// COMEÇAR PARTIDA
// ==========================================

botaoContinuar.addEventListener(
    "click",
    function () {

        const opcaoSelecionada =
            document.querySelector(
                'input[name="orcamento"]:checked'
            );


        if (!opcaoSelecionada) {

            alert("Escolha um orçamento!");

            return;
        }


        const valor =
            Number(opcaoSelecionada.value);


        // ==================================
        // SALVAR ORÇAMENTO
        // ==================================

        localStorage.setItem(
            "orcamentoSelecionado",
            valor
        );

        localStorage.setItem(
            "saldoInicial",
            valor
        );


        // ==================================
        // NOVO CARRINHO
        // ==================================

        localStorage.setItem(
            "carrinho",
            JSON.stringify([])
        );


        // ==================================
        // LIMPAR PARTIDA ANTERIOR
        // ==================================

        localStorage.removeItem(
            "produtoEncontrado"
        );

        localStorage.removeItem(
            "nomeProdutoEncontrado"
        );

        localStorage.removeItem(
            "estoqueZeroTempoFim"
        );

        localStorage.removeItem(
            "estoqueZeroTempoFinalizado"
        );


        console.log(
            "💰 Orçamento:",
            valor
        );


        console.log(
            "🧹 Nova partida preparada."
        );


        // ==================================
        // IR PARA CONTAGEM
        // ==================================

        window.location.href =
            "contagem.html";

    }
);
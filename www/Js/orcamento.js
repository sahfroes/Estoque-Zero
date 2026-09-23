// ==========================================
// SELECIONAR ELEMENTOS
// ==========================================

const cartoesOpcao =
    document.querySelectorAll(".cartao-opcao");

const botaoContinuar =
    document.getElementById("btnContinuar");


// ==========================================
// SELECIONAR UMA OPÇÃO
// ==========================================

cartoesOpcao.forEach(function (cartao) {

    cartao.addEventListener("click", function () {

        // Remove o destaque de todos
        cartoesOpcao.forEach(function (item) {
            item.classList.remove("ativo");
        });


        // Destaca o cartão escolhido
        cartao.classList.add("ativo");


        // Marca o radio
        const radio =
            cartao.querySelector(
                'input[type="radio"]'
            );

        radio.checked = true;

    });

});


// ==========================================
// BOTÃO COMEÇAR
// ==========================================

botaoContinuar.addEventListener("click", function () {

    // Procura o orçamento selecionado
    const opcaoSelecionada =
        document.querySelector(
            'input[name="orcamento"]:checked'
        );


    // Verifica se existe uma opção
    if (!opcaoSelecionada) {

        alert(
            "Escolha um orçamento para continuar."
        );

        return;
    }


    // Pega o valor
    const valorOrcamento =
        Number(opcaoSelecionada.value);


    // ==========================================
    // SALVAR ORÇAMENTO
    // ==========================================

    localStorage.setItem(
        "orcamentoSelecionado",
        valorOrcamento
    );


    // Também salva o saldo inicial
    localStorage.setItem(
        "saldoInicial",
        valorOrcamento
    );


    // Zera compras anteriores
    localStorage.setItem(
        "quantidadeCarrinho",
        "0"
    );


    // Zera produtos anteriores
    localStorage.setItem(
        "produtosCarrinho",
        JSON.stringify([])
    );


    console.log(
        "Orçamento escolhido:",
        valorOrcamento
    );


    // ==========================================
    // IR PARA CONTAGEM
    // ==========================================

    window.location.href = "contagem.html";

});
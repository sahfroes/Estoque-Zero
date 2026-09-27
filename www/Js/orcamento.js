const cartaosOpcao = document.querySelectorAll(".cartao-opcao");
const botaoContinuar = document.getElementById("btnContinuar");

cartaosOpcao.forEach(function (cartao) {

    cartao.addEventListener("click", function () {

        cartaosOpcao.forEach(function (c) {
            c.classList.remove("ativo");
        });

        cartao.classList.add("ativo");

        const radio =
            cartao.querySelector('input[type="radio"]');

        radio.checked = true;

    });

});


botaoContinuar.addEventListener("click", function () {

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

    // Salva o orçamento escolhido
    localStorage.setItem(
        "orcamentoSelecionado",
        valor
    );

    // Salva também como saldo inicial
    localStorage.setItem(
        "saldoInicial",
        valor
    );

    // Começa um novo carrinho
    localStorage.setItem(
        "carrinho",
        JSON.stringify([])
    );

    window.location.href = "contagem.html";

});
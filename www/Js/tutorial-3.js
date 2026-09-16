// ========================================
// BOTÃO COMEÇAR
// ========================================

const botaoComecar = document.getElementById("botao-comecar");


// ========================================
// INICIAR O DESAFIO
// ========================================

botaoComecar.addEventListener("click", function () {

    // Muda o texto do botão
    botaoComecar.innerHTML = "Preparando...";

    // Evita cliques repetidos
    botaoComecar.disabled = true;


    // Pequeno intervalo antes da próxima tela
    setTimeout(function () {

        // Vai para a tela do saldo inicial
        window.location.href = "orcamento.html";

    }, 500);

});
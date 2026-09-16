// ========================================
// BOTÃO PRÓXIMO
// ========================================

const botaoProximo = document.getElementById("botao-proximo");


// ========================================
// IR PARA O TUTORIAL 2
// ========================================

botaoProximo.addEventListener("click", function () {

    // Muda o texto enquanto a próxima tela carrega
    botaoProximo.innerHTML = "Carregando...";

    // Impede vários cliques
    botaoProximo.disabled = true;

    // Pequena animação antes de mudar de tela
    setTimeout(function () {

        window.location.href = "tutorial-2.html";

    }, 300);

});
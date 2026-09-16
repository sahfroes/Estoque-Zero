// ========================================
// BOTÃO PRÓXIMO
// ========================================

const botaoProximo = document.getElementById("botao-proximo");


// ========================================
// IR PARA O TUTORIAL 3
// ========================================

botaoProximo.addEventListener("click", function () {

    // Altera o texto do botão
    botaoProximo.innerHTML = "Carregando...";

    // Evita que o usuário clique várias vezes
    botaoProximo.disabled = true;


    // Aguarda um pequeno tempo antes de mudar
    setTimeout(function () {

        window.location.href = "tutorial-3.html";

    }, 300);

});
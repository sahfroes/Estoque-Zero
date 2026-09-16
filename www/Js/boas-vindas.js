// =====================================
// ESTOQUE ZERO
// TELA DE BOAS-VINDAS
// =====================================


// Pegando o botão da tela
const botaoComecar =
    document.getElementById("botaoComecar");


// =====================================
// CLIQUE NO BOTÃO
// =====================================

botaoComecar.addEventListener(
    "click",
    function() {

        // Altera o texto enquanto
        // a próxima tela carrega

        botaoComecar.textContent =
            "Vamos lá!";


        // Impede vários cliques
        botaoComecar.disabled = true;


        // Pequeno intervalo para
        // deixar a transição mais suave

        setTimeout(
            function() {

                // Próxima tela do jogo

                window.location.href =
                    "tutorial-1.html";

            },
            300
        );

    }
);
// =================================
// ESTOQUE ZERO
// TELA DE ABERTURA
// =================================


// Pegamos a barra de progresso
const progresso = document.getElementById("progresso");


// Pegamos o texto "Carregando..."
const mensagem = document.getElementById("mensagem");


// Começamos em 0%
let porcentagem = 0;


// =================================
// CARREGAMENTO
// =================================

const carregamento = setInterval(function() {

    // Aumenta 1%
    porcentagem++;


    // Atualiza a barra
    progresso.style.width = porcentagem + "%";


    // Quando chegar em 100%
    if (porcentagem >= 100) {

        // Para o carregamento
        clearInterval(carregamento);


        // Troca a mensagem
        mensagem.textContent = "Pronto!";


        // Espera um pouquinho
        setTimeout(function() {

            // Vai para a tela de Login
            window.location.href = "entrar.html";
        }, 500);

    }

}, 30);
// Elemento do número central
const elementoNumero = document.getElementById('numeroContagem');

// Sequência da contagem
const passos = ['3', '2', '1', 'GO!'];
let indiceAtual = 0;

// Função para atualizar a contagem a cada segundo
const intervaloContagem = setInterval(() => {
  indiceAtual++;

  if (indiceAtual < passos.length) {
    // Atualiza o texto na tela
    elementoNumero.innerText = passos[indiceAtual];
    
    // Pequeno efeito visual ao mudar o número
    elementoNumero.classList.add('animar-numero');
    setTimeout(() => elementoNumero.classList.remove('animar-numero'), 200);
  } else {
    // Para o contador
    clearInterval(intervaloContagem);
    
    // Redireciona para a Tela Principal/Câmera (Tela 10)
    window.location.href = 'camera.html'; // Altere para o nome real do seu arquivo HTML da Tela 10
  }
}, 1000);
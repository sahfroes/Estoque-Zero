// Seleciona os elementos da página usando os nomes em português
const cartaosOpcao = document.querySelectorAll('.cartao-opcao');
const botaoContinuar = document.getElementById('btnContinuar');

// Adiciona evento de clique em cada opção
cartaosOpcao.forEach(cartao => {
  cartao.addEventListener('click', () => {
    // Remove o destaque de todos os cartões
    cartaosOpcao.forEach(c => c.classList.remove('ativo'));
    
    // Adiciona a classe de destaque ao cartão clicado
    cartao.classList.add('ativo');
    
    // Marca o botão radio interno como selecionado
    const opcaoRadio = cartao.querySelector('input[type="radio"]');
    opcaoRadio.checked = true;
  });
});

// Ação do botão Começar
botaoContinuar.addEventListener('click', () => {
  const opcaoSelecionada = document.querySelector('input[name="orcamento"]:checked');
  
  // Salva o valor para usar depois
  localStorage.setItem('orcamentoSelecionado', opcaoSelecionada.value);
  
  // Redireciona para a Tela 9
  window.location.href = 'contagem.html'; 
});
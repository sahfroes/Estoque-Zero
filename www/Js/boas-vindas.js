// Aguarda o carregamento completo do HTML
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENTOS DA PÁGINA
    // =====================================
    const botaoComecar = document.getElementById("botaoComecar");
    const imagemPersonagem = document.getElementById("personagem");
    const tituloBoasVindas = document.getElementById("tituloBoasVindas");

    // =====================================
    // PEGAR PERSONAGEM SALVO
    // =====================================
    const avatarNome = localStorage.getItem("avatarNome");
    const avatarSeed = localStorage.getItem("avatarSeed");

    // =====================================
    // MOSTRAR PERSONAGEM E NOME
    // =====================================
    if (avatarSeed && imagemPersonagem) {
        const urlAvatar = `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=e9ddff`;
        imagemPersonagem.src = urlAvatar;
        imagemPersonagem.alt = `Personagem ${avatarNome || ''}`;
    }

    if (avatarNome && tituloBoasVindas) {
        tituloBoasVindas.textContent = `Olá, ${avatarNome}!`;
    }

    // =====================================
    // BOTÃO COMEÇAR
    // =====================================
    if (botaoComecar) {
        botaoComecar.addEventListener("click", function () {
            botaoComecar.textContent = "Vamos lá!";
            botaoComecar.disabled = true;

            setTimeout(function () {
                window.location.href = "tutorial-1.html";
            }, 300);
        });
    }

});
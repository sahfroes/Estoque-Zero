// ======================================
// IDENTIDADE DO JOGADOR
// ======================================

// Pegamos os elementos da tela
const avatar = document.getElementById("avatar");
const nomeIdentidade = document.getElementById("nomeIdentidade");
const codigoJogador = document.getElementById("codigoJogador");
const pinJogador = document.getElementById("pinJogador");


// ======================================
// AVATAR ESCOLHIDO
// ======================================

// Recupera o avatar salvo na tela anterior
const avatarNome = localStorage.getItem("avatarNome");
const avatarSeed = localStorage.getItem("avatarSeed");


// Se existir um avatar escolhido
if (avatarSeed) {

    avatar.src =
        `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`;

}


// ======================================
// CRIAR IDENTIDADE FICTÍCIA
// ======================================

// Número aleatório para a identidade
const numeroIdentidade =
    Math.floor(100 + Math.random() * 900);


// Define o nome da identidade
if (avatarNome) {

    nomeIdentidade.textContent =
        `${avatarNome} Roxa #${numeroIdentidade}`;

}


// ======================================
// CRIAR CÓDIGO DO JOGADOR
// ======================================

function gerarCodigo() {

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const letra1 =
        letras[Math.floor(Math.random() * letras.length)];

    const letra2 =
        letras[Math.floor(Math.random() * letras.length)];

    const numeros =
        Math.floor(1000 + Math.random() * 9000);

    return `EZ-${letra1}${letra2}${numeros}`;
}


// Cria o código
const codigo = gerarCodigo();

codigoJogador.textContent = codigo;


// Salva o código
localStorage.setItem("codigoJogador", codigo);


// ======================================
// CRIAR PIN
// ======================================

function gerarPin() {

    return Math.floor(1000 + Math.random() * 9000);
}

const pin = gerarPin();

pinJogador.textContent = pin;


// Salva o PIN
localStorage.setItem("pinJogador", pin);


// ======================================
// BOTÃO CONTINUAR
// ======================================

document.getElementById("btnContinuar").addEventListener("click", function () {

    // Vai para a tela de boas-vindas
    window.location.href = "boas-vindas.html";

});


// ======================================
// BOTÃO VOLTAR
// ======================================

document.getElementById("btnVoltar").addEventListener("click", function () {

    window.location.href =
        "avatar.html";

});


// ======================================
// COPIAR CÓDIGO
// ======================================

function copiarCodigo() {

    navigator.clipboard.writeText(codigoJogador.textContent);

    alert("Código do jogador copiado!");

}


// ======================================
// COPIAR PIN
// ======================================

function copiarPin() {

    navigator.clipboard.writeText(pinJogador.textContent);

    alert("PIN copiado!");

}
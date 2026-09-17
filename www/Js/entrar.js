// =============================
// ELEMENTOS DA TELA
// =============================
const formulario = document.getElementById("formularioEntrada");
const codigoTurma = document.getElementById("codigoTurma");
const pin = document.getElementById("pin");
const mensagem = document.getElementById("mensagem");
const mostrarPin = document.getElementById("mostrarPin");

// =============================
// MOSTRAR / ESCONDER PIN
// =============================
mostrarPin.addEventListener("click", function () {
    if (pin.type === "password") {
        pin.type = "text";
        mostrarPin.textContent = "🙈";
    } else {
        pin.type = "password";
        mostrarPin.textContent = "👁";
    }
});

// =============================
// ENTRAR NA SALA
// =============================
formulario.addEventListener("submit", async function (evento) {
    // Impede a página de recarregar
    evento.preventDefault();

    // Pega os valores digitados
    const codigo = codigoTurma.value.trim().toUpperCase();
    const senhaPin = pin.value.trim();

    // =============================
    // VERIFICAR CAMPOS
    // =============================
    if (codigo === "") {
        mensagem.textContent = "Digite o código da turma.";
        codigoTurma.focus();
        return;
    }

    if (senhaPin === "") {
        mensagem.textContent = "Digite o PIN da sala.";
        pin.focus();
        return;
    }

    // =============================
    // VALIDAÇÃO VIA FIREBASE (BACKEND)
    // =============================
    try {
        mensagem.textContent = "Verificando...";

        // Detecta se está testando localmente ou na Vercel
        const urlApi = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? 'http://localhost:3000/api/salas/entrar'
            : '/api/salas/entrar';

        const resposta = await fetch(urlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo: codigo,
                pin: senhaPin
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = "";

            // Guarda a turma validada para as próximas telas
            localStorage.setItem("codigoTurma", dados.codigo);

            // Redireciona para a tela do avatar na mesma pasta (Frontend/View)
            window.location.href = "avatar.html";
        } else {
            // Exibe a mensagem de erro retornada pelo backend
            mensagem.textContent = dados.mensagem || "Código ou PIN incorretos.";
        }
    } catch (erro) {
        console.error("Erro na conexão com o servidor:", erro);
        mensagem.textContent = "Erro ao se conectar ao servidor. Tente novamente.";
    }
});
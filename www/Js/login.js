// =====================================
// ESTOQUE ZERO - LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");
const mostrarSenha = document.getElementById("mostrarSenha");
const senhaInput = document.getElementById("senha");

// MOSTRAR / ESCONDER SENHA
mostrarSenha.addEventListener("click", () => {
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        mostrarSenha.textContent = "🙈";
    } else {
        senhaInput.type = "password";
        mostrarSenha.textContent = "👁";
    }
});

// AUTENTICAÇÃO COM FIREBASE (VIA EXPRESS)
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Login realizado !");
            
            // Salva o token da sessão
            localStorage.setItem("token", dados.token);
            
            // Redireciona para a rota da tela de boas-vindas
            window.location.href = "/Frontend/View/boas-vindas.html";
        } else {
            alert(dados.erro || "E-mail ou senha incorretos.");
        }

    } catch (erro) {
        console.error("Erro na requisição de login:", erro);
        alert("Erro ao conectar com o servidor. Tente novamente.");
    }
});


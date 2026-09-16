document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.getElementById("cadastroForm");

    if (!cadastroForm) return;

    cadastroForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        // Validações no Front-end
        if (!nome || !email || !senha || !confirmarSenha) {
            return alert("Preencha todos os campos.");
        }

        if (senha.length < 6) {
            return alert("A senha deve ter pelo menos 6 caracteres.");
        }

        if (senha !== confirmarSenha) {
            return alert("As senhas não coincidem.");
        }

        const foto = typeof fotoPerfilAtual !== 'undefined' ? fotoPerfilAtual : null;

        try {
            const resposta = await fetch('/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, senha, fotoPerfil: foto })
            });

            const data = await resposta.json();

            if (!resposta.ok) {
                throw new Error(data.erro || 'Erro ao realizar o cadastro');
            }

            // Salva dados no localStorage para uso local se necessário
            const usuarioDados = {
                uid: data.uid,
                nome: nome,
                email: email,
                fotoPerfil: foto
            };
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioDados));

            alert("Conta criada com sucesso!");
            
            // Redireciona para o login ou tela de boas-vindas
            window.location.href = '/Frontend/View/boas-vindas.html';

        } catch (error) {
            console.error('Erro na requisição de cadastro:', error);
            alert(error.message);
        }
    });
});
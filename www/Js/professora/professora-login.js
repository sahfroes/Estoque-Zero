const formulario =
    document.getElementById("formularioProfessora");

const codigoTurma =
    document.getElementById("codigoTurma");

const pinProfessora =
    document.getElementById("pinProfessora");

const mensagem =
    document.getElementById("mensagem");

const mostrarPin =
    document.getElementById("mostrarPin");


/* MOSTRAR / ESCONDER PIN */

mostrarPin.addEventListener("click", function () {

    if (pinProfessora.type === "password") {

        pinProfessora.type = "text";

        mostrarPin.textContent = "🙈";

    } else {

        pinProfessora.type = "password";

        mostrarPin.textContent = "👁";
    }

});


/* LOGIN */

formulario.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();

        const codigo =
            codigoTurma.value
                .trim()
                .toUpperCase();

        const pin =
            pinProfessora.value.trim();


        if (!codigo) {

            mensagem.textContent =
                "Digite o código da turma.";

            codigoTurma.focus();

            return;
        }


        if (!pin) {

            mensagem.textContent =
                "Digite o PIN da professora.";

            pinProfessora.focus();

            return;
        }


        try {

            mensagem.textContent =
                "Verificando acesso...";


            const resposta =
                await fetch(
                    "/api/professora/entrar",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            codigo: codigo,

                            pin: pin

                        })
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                mensagem.textContent =
                    dados.mensagem ||
                    "Código ou PIN incorretos.";

                return;
            }


            /*
             * Guardamos qual turma a professora
             * está visualizando.
             */

            localStorage.setItem(
                "codigoTurmaProfessora",
                dados.codigo
            );


            sessionStorage.setItem(
                "professoraAutorizada",
                "true"
            );


            window.location.href =
                "painel-professora.html";


        } catch (erro) {

            console.error(erro);

            mensagem.textContent =
                "Erro ao conectar com o servidor.";
        }

    }
);
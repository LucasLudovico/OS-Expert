document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formCadastro");

    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();

            const dadosFormulario = {
                nomeCliente: document.querySelector("#nome").value.trim(),
                placa: document.querySelector("#placa").value.trim(),
                modeloCarro: document.querySelector("#modelo").value.trim(),
                telefone: document.querySelector("#telefone").value.trim()
            };

            fetch("http://localhost:8080/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify(dadosFormulario)
            })
                .then(res => res.json())
                .then(resposta => {
                    alert("Sucesso: " + (resposta.status || "Cliente salvo!"));
                    sessionStorage.setItem("clienteSelecionado", JSON.stringify(dadosFormulario));
                    window.location.href = "../Atendente/home.html";
                })
                .catch(err => alert("Erro no fetch: " + err.message));
        });
    } else {
        console.error("Erro Crítico: O seletor #formCadastro não corresponde a nenhum ID no seu HTML.");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // Mapeia os elementos baseados estritamente nas classes e IDs do seu historico.html
    const campoInputPlaca = document.getElementById("inputPlaca");
    const botaoLupa = document.querySelector(".btn-search-icon");
    const containerHistorico = document.getElementById("listaHistorico");

    if (campoInputPlaca && botaoLupa) {
        // Escuta o clique na lupa
        botaoLupa.addEventListener("click", () => {
            ejecutarBuscaPlaca(campoInputPlaca.value, containerHistorico);
        });

        // Escuta o botão Enter dentro do input
        campoInputPlaca.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                ejecutarBuscaPlaca(campoInputPlaca.value, containerHistorico);
            }
        });
    }
});

function ejecutarBuscaPlaca(placa, container) {
    const placaLimpa = placa.trim();

    if (!placaLimpa) {
        alert("Digite uma placa válida para realizar a pesquisa.");
        return;
    }

    // Faz a chamada para o endpoint do Java
    fetch(`http://localhost:8080/buscar?placa=${placaLimpa}`)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao consultar o servidor backend.");
            return response.json();
        })
        .then(dadosDoJava => {
            // Limpa os cards de buscas anteriores para não acumular na tela
            container.innerHTML = "";

            // Se o veículo não tiver histórico ou o array vier vazio
            if (!dadosDoJava.historico || dadosDoJava.historico.length === 0) {
                alert("Nenhum histórico de manutenção encontrado para este veículo.");
                return;
            }

            // Varre o histórico que veio do Java e monta os cards na tela
            dadosDoJava.historico.forEach(item => {
                const card = document.createElement("div");
                card.className = "menu-card history-card"; // Mantém seus estilos do CSS
                card.style.marginTop = "12px";
                card.style.flexDirection = "column";
                card.style.alignItems = "flex-start";
                card.style.padding = "16px";
                card.style.background = "#ffffff"; // Garante visibilidade do fundo
                card.style.borderRadius = "8px";

                card.innerHTML = `
                     <span style="color: #8892b0; font-size: 13px; font-weight: 500; margin-bottom: 4px; display: block;">${item.data}</span>
                     <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #1e293b; font-weight: 600; line-height: 1.2;">${item.servico}</h2>
                     <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.2;">Mecânico: ${item.mecanico}</p>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error(error);
            alert("Veículo não encontrado ou erro na comunicação.");
        });
}
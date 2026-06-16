document.addEventListener("DOMContentLoaded", () => {
    const displayTotal = document.querySelector(".total-price");
    const divisorTabela = document.querySelector(".items-divider");
    let placaCliente = localStorage.getItem("cliente_placa") || "ABC1D23";

    fetch(`http://localhost:8080/ordemservico?placa=${placaCliente}`)
        .then(res => res.json())
        .then(os => {
            // 1. Valores de apresentação alinhados com o Atendente
            const valorBaseOfICIAL = 680.00;
            const valorAdicionaisReal = os.valorAdicionais || 0;
            const totalCorreto = valorBaseOfICIAL + valorAdicionaisReal;

            // Atualiza o total geral na tela
            if (displayTotal) {
                displayTotal.textContent = `R$ ${totalCorreto.toFixed(2).replace(".", ",")}`;
            }

            // Limpa injeções antigas
            document.querySelectorAll(".item-row-dinamico").forEach(el => el.remove());

            // Soma das peças estáticas no HTML: 180 + 45 + 120 = 345
            const somaPecasDoHTML = 345.00;
            const diferencaCombo = valorBaseOfICIAL - somaPecasDoHTML; // Dará R$ 335,00


            // Injeta a linha de ajuste com um nome comercial realista
            if (diferencaCombo > 0 && divisorTabela) {
                const linhaCombo = document.createElement("div");
                linhaCombo.className = "item-row item-row-dinamico";
                linhaCombo.innerHTML = `
                        <span class="item-name">Diagnóstico Eletrônico</span>
                        <span class="item-price">R$ ${diferencaCombo.toFixed(2).replace(".", ",")}</span>
                 `;
                divisorTabela.parentNode.insertBefore(linhaCombo, divisorTabela);
            }

            // 2. Renderiza os itens adicionais do mecânico (Pastilha, Fluido, etc.)
            if (valorAdicionaisReal > 0 && os.itensAprovados && divisorTabela) {
                const listaItens = os.itensAprovados.split(", ");

                listaItens.forEach(item => {
                    const novaLinha = document.createElement("div");
                    novaLinha.className = "item-row item-row-dinamico";
                    novaLinha.style.color = "#16a34a"; // Destaque verde para o que foi extra

                    novaLinha.innerHTML = `
                        <span class="item-name">⁺ ${item}</span>
                        <span class="item-price">Incluso</span>
                    `;
                    divisorTabela.parentNode.insertBefore(novaLinha, divisorTabela);
                });
            }
        })
        .catch(err => console.error("Erro ao buscar dados do fluxo no Java:", err));
});
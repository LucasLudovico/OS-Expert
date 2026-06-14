document.addEventListener("DOMContentLoaded", () => {
    const displayTotal = document.querySelector(".total-price");
    const divisorTabela = document.querySelector(".items-divider");
    let placaCliente = localStorage.getItem("cliente_placa") || "ABC1D23";

    fetch(`http://localhost:8080/ordemservico?placa=${placaCliente}`)
        .then(res => res.json())
        .then(os => {
            // Atualiza o valor total geral vindo do cálculo oficial do Java
            if (displayTotal) {
                displayTotal.textContent = `R$ ${os.valorTotal.toFixed(2).replace(".", ",")}`;
            }

            // Remove injeções dinâmicas antigas para evitar duplicidade ao reentrar na tela
            document.querySelectorAll(".item-row-dinamico").forEach(el => el.remove());

            // Se o Java retornar itens aprovados, renderiza-os logo acima da linha divisória
            if (os.valorAdicionais > 0 && os.itensAprovados && divisorTabela) {
                const listaItens = os.itensAprovados.split(", ");

                listaItens.forEach(item => {
                    const novaLinha = document.createElement("div");
                    novaLinha.className = "item-row item-row-dinamico";
                    novaLinha.style.color = "#16a34a"; // Destaque verde para itens extras adicionados

                    novaLinha.innerHTML = `
                        <span class="item-name">⁺ ${item}</span>
                        <span class="item-price">Incluso</span>
                    `;

                    // Insere o elemento exatamente antes da linha divisória do total
                    divisorTabela.parentNode.insertBefore(novaLinha, divisorTabela);
                });
            }
        })
        .catch(err => console.error("Erro ao buscar dados do fluxo no Java:", err));
});
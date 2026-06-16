document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.withdrawal-list');
    if (container) {
        container.addEventListener('click', async (event) => {
            // Delegação de eventos para capturar cliques nos botões de baixa
            if (event.target.classList.contains('btn-action-withdraw')) {
                await processarBaixaFisica(event.target);
            }
        });
    }
});

async function processarBaixaFisica(button) {
    const pecaId = button.getAttribute('data-peca-id');
    const row = button.closest('.withdrawal-item-row');
    const statusLabel = row.querySelector('.status-label');

    // Estado visual temporário de processamento
    button.textContent = "⚙ PROCESSANDO...";
    button.disabled = true;

    try {
        const response = await fetch('http://localhost:8080/mecanico/estoque', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pecaId: parseInt(pecaId)})
        });

        if (!response.ok) throw new Error('Recusa do servidor');

        const dados = await response.json();
        console.log("Baixa confirmada no Java. Novo saldo da peça:", dados.novaQuantidade);

        // Aplica o design de sucesso definitivo
        button.textContent = "✔ RETIRADO";
        button.style.backgroundColor = "#16a34a";
        button.style.cursor = "not-allowed";

        if (statusLabel) {
            statusLabel.textContent = "Status: Retirado para instalação";
            statusLabel.style.color = "#475569";
        }
    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        alert("Erro ao sincronizar baixa com o servidor. Operação revertida.");

        // Reverte para o estado original caso falhe
        button.textContent = "Dar Baixa";
        button.style.backgroundColor = "#ff7315";
        button.disabled = false;
    }
}
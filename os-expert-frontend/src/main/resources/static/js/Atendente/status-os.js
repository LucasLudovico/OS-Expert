document.addEventListener('DOMContentLoaded', () => {
    sincronizarStatusAtendente();
    // Atualiza a tabela a cada 5 segundos para monitorar o mecânico
    setInterval(sincronizarStatusAtendente, 5000);
});

async function sincronizarStatusAtendente() {
    try {
        const response = await fetch('http://localhost:8080/ordemservico?placa=ABC-1234');
        if (!response.ok) return;

        const dadosOs = await response.json();

        // Localiza todas as linhas da tabela
        const linhas = document.querySelectorAll('#tabelaStatus tbody tr');

        linhas.forEach(linha => {
            const colunaPlaca = linha.cells[1];
            if (colunaPlaca && colunaPlaca.textContent === "ABC-1234") {
                const colunaStatus = linha.cells[2];

                // Mapeia o status cru do Java para termos legíveis do atendente
                if (dadosOs.status === "EM_REVISAO" || dadosOs.status === "FINALIZADA") {
                    colunaStatus.innerHTML = `<span style="color:#16a34a; font-weight:bold;">Finalizada</span>`;
                } else if (dadosOs.status === "AGUARDANDO_APROVACAO") {
                    colunaStatus.innerHTML = `<span style="color:#eab308; font-weight:bold;">Aberta</span>`;
                } else {
                    colunaStatus.innerHTML = `<span style="color:#2563eb; font-weight:bold;">Em Andamento</span>`;
                }
            }
        });
    } catch (error) {
        console.error("Erro ao sincronizar painel do atendente:", error);
    }
}
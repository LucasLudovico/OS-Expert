document.addEventListener("DOMContentLoaded", async () => {
    const placa = localStorage.getItem('cliente_placa') || "ABC-1234";
    const nome = localStorage.getItem('cliente_nome') || "Cliente";
    const carro = localStorage.getItem('cliente_carro') || "Veículo";

    const txtGreeting = document.querySelector('.client-greeting');
    const txtVehicleTitleBold = document.querySelector('.vehicle-title-bold');

    if (txtGreeting) txtGreeting.innerText = `Olá, ${nome}! Seu veículo é o`;
    if (txtVehicleTitleBold) txtVehicleTitleBold.innerText = `${carro} (${placa})`;

    // INTEGRANDO A TIMELINE COM O BACKEND
    try {
        const response = await fetch(`http://localhost:8080/ordemservico?placa=${placa}`);
        if (response.ok) {
            const dados = await response.json();

            if (dados.status === "EM_REVISAO" || dados.status === "FINALIZADA") {
                const itensTimeline = document.querySelectorAll('.timeline-item');

                // Altera o Badge do Card Superior
                const badge = document.querySelector('.badge-wrapper span');
                if (badge) {
                    badge.textContent = "FINALIZADO";
                    badge.className = "badge-status-green"; // Altera cor para verde via CSS alternativo
                    badge.style.backgroundColor = "#166534";
                }

                // Move o progresso visual do Figma:
                // Passo 2 (index 2): Execução Técnica -> Concluído
                if (itensTimeline[2]) {
                    itensTimeline[2].classList.remove('step-active');
                    itensTimeline[2].classList.add('step-completed');
                }
                // Passo 3 (index 3): Teste de Rodagem & Limpeza -> Ativo/Pronto
                if (itensTimeline[3]) {
                    itensTimeline[3].classList.remove('step-pending');
                    itensTimeline[3].classList.add('step-active');
                    itensTimeline[3].querySelector('p').textContent = "Serviço concluído com sucesso!";
                }
            }
        }
    } catch (e) {
        console.error("Erro ao atualizar a linha do tempo:", e);
    }
});
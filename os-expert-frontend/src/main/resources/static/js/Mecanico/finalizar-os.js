let segundosTotais = (1 * 3600) + (45 * 60); // Inicia cravado em 01:45:00
let relogioInterval;
let estaPausado = false;

document.addEventListener('DOMContentLoaded', () => {
    const txtTimer = document.getElementById('totalTimer');
    const btnPausar = document.getElementById('btnPauseService');
    const btnEnviar = document.getElementById('btnSubmitReview');

    // 1. Inicia o Cronômetro Progressivo
    definirCronometro(txtTimer);

    // 2. Lógica do Botão Pausar / Retomar
    if (btnPausar) {
        btnPausar.addEventListener('click', () => {
            estaPausado = !estaPausado;
            if (estaPausado) {
                btnPausar.textContent = "RETOMAR SERVIÇO";
                btnPausar.style.backgroundColor = "#b91c1c"; // Muda para vermelho indicando pausa
                btnPausar.style.color = "#FFFFFF";
            } else {
                btnPausar.textContent = "PAUSAR SERVIÇO";
                btnPausar.style.backgroundColor = "#e2e8f0";
                btnPausar.style.color = "#1e293b";
            }
        });
    }

    // 3. Envio definitivo para o Backend
    if (btnEnviar) {
        btnEnviar.addEventListener('click', async () => {
            const notas = document.getElementById('techNotes').value.trim();
            const tempoFinal = txtTimer.textContent;

            if (!notas) {
                alert("Por favor, relate o laudo técnico antes de finalizar.");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/ordemservico', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify({
                        acao: "finalizarMecanico",
                        observacoes: notas,
                        tempoTotal: tempoFinal
                    })
                });

                if (response.ok) {
                    clearInterval(relogioInterval);
                    localStorage.setItem('os_1024_status', 'finalizado');
                    alert("Serviço finalizado! Ordem de serviço atualizada para FINALIZADA.");
                    window.location.href = 'tarefas.html?status=finalizado';
                }
            } catch (err) {
                console.error("Erro na comunicação:", err);
            }
        });
    }
});

function definirCronometro(elementoHtml) {
    relogioInterval = setInterval(() => {
        if (!estaPausado) {
            segundosTotais++;

            // Conversão matemática para formato HH:MM:SS
            let hrs = Math.floor(segundosTotais / 3600);
            let mins = Math.floor((segundosTotais % 3600) / 60);
            let secs = segundosTotais % 60;

            let hrsStr = hrs < 10 ? "0" + hrs : hrs;
            let minsStr = mins < 10 ? "0" + mins : mins;
            let secsStr = secs < 10 ? "0" + secs : secs;

            elementoHtml.textContent = `${hrsStr}:${minsStr}:${secsStr}`;
        }
    }, 1000);
}
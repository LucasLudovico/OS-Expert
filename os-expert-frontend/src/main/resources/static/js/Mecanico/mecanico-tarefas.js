document.addEventListener('DOMContentLoaded', () => {
    // Captura o botão de início de checklist da OS ativa
    const btnChecklist = document.querySelector('.btn-task-action');

    // 1. LER OS PARÂMETROS DA URL
    const urlParams = new URLSearchParams(window.location.search);
    const statusDaURL = urlParams.get('status');

    // 1. VERIFICA SE A OS JÁ FOI FINALIZADA
    if (statusDaURL === 'finalizado') {

        // Atualiza o texto e a cor do badge de diagnóstico
        const badgeStatus = document.querySelector('.badge-status') || document.querySelector('[class*="badge"]');
        if (badgeStatus) {
            badgeStatus.textContent = 'FINALIZADO';
            badgeStatus.style.backgroundColor = '#16a34a';
            badgeStatus.style.color = '#ffffff';
        }

        // Desabilita o botão
        if (btnChecklist) {
            btnChecklist.textContent = 'CONCLUÍDO';
            btnChecklist.disabled = true;
            btnChecklist.classList.add('btn-disabled');
        }

        return; // Para a execução aqui e impede o clique de redirecionar novamente
    }

    // 2. COMPORTAMENTO PADRÃO (SE NÃO ESTIVER FINALIZADA)
    if (btnChecklist) {
        btnChecklist.addEventListener('click', () => {
            // Mapeia o ID da OS #1024 e redireciona para a conclusão
            const osId = 1024;
            window.location.href = `finalizar-os.html?os=${osId}`;
        });
    }
});
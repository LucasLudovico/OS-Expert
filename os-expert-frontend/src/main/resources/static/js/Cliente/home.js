document.addEventListener('DOMContentLoaded', async () => { // 1. Transformado em async para permitir o fetch
    // Recupera os dados do localStorage vindos do Java
    const nome = localStorage.getItem('cliente_nome') || "Cliente";
    const carro = localStorage.getItem('cliente_carro') || "Veículo";
    const placa = localStorage.getItem('cliente_placa') || "ABC-1234";

    // Localiza os elementos pelas classes originais do HTML
    const txtSubtitle = document.querySelector('.brand-subtitle');
    const txtVehicleInfo = document.querySelector('.vehicle-info');
    const badgeStatus = document.querySelector('.badge-status'); // Mapeia o badge de status do veículo

    // Injeta o nome no cabeçalho
    if (txtSubtitle) {
        txtSubtitle.innerText = `Olá, ${nome} | Portal de Acompanhamento`;
    }

    // Monta dinamicamente a string "Carro (Placa)"
    if (txtVehicleInfo) {
        txtVehicleInfo.innerText = `${carro} (${placa})`;
    }

    // INTEGRANDO A HOME COM O BACKEND
    try {
        const response = await fetch(`http://localhost:8080/ordemservico?placa=${placa}`);
        if (response.ok) {
            const dados = await response.json();

            // Se o status no Java for EM_REVISAO ou FINALIZADA, atualiza a variável local
            if (dados.status === "EM_REVISAO" || dados.status === "FINALIZADA") {
                statusOS = "finalizado";
            } else if (dados.status === "PAGO" || dados.status === "ENTREGUE") {
                statusOS = "pago";
            }
        }
    } catch (e) {
        console.error("Erro ao buscar status em tempo real na Home:", e);
    }

    // Controle total via URL
    const urlParams = new URLSearchParams(window.location.search);
    const estaPago = urlParams.get('pago');
    const statusUrl = urlParams.get('status'); // Permite alternar o status também via URL (?status=finalizado)

    if (estaPago === 'true') {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (estaPago === 'true' || statusOS === 'pago' || statusOS === 'entregue') {
        // Se veio da tela de pagamento (?pago=true), força o estado finalizado escuro
        if (badgeStatus) {
            badgeStatus.innerText = "PAGO / ENTREGUE";
            badgeStatus.style.backgroundColor = "#1e293b";
            badgeStatus.style.color = "#FFFFFF";
        }
        console.log("Modo Demo: Exibindo PAGO / ENTREGUE");
    } else if (statusUrl === 'finalizado' || statusOS === 'finalizado' || statusOS === 'FINALIZADO') {
        // SE O MECÂNICO FINALIZOU: Altera o badge para verde combinando com a tela de status atual
        if (badgeStatus) {
            badgeStatus.innerText = "FINALIZADO";
            badgeStatus.style.backgroundColor = "#D1FAE5"; // Verde claro
            badgeStatus.style.color = "#065F46";
        }
        console.log("Modo Demo: Exibindo FINALIZADO");
    } else {
        // SE A URL ESTIVER LIMPA (F5 ou clique no menu): Força o estado inicial de manutenção
        if (badgeStatus) {
            badgeStatus.innerText = "EM MANUTENÇÃO";
            badgeStatus.style.backgroundColor = "";
            badgeStatus.style.color = "";
        }
        console.log("Modo Demo: Tela resetada para o estado inicial.");
    }

    console.log("Layout atualizado dinamicamente via classes:", {nome, carro, placa, statusOS});
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Recupera os dados do localStorage vindos do Java
    const nome = localStorage.getItem('cliente_nome') || "Cliente";
    const carro = localStorage.getItem('cliente_carro') || "Veículo";
    const placa = localStorage.getItem('cliente_placa') || "ABC-1234";

    // 2. Localiza os elementos pelas classes originais do seu HTML
    const txtSubtitle = document.querySelector('.brand-subtitle');
    const txtVehicleInfo = document.querySelector('.vehicle-info');

    // 3. Injeta o nome no cabeçalho de forma elegante
    if (txtSubtitle) {
        txtSubtitle.innerText = `Olá, ${nome} | Portal de Acompanhamento`;
    }

    // 4. Monta dinamicamente a string "Carro (Placa)" exatamente como no seu protótipo
    if (txtVehicleInfo) {
        txtVehicleInfo.innerText = `${carro} (${placa})`;
    }

    console.log("Layout atualizado dinamicamente via classes:", {nome, carro, placa});
});
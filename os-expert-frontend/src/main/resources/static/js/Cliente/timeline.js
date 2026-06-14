document.addEventListener("DOMContentLoaded", () => {
    // 1. Recupera os dados oficiais do cliente vindos do Java (LocalStorage)
    const placa = localStorage.getItem('cliente_placa');
    const nome = localStorage.getItem('cliente_nome') || "Cliente";
    const carro = localStorage.getItem('cliente_carro') || "Veículo";

    // Trava de Segurança: Se não houver dados de login, joga para o login
    if (!placa) {
        window.location.href = "../login.html";
        return;
    }

    // 2. Mapeia as classes específicas do card do seu status-atual.html
    const txtGreeting = document.querySelector('.client-greeting');
    const txtVehicleTitleBold = document.querySelector('.vehicle-title-bold');

    // 3. Substitui os textos estáticos ("João" e "Civic") pelos dados reais
    if (txtGreeting) {
        txtGreeting.innerText = `Olá, ${nome}! Seu veículo é o`;
    }

    if (txtVehicleTitleBold) {
        txtVehicleTitleBold.innerText = `${carro} (${placa})`;
    }
});
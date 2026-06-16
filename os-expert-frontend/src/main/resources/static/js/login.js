const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const valorDigitado = emailInput.value.trim();
    const senhaDigitada = senhaInput.value;

    // Fluxo cliente, se nao tiver um '@', identifica que e uma placa.
    if (!valorDigitado.includes('@')) {
        const placaCliente = valorDigitado.toUpperCase();

        try {
            // 1. Consulta o ClienteController no Java para ver se a placa existe
            const responseCliente = await fetch(`http://localhost:8080/clientes?placa=${placaCliente}`);

            if (responseCliente.ok) {
                const dadosCliente = await responseCliente.json();

                // 2. Guarda os dados do carro e cliente retornados do Java no localStorage
                localStorage.setItem('cliente_placa', dadosCliente.placa);
                localStorage.setItem('cliente_nome', dadosCliente.nomeCliente);
                localStorage.setItem('cliente_carro', dadosCliente.modeloCarro);

                // 3. Cria o objeto mock com a senha padrão de 1234 e o cargo CLIENTE
                const usuarioClienteMock = {
                    id: 999,
                    nome: dadosCliente.nomeCliente,
                    email: `${placaCliente}@osexpert.com`,
                    cargo: "CLIENTE"
                };

                // 4. Salva na sessão e redireciona
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioClienteMock));
                alert(`Bem-vindo(a), ${dadosCliente.nomeCliente}! Carregando dados do veículo...`);

                window.location.href = "Cliente/home.html";
                return;
            } else {
                alert('Nenhum veículo com esta placa foi encontrado no sistema do backend!');
                return;
            }
        } catch (error) {
            console.error("Erro ao buscar dados no ClienteController:", error);
            alert("Erro ao conectar com o servidor para validar a placa.");
            return;
        }
    }

    // Se tiver '@', e atendente, mecanico ou gestor
    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: valorDigitado, senha: senhaDigitada})
        });

        if (!response.ok) {
            alert('E-mail corporativo ou senha inválidos! Tente novamente.');
            return;
        }

        // Se o Java validou o funcionário mockado do LoginController
        const usuarioLogado = await response.json();

        // Salva na sessão do navegador
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        alert(`Bem-vindo(a), ${usuarioLogado.nome}! Redirecionando para o painel...`);

        if (usuarioLogado.cargo === "MECANICO") {
            window.location.href = "Mecanico/home.html";
        } else if (usuarioLogado.cargo === "GESTOR") {
            window.location.href = "Gestor/home.html";
        } else if (usuarioLogado.cargo === "ATENDENTE") {
            window.location.href = "Atendente/home.html";
        } else if (usuarioLogado.cargo === "CLIENTE") {
            window.location.href = "Cliente/home.html";
        } else {
            window.location.href = "Atendente/home.html";
        }

    } catch (error) {
        console.error("Erro na comunicação com o LoginController:", error);
        alert("Erro ao conectar com o servidor da oficina. Certifique-se de que o backend Java está rodando.");
    }
});
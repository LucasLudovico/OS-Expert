// 1. Mapeia os elementos do HTML que vamos interagir
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');

// 2. Escuta o evento de "submissão" (envio) do formulário
loginForm.addEventListener('submit', function (event) {
    // Evita o comportamento padrão do HTML de recarregar a página
    event.preventDefault();

    // Captura os valores digitados pelo usuário
    const emailDigitado = emailInput.value.trim();
    const senhaDigitada = senhaInput.value;

    // 3. Busca o usuário dentro da nossa lista mockada (do arquivo database-mock.js)
    // Usamos uma verificação simples simulando o e-mail corporativo
    const usuarioEncontrado = mockUsuarios.find(user => user.email.toLowerCase() === emailDigitado.toLowerCase());

    // 4. Regra de validação (Simulando o comportamento de login seguro)
    // No mock, vamos aceitar qualquer senha padrão com mais de 4 caracteres para fins de teste
    if (usuarioEncontrado && senhaDigitada=== "1234") {

        // Guarda as informações do usuário logado na memória temporária do navegador (SessionStorage)
        // Isso é ótimo para sabermos se quem logou foi o Lucas (Gestor), a Dryele (Atendente) ou o Gustavo (Mecânico)
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

        alert(`Bem-vindo(a), ${usuarioEncontrado.nome}! Redirecionando para o painel...`);

        // Próximo passo quando tivermos as outras telas prontas:
        window.location.href = 'home.html';

    } else {
        // Mensagem de erro caso o e-mail não exista na nossa lista mockada
        alert('E-mail corporativo ou senha inválidos! Tente novamente.');
    }
});
document.addEventListener("DOMContentLoaded", () => {

    // Listas locais de estado da tela (alimentadas pelo Java)
    let clientes = [];
    let servicos = [];
    let mecanicos = [];

    // Mapeamento dos elementos do DOM
    const selectCliente = document.getElementById("clienteSelect");
    const selectServico = document.getElementById("servicoSelect");
    const selectMecanico = document.getElementById("mecanicoSelect");

    // Carregar clientes do java
    fetch("http://localhost:8080/clientes")
        .then(response => response.json())
        .then(dados => {
            clientes = dados; // Armazena a lista oficial vinda do Java

            // Reseta o select mantendo apenas a opção padrão
            selectCliente.innerHTML = '<option value="">Escolha um cliente</option>';

            clientes.forEach((cliente, index) => {
                const option = document.createElement("option");
                option.value = index; // Armazena o índice do array para resgatar no evento change
                option.textContent = `${cliente.nomeCliente} - ${cliente.placa}`;
                selectCliente.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar clientes do Java:", error));

    // Carregar servicos do java
    fetch("http://localhost:8080/servicos")
        .then(response => response.json())
        .then(dados => {
            servicos = dados;

            selectServico.innerHTML = '<option value="">Escolha um serviço</option>';
            dados.forEach(servico => {
                const option = document.createElement("option");
                option.value = servico.id;

                // Mudado de 'servico.valorBase' para 'servico.valor' que é o que vem do seu Java
                const preco = servico.valor ? servico.valor.toFixed(2) : "0.00";
                option.textContent = `${servico.descricao} - R$ ${preco}`;

                selectServico.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar serviços:", error);
        });

    // Carregar mecanicos do java
    fetch("http://localhost:8080/mecanicos")
        .then(response => response.json())
        .then(dados => {
            mecanicos = dados;

            selectMecanico.innerHTML = '<option value="">Escolha um mecânico</option>';
            dados.forEach(mecanico => {
                const option = document.createElement("option");
                option.value = mecanico.id;
                option.textContent = mecanico.nome;
                selectMecanico.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar mecânicos:", error));

    // Selecao do Cliente
    selectCliente.addEventListener("change", () => {
        const cliente = clientes[selectCliente.value];

        if (!cliente) {
            // Limpa as labels se o atendente selecionar a opção padrão de volta
            document.getElementById("clienteInfo").textContent = "-";
            document.getElementById("veiculoInfo").textContent = "-";
            document.getElementById("placaInfo").textContent = "-";
            document.getElementById("telefoneInfo").textContent = "-";
            return;
        }

        // Alimenta as labels com as chaves exatas mapeadas do Java
        document.getElementById("clienteInfo").textContent = cliente.nomeCliente;
        document.getElementById("veiculoInfo").textContent = cliente.modeloCarro;
        document.getElementById("placaInfo").textContent = cliente.placa;
        document.getElementById("telefoneInfo").textContent = cliente.telefone;

        // Salva na sessão o bloco limpo para o html2pdf.js
        sessionStorage.setItem("clienteOS", JSON.stringify(cliente));
    });

    // --- 5. LÓGICA DE CÁLCULO DINÂMICO DE TOTAL ---
    function atualizarTotal() {
        const servico = servicos.find(s => s.id == selectServico.value);
        const mecanico = mecanicos.find(m => m.id == selectMecanico.value);

        // Se algum dos dois não estiver selecionado, zera o total na tela
        if (!servico || !mecanico) {
            document.getElementById("totalOS").textContent = "R$ 0,00";
            return;
        }

        // Pega o valor do serviço (lê 'valor' que vem do formato String do controller)
        const precoServico = servico.valor || 0;

        // CHECAGEM DUPLA: Tenta ler 'taxaServico' ou 'taxa' para garantir o mapeamento do Jackson/Gson
        const taxaMecanico = mecanico.taxaServico !== undefined ? mecanico.taxaServico : (mecanico.taxa || 0);

        // Realiza a soma matemática correta dos dois valores base do Java
        const total = precoServico + taxaMecanico;

        // Atualiza a label na tela com duas casas decimais
        document.getElementById("totalOS").textContent = `R$ ${total.toFixed(2)}`;
    }

    selectServico.addEventListener("change", atualizarTotal);
    selectMecanico.addEventListener("change", atualizarTotal);

    // --- 6. GATILHO DE SALVAMENTO DA OS + GERAÇÃO DO PDF ---
    window.gerarOrcamento = async function () {
        const cliente = JSON.parse(sessionStorage.getItem("clienteOS"));
        const servicoSelecionado = servicos.find(s => s.id == selectServico.value);
        const mecanicoSelecionado = mecanicos.find(m => m.id == selectMecanico.value);

        if (!cliente || !servicoSelecionado || !mecanicoSelecionado) {
            alert("Por favor, preencha todos os seletores antes de gerar o orçamento.");
            return;
        }

        const dataHoje = new Date().toLocaleDateString('pt-BR');
        const precoServico = servicoSelecionado.valor || 0;
        const taxaMecanico = mecanicoSelecionado.taxaServico !== undefined ? mecanicoSelecionado.taxaServico : (mecanicoSelecionado.taxa || 0);
        const totalGeral = precoServico + taxaMecanico;

        // 1. GERAR A ORDEM NO SERVIDOR JAVA
        const payload = {
            placa: cliente.placa,
            mecanicoId: Number(mecanicoSelecionado.id),
            servicoId: Number(servicoSelecionado.id)
        };

        try {
            await fetch("http://localhost:8080/ordemservico", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            console.log("OS sincronizada com o Java.");
        } catch (error) {
            console.error("Erro ao registrar OS:", error);
        }

        // 2. CRIAR O TEMPLATE DO PDF EM MEMÓRIA (VIRTUAL)
        const containerVirtual = document.createElement("div");

        // Injeta o seu HTML de orçamento com estilos inline perfeitamente configurados
        containerVirtual.innerHTML = `
        <div style="width: 170mm; padding: 10mm; font-family: Arial, sans-serif; background-color: white; color: black;">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px;">
                <div>
                    <h1 style="margin: 0; color: #ff6b00;">OsExpert</h1>
                    <p style="margin: 5px 0;">Oficina Mecânica Especializada</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin: 0;">ORÇAMENTO</h2>
                    <p style="margin: 5px 0;">Data: ${dataHoje}</p>
                </div>
            </div>

            <div style="margin: 20px 0; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0;">Dados do Cliente / Veículo</h3>
                <p style="margin: 5px 0;"><strong>Nome:</strong> ${cliente.nomeCliente}</p>
                <p style="margin: 5px 0;"><strong>Placa:</strong> ${cliente.placa} | <strong>Modelo:</strong> ${cliente.modeloCarro}</p>
                <p style="margin: 5px 0;"><strong>Telefone:</strong> ${cliente.telefone}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background: #333; color: #fff; text-align: left;">
                        <th style="padding: 10px;">Descrição</th>
                        <th style="padding: 10px; text-align: right;">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Serviço: ${servicoSelecionado.descricao}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">R$ ${precoServico.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Mão de Obra: Execução por ${mecanicoSelecionado.nome}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">R$ ${taxaMecanico.toFixed(2)}</td>
                    </tr>
                    <tr style="font-weight: bold; background: #f5f5f5;">
                        <td style="padding: 10px;">TOTAL</td>
                        <td style="padding: 10px; text-align: right; color: #2e7d32;">R$ ${totalGeral.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

        // 3. CONFIGURAR E FAZER O DOWNLOAD DO PDF
        const opcoesPdf = {
            margin: 10,
            filename: `Orcamento_${cliente.placa}.pdf`,
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2, useCORS: true},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
        };

        // Passamos o container criado dinamicamente direto para a biblioteca
        html2pdf()
            .set(opcoesPdf)
            .from(containerVirtual)
            .save()
            .then(() => {
                alert("Orçamento gerado e baixado com sucesso!");
            })
            .catch(err => {
                console.error("Erro ao gerar PDF:", err);
            });
    };
});
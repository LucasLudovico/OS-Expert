document.addEventListener("DOMContentLoaded", () => {
    const displayValor = document.querySelector(".value-amount");
    const btnSalvarComprovante = document.querySelector(".btn-save-receipt");
    let placaCliente = localStorage.getItem("cliente_placa") || "ABC1D23";
    let osCache = null;

    // Busca o valor final consolidado direto do Java
    fetch(`http://localhost:8080/ordemservico?placa=${placaCliente}`)
        .then(res => res.json())
        .then(os => {
            osCache = os;
            if (displayValor) {
                displayValor.textContent = `R$ ${os.valorTotal.toFixed(2).replace(".", ",")}`;
            }
        })
        .catch(err => console.error("Erro ao carregar dados do pagamento:", err));

    // Monitora o gatilho de geração do arquivo PDF
    if (btnSalvarComprovante) {
        btnSalvarComprovante.addEventListener("click", () => {
            if (!osCache) {
                alert("Dados da ordem de serviço ainda não carregados do servidor.");
                return;
            }

            const dataHoje = new Date().toLocaleDateString('pt-BR');
            const horaHoje = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
            const hashValidacao = Math.random().toString(36).substring(2, 14).toUpperCase();

            // Sinaliza a liquidação do pagamento ao backend
            fetch("http://localhost:8080/ordemservico", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({placa: placaCliente, acao: "pagar"})
            });

            // Estrutura o HTML virtual do recibo para compilação do html2pdf
            const containerVirtual = document.createElement("div");
            containerVirtual.innerHTML = `
                <div style="width: 165mm; padding: 12mm; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333;">
                    <div style="text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 15px; margin-bottom: 20px;">
                        <h1 style="margin: 0; color: #2563eb; font-size: 26px;">OsExpert</h1>
                        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Comprovante de Pagamento de Serviços</p>
                    </div>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
                        <span style="font-size: 11px; font-weight: bold; color: #64748b;">VALOR LIQUIDADO VIA PIX</span>
                        <h2 style="margin: 6px 0 0 0; font-size: 32px; color: #16a34a; font-weight: bold;">R$ ${osCache.valorTotal.toFixed(2).replace(".", ",")}</h2>
                    </div>

                    <div style="margin-bottom: 25px; font-size: 14px; line-height: 1.6;">
                        <h3 style="font-size: 12px; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">RESUMO DOS PRODUTOS</h3>
                        <p style="margin: 4px 0;"><strong>Número da OS:</strong> #${osCache.numeroOS}</p>
                        <p style="margin: 4px 0;"><strong>Veículo (Placa):</strong> ${osCache.placa}</p>
                        <p style="margin: 4px 0;"><strong>Revisão de Fábrica:</strong> R$ ${osCache.valorBase.toFixed(2).replace(".", ",")}</p>
                        <p style="margin: 4px 0;"><strong>Adicionais Contratados:</strong> ${osCache.itensAprovados || "Nenhum item adicional selecionado."}</p>
                    </div>

                    <div style="margin-bottom: 25px; font-size: 14px; line-height: 1.6;">
                        <h3 style="font-size: 12px; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">DADOS DE CONTROLE</h3>
                        <p style="margin: 4px 0;"><strong>Data de Emissão:</strong> ${dataHoje} às ${horaHoje}</p>
                        <p style="margin: 4px 0;"><strong>Código Autenticador PIX:</strong> <span style="font-family: monospace; color: #2563eb; font-weight: bold;">${hashValidacao}</span></p>
                    </div>

                    <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Obrigado por utilizar os serviços automotivos OsExpert!</p>
                    </div>
                </div>
            `;

            const configuracoesPDF = {
                margin: 12,
                filename: `Recibo_OsExpert_OS_${osCache.numeroOS}.pdf`,
                image: {type: 'jpeg', quality: 0.98},
                html2canvas: {scale: 2, useCORS: true},
                jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
            };

            // Dispara a compilação do arquivo para download
            html2pdf().set(configuracoesPDF).from(containerVirtual).save()
                .then(() => alert("Comprovante gerado e baixado com sucesso!"))
                .catch(err => console.error("Falha ao compilar pdf:", err));
        });
    }
});
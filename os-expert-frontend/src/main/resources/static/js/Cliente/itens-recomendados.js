document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".rec-checkbox");
    const lblSelecionados = document.querySelector(".breakdown-value.text-green");
    const lblTotalGeral = document.querySelector(".breakdown-value-bold.text-blue");
    const btnConfirmar = document.querySelector(".btn-confirm-extra");
    const btnManterBase = document.querySelector(".btn-keep-base");

    const VALOR_BASE = 680.00;
    let placaCliente = localStorage.getItem("cliente_placa") || "ABC1D23";

    // Função para minerar os valores da tela e recalcular os totais
    function recalcularInterface() {
        let somaExtras = 0;

        checkboxes.forEach(box => {
            if (box.checked) {
                // Sobe até o container da linha para achar o preço correspondente
                const linha = box.closest(".rec-item-row");
                if (linha) {
                    const textoPreco = linha.querySelector(".rec-item-price").textContent;
                    // Remove "+ R$", espaços e troca a vírgula por ponto
                    const valorLimpo = parseFloat(textoPreco.replace("+ R$", "").replace(",", ".").trim());
                    somaExtras += valorLimpo;
                }
            }
        });

        // [COMPLEMENTO SEGURO] Atualiza o valor da linha da Revisão Base no HTML se ele existir
        const lblBasePainel = document.querySelector(".revisao-base-valor") || document.querySelector(".breakdown-value:not(.text-green)");
        if (lblBasePainel) {
            lblBasePainel.textContent = `R$ ${VALOR_BASE.toFixed(2).replace(".", ",")}`;
        }

        // Atualiza os campos de texto inferiores formatando de volta para Real (R$)
        if (lblSelecionados) {
            lblSelecionados.textContent = `+ R$ ${somaExtras.toFixed(2).replace(".", ",")}`;
        }
        if (lblTotalGeral) {
            lblTotalGeral.textContent = `R$ ${(VALOR_BASE + somaExtras).toFixed(2).replace(".", ",")}`;
        }
    }

    // Escuta cliques em qualquer um dos checkboxes
    checkboxes.forEach(box => box.addEventListener("change", recalcularInterface));

    // Ação: Confirmar Adicionais
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", () => {
            let valorExtras = 0;
            let nomesItens = [];

            checkboxes.forEach(box => {
                if (box.checked) {
                    const linha = box.closest(".rec-item-row");
                    if (linha) {
                        const nome = linha.querySelector(".rec-item-name").textContent.trim();
                        const textoPreco = linha.querySelector(".rec-item-price").textContent;
                        const valor = parseFloat(textoPreco.replace("+ R$", "").replace(",", ".").trim());

                        valorExtras += valor;
                        nomesItens.push(nome);
                    }
                }
            });

            const payload = {
                placa: placaCliente,
                adicionaisAprovados: true,
                aprovou: true,
                valorExtras: valorExtras,
                nomesItens: nomesItens.join(", ")
            };

            fetch("http://localhost:8080/ordemservico", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(dados => {
                    alert("Adicionais sincronizados e salvos com sucesso!");
                    window.location.href = "resumo-servico.html";
                })
                .catch(err => {
                    console.error("Erro ao salvar no Java:", err);
                    alert("Erro ao conectar com o servidor Java.");
                });
        });
    }

    // Ação: Manter Revisão Base
    if (btnManterBase) {
        btnManterBase.addEventListener("click", () => {
            const payload = {
                placa: placaCliente,
                adicionaisAprovados: true,
                aprovou: false,
                valorExtras: 0.0,
                nomesItens: ""
            };

            fetch("http://localhost:8080/ordemservico", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            })
                .then(() => {
                    alert("Mantendo apenas a revisão base original.");
                    window.location.href = "resumo-servico.html";
                });
        });
    }

    // Inicializa calculando o estado inicial (Item 1 marcado por padrão no seu HTML)
    recalcularInterface();
});
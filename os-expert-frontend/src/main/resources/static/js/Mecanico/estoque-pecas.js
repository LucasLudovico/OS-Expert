// Variáveis de estado do filtro do front-end
let filtroTexto = '';
let filtroCategoria = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('inventorySearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filtroTexto = e.target.value.toLowerCase();
            aplicarFiltrosCombinados();
        });
    }

    // Gerencia o clique nas Tags de Filtro
    const pills = document.querySelectorAll('.tag-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            // Remove classe ativa dos outros botões e adiciona no atual
            pills.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');

            filtroCategoria = e.target.getAttribute('data-filter');
            aplicarFiltrosCombinados();
        });
    });

    carregarEstoqueDoServidor();
});

async function carregarEstoqueDoServidor() {
    const container = document.querySelector('.inventory-list');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:8080/mecanico/estoque');
        if (!response.ok) throw new Error('Erro na requisição');

        const pecas = await response.json();
        container.innerHTML = '';

        pecas.forEach(peca => {
            // Define dinamicamente se o estoque é crítico (ex: menor ou igual a 2 un)
            const eCritico = peca.quantidade <= 2;
            const itemClass = eCritico ? 'text-red' : 'text-green';

            const itemHtml = `
                <div class="inventory-item" 
                     data-item-id="${peca.id}" 
                     data-nome="${peca.nome.toLowerCase()}"
                     data-critico="${eCritico}">
                    <div class="inventory-info">
                        <h4>${peca.nome}</h4>
                        <p>Compatibilidade: ${peca.compatibilidade}</p>
                    </div>
                    <div class="inventory-stock ${itemClass}">
                        <strong>${peca.quantidade}</strong> un
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHtml);
        });
    } catch (error) {
        console.error('Falha ao obter estoque:', error);
        container.innerHTML = '<p class="section-instruction" style="color:red;">Não foi possível carregar o estoque.</p>';
    }
}

/**
 * Filtra os elementos cruzando a categoria selecionada E o termo digitado
 */
function aplicarFiltrosCombinados() {
    const items = document.querySelectorAll('.inventory-item');

    items.forEach(item => {
        const nomeElemento = item.getAttribute('data-nome');
        const éCritico = item.getAttribute('data-critico') === 'true';

        // Regra 1: Validação por texto da barra de busca
        const passaTexto = nomeElemento.includes(filtroTexto);

        // Regra 2: Validação por Tag de Categoria
        let passaCategoria = false;
        if (filtroCategoria === 'todos') {
            passaCategoria = true;
        } else if (filtroCategoria === 'critico') {
            passaCategoria = éCritico;
        } else {
            // Verifica se a string do nome contém a palavra-chave (ex: 'freio' ou 'oleo'/'fluido')
            const nomeTratado = nomeElemento.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            passaCategoria = nomeTratado.includes(filtroCategoria);
        }

        // Exibe apenas se passar nos dois critérios simultaneamente
        if (passaTexto && passaCategoria) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}
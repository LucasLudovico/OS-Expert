# 🎨 Módulo OS-Expert - Frontend (Vanilla Web)

Este módulo contém exclusivamente a camada de apresentação visual do sistema **OS-Expert**. Seguindo as diretrizes do projeto capstone, estamos utilizando **Web Estática Pura (HTML5, CSS3 e JavaScript Vanilla)**, garantindo uma interface leve, veloz e responsiva (RNF02).

---

## 📂 Guia de Estrutura de Pastas e Arquivos

Abaixo está o mapeamento de onde cada componente visual, estilo ou script deve ser criado:

### 📁 `src/main/resources/templates/`
Esta pasta abriga todas as páginas estruturais do sistema (**arquivos `.html`**).
* **O que colocar aqui:** `login.html`, `dashboard.html`, `abrir-os.html`, `historico.html`.
* **Regra do time:** Nenhum código CSS ou JavaScript deve ser escrito direto dentro desses arquivos. Use apenas marcação HTML pura e importe os recursos da pasta `static`.

### 📁 `src/main/resources/static/img/`
* **O que colocar aqui:** Logotipos, ícones exportados do Figma e imagens de apoio do sistema.

### 📁 `src/main/resources/static/js/`
Esta pasta guarda as regras de comportamento da tela e chamadas de rede (**arquivos `.js`**).
* **O que colocar aqui:** `login.js`, `ordem-servico.js`, `validacoes.js`.
* **Função Principal:** Interceptar os cliques de botões, ler dados dos formulários e fazer requisições HTTP (fetch) para o nosso servidor Java (Backend).

### 📁 `src/main/resources/static/css/`
Esta pasta guarda as folhas de estilo globais e específicas do sistema (**arquivos `.css`**).
* **O que colocar aqui:** `style.css`, `componentes.css` ou estilos customizados para espelhar o design do nosso Figma.

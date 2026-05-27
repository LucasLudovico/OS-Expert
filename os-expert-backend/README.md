# ☕ Módulo OS-Expert - Backend (Java Vanilla API)

Este módulo é o cérebro da nossa aplicação **OS-Expert**. Ele contém toda a lógica de negócio orientada a objetos, os modelos do sistema e o servidor HTTP puro que processa as requisições enviadas pelo nosso time de frontend.

---

## 📂 Organização de Pacotes (Arquitetura)

Todas as classes Java devem ser criadas estritamente debaixo do pacote base `com.osexpert` para manter o projeto organizado:

### 🏢 1. `com.osexpert.model`
Contém as classes de entidade pura (POJOs/Records) que representam o mundo real do nosso negócio.
* **O que colocar aqui:** `Funcionario.java`, `OrdemServico.java`, `Veiculo.java`, `Peca.java`, `ItemPeca.java`.
* **Regra:** Essas classes devem conter apenas atributos, construtores, getters/setters e métodos matemáticos de encapsulamento (ex: `calcularSubtotal()` ou `calcularTotalPecas()`).

### 🛠️ 2. `com.osexpert.service`
Contém as classes responsáveis pelas regras de negócio complexas, criptografia e algoritmos de validação.
* **O que colocar aqui:** `AutenticacaoService.java` (validação com BCrypt), `PdfGeneratorService.java` (geração do relatório da OS).

### 🎛️ 3. `com.osexpert.controller`
Contém as classes que interceptam as chamadas HTTP da rede vindas do JavaScript.
* **O que colocar aqui:** Manipuladores de rotas (Handlers do `HttpServer`). Eles lêem o JSON enviado pelo front-end, chamam o `service` correto e devolvem uma resposta estruturada.

### 🚀 4. Raiz do Pacote (`com.osexpert`)
* **`MainServer.java`:** É a classe principal do sistema. Contém o método `main` que inicia o servidor `HttpServer` nativo na porta `8080`. É ela que damos "Play" para rodar o projeto.

---

## 🔒 Segurança (RNF01) e Regras da Sprint 1
* Toda senha de funcionário mockada no sistema deve ser tratada usando a biblioteca **BCrypt** instalada via dependência do Maven.
* Nunca valide senhas comparando Strings puras (`==` ou `.equals()`). Utilize sempre `BCrypt.checkpw()`.
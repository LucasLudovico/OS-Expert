// Mock de Usuários do Sistema para teste de Login
const mockUsuarios = [
    { id: 1, nome: "Lucas", email: "lucas@osexpert.com", cargo: "GESTOR" },
    { id: 2, nome: "Dryele", email: "dryele@osexpert.com", cargo: "ATENDENTE" },
    { id: 3, nome: "Gustavo", email: "gustavo@osexpert.com", cargo: "MECANICO" }
];

// Mock do Estoque de Peças e Catálogo de Serviços (RF03)
const mockCatalogoItens = [
    { id: 101, nome: "Pastilha de Freio", tipo: "PEÇA", preco: 150.00, estoque: 20 },
    { id: 102, nome: "Filtro de Óleo", tipo: "PEÇA", preco: 45.00, estoque: 5 }, // Estoque baixo!
    { id: 103, nome: "Alinhamento e Balanceamento", tipo: "SERVIÇO", preco: 120.00, estoque: null },
    { id: 104, nome: "Troca de Embreagem", tipo: "SERVIÇO", preco: 400.00, estoque: null }
];

// Mock de Ordens de Serviço Cadastradas (RF07 / RF08)
let mockOrdensServico = [
    {
        id: 1,
        placaVeiculo: "ABC-1234",
        modeloVeiculo: "Civic 2.0",
        nomeCliente: "Raimundo Nonato",
        status: "EM_EXECUCAO",
        dataAbertura: "2026-05-20",
        dataPrevisao: "2026-05-28",
        mecanicoResponsavel: "Gustavo",
        itensAdicionados: [
            { id: 101, nome: "Pastilha de Freio", qtd: 2, precoUnitario: 150.00 },
            { id: 103, nome: "Alinhamento e Balanceamento", qtd: 1, precoUnitario: 120.00 }
        ],
        valorMaoDeObra: 80.00,
        valorTotal: 500.00 // (2x150) + 120 + 80
    },
    {
        id: 2,
        placaVeiculo: "XYZ-9876",
        modeloVeiculo: "Onix 1.0",
        nomeCliente: "Maria Silva",
        status: "ABERTA",
        dataAbertura: "2026-05-26",
        dataPrevisao: "2026-05-27",
        mecanicoResponsavel: "A definir",
        itensAdicionados: [],
        valorMaoDeObra: 0.00,
        valorTotal: 0.00
    }
];

// Funções utilitárias para simular o banco de dados via JS no Front
const DB = {
    // Buscar todas as OSs
    getOSs: () => mockOrdensServico,
    
    // Buscar histórico de OS por placa (RF08)
    getHistoricoPorPlaca: (placa) => {
        return mockOrdensServico.filter(os => os.placaVeiculo.toUpperCase() === placa.toUpperCase());
    },
    
    // Simular salvar uma nova OS
    salvarOS: (novaOS) => {
        novaOS.id = mockOrdensServico.length + 1;
        mockOrdensServico.push(novaOS);
        return novaOS;
    }
};
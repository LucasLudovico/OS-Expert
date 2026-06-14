package com.osexpert.model;

import java.util.List;

public class ClienteVeiculo {
    private String nomeCliente;
    private String placa;
    private String modeloCarro;
    private String telefone;
    private List<HistoricoManutencao> historico;

    // Construtor para facilitar a criação dos dados mockados
    public ClienteVeiculo(String nomeCliente, String placa, String modeloCarro, String telefone, List<HistoricoManutencao> historico) {
        this.nomeCliente = nomeCliente;
        this.placa = placa;
        this.modeloCarro = modeloCarro;
        this.telefone = telefone;
        this.historico = historico;
    }

    // Getters para que o Controller possa ler os dados e mandar para o front-end
    public String getNomeCliente() { return nomeCliente; }
    public String getPlaca() { return placa; }
    public String getModeloCarro() { return modeloCarro; }
    public String getTelefone() { return telefone; }
    public List<HistoricoManutencao> getHistorico() { return historico; }
}

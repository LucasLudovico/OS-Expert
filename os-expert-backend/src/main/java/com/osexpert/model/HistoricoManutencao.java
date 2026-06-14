package com.osexpert.model;

public class HistoricoManutencao {
    private String data;
    private String servico;
    private String mecanico;

    public HistoricoManutencao(String data, String servico, String mecanico) {
        this.data = data;
        this.servico = servico;
        this.mecanico = mecanico;
    }

    // Getters para montagem do JSON
    public String getData() { return data; }
    public String getServico() { return servico; }
    public String getMecanico() { return mecanico; }
}
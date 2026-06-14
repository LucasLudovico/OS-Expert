package com.osexpert.model;

public class OrdemServico {

    private int numeroOS;
    private ClienteVeiculo cliente;
    private Mecanico mecanico;
    private Servico servico;
    private double valorTotal;
    private String status;

    public OrdemServico(int numeroOS, ClienteVeiculo cliente, Mecanico mecanico, Servico servico, double valorTotal, String status) {
        this.numeroOS = numeroOS;
        this.cliente = cliente;
        this.mecanico = mecanico;
        this.servico = servico;
        this.valorTotal = valorTotal;
        this.status = status;
    }

    public int getNumeroOS() {
        return numeroOS;
    }

    public ClienteVeiculo getCliente() {
        return cliente;
    }

    public Mecanico getMecanico() {
        return mecanico;
    }

    public Servico getServico() {
        return servico;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
package com.osexpert.model;

public class Mecanico {
    private int id;
    private String nome;
    private double taxaServico;

    public Mecanico (int id, String nome, double taxaServico) {
        this.id = id;
        this.nome = nome;
        this.taxaServico = taxaServico;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public double getTaxaServico() {
        return taxaServico;
    }
}

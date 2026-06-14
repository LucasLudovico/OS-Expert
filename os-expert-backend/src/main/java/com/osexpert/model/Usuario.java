package com.osexpert.model;

public class Usuario {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String cargo; // GESTOR, ATENDENTE, MECANICO

    // Construtor completo
    public Usuario(Long id, String nome, String email, String senha, String cargo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cargo = cargo;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public String getCargo() {
        return cargo;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
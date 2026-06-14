package com.osexpert;

import com.osexpert.controller.*;
import com.sun.net.httpserver.HttpServer;
import com.osexpert.controller.AtendenteController;

import java.io.IOException;
import java.net.InetSocketAddress;

public class MainServer {
    public static void main(String[] args) {
        try {
            // Cria o servidor HTTP para rodar localmente na porta 8080
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

            // Registra a rota de busca. Quando o front chamar "/buscar", o AtendenteController entra em ação
            server.createContext("/auth/login", new LoginController());
            server.createContext("/buscar", new AtendenteController());
            server.createContext("/clientes", new ClienteController());
            server.createContext("/mecanicos", new MecanicoController());
            server.createContext("/servicos", new ServicoController());
            server.createContext("/ordemservico", new OrdemServicoController());

            // Define o executor padrão (null usa o padrão do sistema)
            server.setExecutor(null);

            System.out.println("=========================================");
            System.out.println("  Servidor OS-Expert inicializado com sucesso! ");
            System.out.println("  Escutando requisições em: http://localhost:8080");
            System.out.println("=========================================");

            // Inicia o servidor de fato
            server.start();

        } catch (IOException e) {
            System.err.println("Erro ao iniciar o servidor: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

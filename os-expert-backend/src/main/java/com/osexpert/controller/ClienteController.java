package com.osexpert.controller;

import com.osexpert.model.ClienteVeiculo;
import com.osexpert.service.AtendenteService;
import com.sun.net.httpserver.*;

import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class ClienteController implements HttpHandler {

    private AtendenteService service = new AtendenteService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Configuração de Headers CORS e Content-Type
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Content-Type", "application/json");

        // Trata a requisição de pré-vôo (CORS) do navegador
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String metodo = exchange.getRequestMethod();
        String jsonResposta = "";
        int statusCode = 200;

        if (metodo.equalsIgnoreCase("GET")) {
            // Verifica se veio filtro por placa na URL (ex: /clientes?placa=ABC-1234)
            URI uri = exchange.getRequestURI();
            String query = uri.getQuery();
            String placaParam = null;

            if (query != null && query.contains("placa=")) {
                String[] params = query.split("&");
                for (String param : params) {
                    if (param.startsWith("placa=")) {
                        placaParam = param.split("=")[1];
                    }
                }
            }

            if (placaParam != null) {
                // Busca um cliente específico
                ClienteVeiculo cliente = service.buscarClientePorPlaca(placaParam);
                if (cliente != null) {
                    jsonResposta = converterClienteParaJson(cliente);
                } else {
                    jsonResposta = "{\"erro\":\"Cliente não encontrado\"}";
                    statusCode = 404;
                }
            } else {
                // Lista todos os clientes cadastrados
                jsonResposta = converterListaClientesParaJson(service.listarClientes());
            }

        } else if (metodo.equalsIgnoreCase("POST")) {
            // Lê o payload enviado pelo formulário do Front-End
            InputStream input = exchange.getRequestBody();
            String body = new String(input.readAllBytes(), StandardCharsets.UTF_8);

            // Parse manual simplificado do JSON recebido
            ClienteVeiculo novoCliente = parseJsonCliente(body);

            if (novoCliente != null) {
                service.cadastrarCliente(novoCliente);
                jsonResposta = "{\"status\":\"Cliente cadastrado com sucesso no Java!\"}";
                statusCode = 201; // Created
            } else {
                jsonResposta = "{\"erro\":\"Dados inválidos para cadastro.\"}";
                statusCode = 400; // Bad Request
            }
        } else {
            exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            return;
        }

        byte[] bytes = jsonResposta.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    // --- Métodos Auxiliares de Conversão Manual ---
    private String converterClienteParaJson(ClienteVeiculo cv) {
        return String.format(
                "{\"nomeCliente\":\"%s\",\"placa\":\"%s\",\"modeloCarro\":\"%s\",\"telefone\":\"%s\",\"historico\":[]}",
                cv.getNomeCliente(), cv.getPlaca(), cv.getModeloCarro(), cv.getTelefone()
        );
    }

    private String converterListaClientesParaJson(List<ClienteVeiculo> lista) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            json.append(converterClienteParaJson(lista.get(i)));
            if (i < lista.size() - 1) json.append(",");
        }
        json.append("]");
        return json.toString();
    }

    private ClienteVeiculo parseJsonCliente(String json) {
        try {
            // Limpa as chaves e quebras de linha básicas
            String limpo = json.replace("{", "").replace("}", "").replace("\"", "").trim();
            String[] campos = limpo.split(",");

            String nome = "", placa = "", modelo = "", telefone = "";
            for (String campo : campos) {
                String[] par = campo.split(":");
                if (par.length < 2) continue;
                String chave = par[0].trim();
                String valor = par[1].trim();

                if (chave.equalsIgnoreCase("nomeCliente")) nome = valor;
                if (chave.equalsIgnoreCase("placa")) placa = valor;
                if (chave.equalsIgnoreCase("modeloCarro")) modelo = valor;
                if (chave.equalsIgnoreCase("telefone")) telefone = valor;
            }
            return new ClienteVeiculo(nome, placa, modelo, telefone, new ArrayList<>());
        } catch (Exception e) {
            return null;
        }
    }
}
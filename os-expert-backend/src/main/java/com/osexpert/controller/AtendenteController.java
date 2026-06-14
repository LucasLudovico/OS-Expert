package com.osexpert.controller;

import com.osexpert.model.HistoricoManutencao;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.osexpert.service.AtendenteService;
import com.osexpert.model.ClienteVeiculo;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;

public class AtendenteController implements HttpHandler {

    private AtendenteService atendenteService = new AtendenteService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Habilita o CORS para que o HTML/JS front-end local consiga acessar o Java
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Content-Type", "application/json");

        URI uri = exchange.getRequestURI();
        String query = uri.getQuery(); // Pega o que vem depois do '?' na URL (ex: placa=ABC1R23)

        String placaParam = "";
        if (query != null && query.startsWith("placa=")) {
            placaParam = query.split("=")[1];
        }

        // Executa a busca no nosso Service Mockado
        ClienteVeiculo clienteEncontrado = atendenteService.buscarPorPlaca(placaParam);

        String jsonResposta;
        int statusCode;

        if (clienteEncontrado != null) {
            // Transforma a lista de históricos em strings JSON
            StringBuilder historicoJson = new StringBuilder("[");
            for (int i = 0; i < clienteEncontrado.getHistorico().size(); i++) {
                HistoricoManutencao h = clienteEncontrado.getHistorico().get(i);
                historicoJson.append(String.format(
                        "{\"data\":\"%s\",\"servico\":\"%s\",\"mecanico\":\"%s\"}",
                        h.getData(), h.getServico(), h.getMecanico()
                ));
                if (i < clienteEncontrado.getHistorico().size() - 1) {
                    historicoJson.append(",");
                }
            }
            historicoJson.append("]");

            jsonResposta = String.format(
                    "{\"nomeCliente\":\"%s\",\"placa\":\"%s\",\"modeloCarro\":\"%s\",\"telefone\":\"%s\",\"historico\":%s}",
                    clienteEncontrado.getNomeCliente(),
                    clienteEncontrado.getPlaca(),
                    clienteEncontrado.getModeloCarro(),
                    clienteEncontrado.getTelefone(),
                    historicoJson.toString()
            );
            statusCode = 200;
        } else {
            jsonResposta = "{\"erro\":\"Veículo não cadastrado previamente.\"}";
            statusCode = 404; // Não encontrado
        }

        // Envia a resposta de volta para o front-end
        byte[] bytes = jsonResposta.getBytes("UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }
}

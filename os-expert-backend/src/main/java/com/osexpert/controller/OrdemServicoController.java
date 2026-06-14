package com.osexpert.controller;

import com.sun.net.httpserver.*;

import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;

public class OrdemServicoController implements HttpHandler {

    // Simulação de banco de dados em memória para manter o estado da OS do fluxo do cliente
    private static int numeroOSContador = 452;
    private static double valorBaseOS = 345.00;
    private static double valorAdicionaisAprovados = 0.00;
    private static String itensAprovadosTexto = "";
    private static String statusAtualOS = "AGUARDANDO_APROVACAO";

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // 1. Configuração estrita dos cabeçalhos CORS
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");

        String metodo = exchange.getRequestMethod();

        if (metodo.equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String jsonResposta = "";
        int statusCode = 200;

        // --- TRATAMENTO DO GET (Buscar OS ativa do Cliente) ---
        if (metodo.equalsIgnoreCase("GET")) {
            URI uri = exchange.getRequestURI();
            String query = uri.getQuery();
            String placaParam = "MOCK";

            if (query != null && query.contains("placa=")) {
                String[] params = query.split("&");
                for (String param : params) {
                    if (param.startsWith("placa=")) {
                        placaParam = param.split("=")[1];
                    }
                }
            }

            // Monta o JSON da OS com os valores reais recalculados pelo Java
            double valorTotalConsolidado = valorBaseOS + valorAdicionaisAprovados;
            jsonResposta = String.format(
                    "{\"numeroOS\":%d,\"placa\":\"%s\",\"valorBase\":%.2f,\"valorAdicionais\":%.2f,\"valorTotal\":%.2f,\"status\":\"%s\",\"itensAprovados\":\"%s\"}",
                    numeroOSContador, placaParam, valorBaseOS, valorAdicionaisAprovados, valorTotalConsolidado, statusAtualOS, itensAprovadosTexto
            );

            // --- TRATAMENTO DO POST (Atualizar/Consolidar Adicionais ou Pagar) ---
        } else if (metodo.equalsIgnoreCase("POST")) {
            InputStream input = exchange.getRequestBody();
            String body = new String(input.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("Payload processado no fluxo do cliente: " + body);

            // Verifica se é uma requisição de atualização de adicionais
            if (body.contains("adicionaisAprovados")) {
                // Parse simplificado para extrair os valores enviados pelo JS
                if (body.contains("\"aprovou\":true")) {
                    statusAtualOS = "APROVADO";
                    // Extrai o valor dinâmico acumulado enviado pelo front-end
                    valorAdicionaisAprovados = extrairValorDoubleJson(body, "valorExtras");
                    itensAprovadosTexto = extrairTextoJson(body, "nomesItens");
                } else {
                    statusAtualOS = "REVISAO_BASE_MANTIDA";
                    valorAdicionaisAprovados = 0.00;
                    itensAprovadosTexto = "";
                }
                jsonResposta = "{\"status\":\"atualizado\",\"mensagem\":\"Ordem de serviço recalculada no servidor.\"}";
            } else if (body.contains("acao") && body.contains("pagar")) {
                // Fluxo de pagamento concluído
                statusAtualOS = "PAGO";
                jsonResposta = "{\"status\":\"pago\",\"mensagem\":\"Pagamento registrado com sucesso!\"}";
            } else {
                // Caso seja o payload inicial gerado pelo Atendente
                jsonResposta = "{\"status\":\"ok\"}";
            }
        } else {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        byte[] bytes = jsonResposta.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    // Métodos utilitários para Parse manual de JSON do HTTP nativo
    private double extrairValorDoubleJson(String json, String chave) {
        try {
            String alvo = json.split("\"" + chave + "\":")[1];
            String valorTexto = alvo.split(",")[0].replace("}", "").replace("\"", "").trim();
            return Double.parseDouble(valorTexto);
        } catch (Exception e) {
            return 0.00;
        }
    }

    private String extrairTextoJson(String json, String chave) {
        try {
            String alvo = json.split("\"" + chave + "\":\"")[1];
            return alvo.split("\"")[0].trim();
        } catch (Exception e) {
            return "";
        }
    }
}
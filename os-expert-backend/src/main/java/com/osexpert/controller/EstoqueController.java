package com.osexpert.controller;

import com.sun.net.httpserver.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class EstoqueController implements HttpHandler {

    // Simulação do banco de dados de peças em memória corporativa
    private static final Map<Integer, Integer> quantidades = new HashMap<>();
    private static final Map<Integer, String> nomes = new HashMap<>();
    private static final Map<Integer, String> comps = new HashMap<>();

    static {
        quantidades.put(451, 7);
        nomes.put(451, "Pastilha de Freio (Dianteira)");
        comps.put(451, "Linha Honda / Toyota");

        quantidades.put(951, 20);
        nomes.put(951, "4L Óleo Sintético 0W20");
        comps.put(951, "Linha Honda");

        quantidades.put(773, 5);
        nomes.put(773, "Fluido de Freio DOT 4 (500ml)");
        comps.put(773, "Uso geral");

        quantidades.put(892, 14);
        nomes.put(892, "Filtro de Óleo Sintético");
        comps.put(892, "Motores 2.0 / 1.5 Turbo");
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
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

        // --- RETORNAR ESTOQUE ATUALIZADO ---
        if (metodo.equalsIgnoreCase("GET")) {
            StringBuilder sb = new StringBuilder("[");
            int i = 0;
            for (Integer id : quantidades.keySet()) {
                sb.append(String.format(
                        "{\"id\":%d,\"nome\":\"%s\",\"compatibilidade\":\"%s\",\"quantidade\":%d}",
                        id, nomes.get(id), comps.get(id), quantidades.get(id)
                ));
                if (i < quantidades.size() - 1) sb.append(",");
                i++;
            }
            sb.append("]");
            jsonResposta = sb.toString();

            // --- PROCESSAR BAIXA DE COMPONENTE ---
        } else if (metodo.equalsIgnoreCase("POST")) {
            InputStream input = exchange.getRequestBody();
            String body = new String(input.readAllBytes(), StandardCharsets.UTF_8);

            // Extração rudimentar do id enviado no JSON {"pecaId": 451}
            try {
                String idTexto = body.split("\"pecaId\":")[1].replace("}", "").replace("\"", "").trim();
                int pecaId = Integer.parseInt(idTexto);

                if (quantidades.containsKey(pecaId)) {
                    int qtdAtual = quantidades.get(pecaId);
                    if (qtdAtual > 0) {
                        quantidades.put(pecaId, qtdAtual - 1); // Decrementa 1 unidade física
                        System.out.println(">>> ESTOQUE ATUALIZADO: Peça " + pecaId + " agora possui " + (qtdAtual - 1) + " unidades.");
                        jsonResposta = "{\"status\":\"sucesso\",\"novaQuantidade\":" + (qtdAtual - 1) + "}";
                    } else {
                        jsonResposta = "{\"status\":\"erro\",\"mensagem\":\"Estoque esgotado para esta peça.\"}";
                        statusCode = 400;
                    }
                } else {
                    jsonResposta = "{\"status\":\"erro\",\"mensagem\":\"Peça não localizada.\"}";
                    statusCode = 404;
                }
            } catch (Exception e) {
                jsonResposta = "{\"status\":\"erro\",\"mensagem\":\"Falha no processamento do payload.\"}";
                statusCode = 400;
            }
        }

        byte[] bytes = jsonResposta.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
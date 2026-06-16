package com.osexpert.controller;

import com.sun.net.httpserver.*;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class MecanicoTarefasController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Retorna a lista de tarefas fixas simulando o banco de dados
        String jsonResposta = "[" +
                "{\"os\":1024,\"status\":\"DIAGNÓSTICO\",\"badgeClass\":\"yellow\",\"veiculo\":\"Civic (ABC-1234)\",\"desc\":\"Sintoma: Barulho ao frear e perda de torque.\",\"podeIniciar\":true}," +
                "{\"os\":1020,\"status\":\"AGUARDANDO PEÇAS\",\"badgeClass\":\"blue\",\"veiculo\":\"Hilux (XYZ-9999)\",\"desc\":\"Aguardando liberação das peças no almoxarifado.\",\"podeIniciar\":false}" +
                "]";

        byte[] bytes = jsonResposta.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
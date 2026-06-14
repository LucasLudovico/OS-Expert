package com.osexpert.controller;

import com.osexpert.model.Mecanico;
import com.osexpert.service.AtendenteService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class MecanicoController implements HttpHandler {

    private AtendenteService service =
            new AtendenteService();

    @Override
    public void handle(HttpExchange exchange)
            throws IOException {

        exchange.getResponseHeaders()
                .set("Access-Control-Allow-Origin", "*");

        exchange.getResponseHeaders()
                .set("Content-Type", "application/json");

        List<Mecanico> mecanicos =
                service.listarMecanicos();

        StringBuilder json =
                new StringBuilder("[");

        for (int i = 0; i < mecanicos.size(); i++) {

            Mecanico m =
                    mecanicos.get(i);

            json.append(
                    String.format(
                            "{\"id\":%d,\"nome\":\"%s\",\"taxa\":%.2f}",
                            m.getId(),
                            m.getNome(),
                            m.getTaxaServico()
                    )
            );

            if (i < mecanicos.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");

        byte[] resposta =
                json.toString().getBytes();

        exchange.sendResponseHeaders(
                200,
                resposta.length
        );

        OutputStream os =
                exchange.getResponseBody();

        os.write(resposta);

        os.close();
    }
}
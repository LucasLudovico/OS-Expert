package com.osexpert.controller;

import com.osexpert.model.Servico;
import com.osexpert.service.AtendenteService;
import com.sun.net.httpserver.*;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class ServicoController implements HttpHandler {

    private AtendenteService service =
            new AtendenteService();

    @Override
    public void handle(HttpExchange exchange)
            throws IOException {

        exchange.getResponseHeaders()
                .set("Access-Control-Allow-Origin", "*");

        exchange.getResponseHeaders()
                .set("Content-Type", "application/json");

        List<Servico> servicos =
                service.listarServicos();

        StringBuilder json =
                new StringBuilder("[");

        for (int i = 0; i < servicos.size(); i++) {

            Servico s =
                    servicos.get(i);

            json.append(
                    String.format(
                            "{\"id\":%d,\"descricao\":\"%s\",\"valor\":%.2f}",
                            s.getId(),
                            s.getDescricao(),
                            s.getValorBase()
                    )
            );

            if (i < servicos.size() - 1) {
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
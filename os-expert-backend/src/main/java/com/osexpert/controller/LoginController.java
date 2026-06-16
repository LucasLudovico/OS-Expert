package com.osexpert.controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.osexpert.model.Usuario;

import java.io.IOException;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class LoginController implements HttpHandler {

    private static final List<Usuario> mockUsuarios = new ArrayList<>();

    static {
        mockUsuarios.add(new Usuario(1L, "Lucas", "lucas@osexpert.com", "1234", "GESTOR"));
        mockUsuarios.add(new Usuario(2L, "Dryele", "dryele@osexpert.com", "1234", "ATENDENTE"));
        mockUsuarios.add(new Usuario(3L, "Gustavo", "gustavo@osexpert.com", "1234", "MECANICO"));
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Cabeçalhos CORS para o Front-end não travar
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            // 1. Ler o corpo do JSON bruto
            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
            BufferedReader br = new BufferedReader(isr);
            StringBuilder jsonRecebido = new StringBuilder();
            String linha;
            while ((linha = br.readLine()) != null) {
                jsonRecebido.append(linha);
            }
            br.close();

            String corpoString = jsonRecebido.toString();

            // 2. Extrator ultra-simples
            String email = extrairComRegex(corpoString, "email");
            String senha = extrairComRegex(corpoString, "senha");

            // Prints para checar no terminal do Java
            System.out.println("DEBUG TERMINAL -> Email: [" + email + "]");
            System.out.println("DEBUG TERMINAL -> Senha: [" + senha + "]");

            // 3. Buscar o usuário correspondente
            Optional<Usuario> usuarioOpt = mockUsuarios.stream()
                    .filter(u -> u.getEmail().equalsIgnoreCase(email))
                    .findFirst();

            String jsonResposta;
            int statusHttp;

            // Comparação direta de texto simples
            if (usuarioOpt.isPresent() && usuarioOpt.get().getSenha().equals(senha)) {
                Usuario u = usuarioOpt.get();
                statusHttp = 200; // Sucesso!
                jsonResposta = String.format(
                        "{\"id\":%d,\"nome\":\"%s\",\"email\":\"%s\",\"cargo\":\"%s\"}",
                        u.getId(), u.getNome(), u.getEmail(), u.getCargo()
                );
            } else {
                statusHttp = 401; // Falhou
                jsonResposta = "{\"erro\":\"E-mail corporativo ou senha inválidos!\"}";
            }

            // 4. Enviar resposta de volta
            byte[] respostaBytes = jsonResposta.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(statusHttp, respostaBytes.length);

            try (OutputStream os = exchange.getResponseBody()) {
                os.write(respostaBytes);
            }
        } else {
            exchange.sendResponseHeaders(405, -1);
        }
    }

    // Método auxiliar nativo que limpa chaves, aspas, espaços e pontuações do JSON
    private String extrairComRegex(String json, String chave) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"" + chave + "\"\\s*:\\s*\"([^\"]*)\"");
        java.util.regex.Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "";
    }
}
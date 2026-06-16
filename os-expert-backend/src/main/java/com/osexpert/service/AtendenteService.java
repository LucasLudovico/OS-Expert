package com.osexpert.service;

import com.osexpert.model.*;

import java.util.ArrayList;
import java.util.List;

public class AtendenteService {
    private static List<ClienteVeiculo> clientes = new ArrayList<>();
    private static List<Mecanico> mecanicos = new ArrayList<>();
    private static List<Servico> servicos = new ArrayList<>();
    private static List<OrdemServico> ordensServico = new ArrayList<>();

    static {
        // Mockando os dados com histórico detalhado para o veículo padrão
        clientes.add(new ClienteVeiculo(
                "Ricardo Silva",
                "ABC-1234",
                "Civic",
                "(11) 99999-1111",
                List.of(
                        new HistoricoManutencao("12/05/2026", "Troca de Óleo", "Mecânico: Ricardo"), //
                        new HistoricoManutencao("10/01/2024", "Revisão 40k", "Mecânico: André")    //
                )
        ));

        // Outros carros (vazio se não tiver histórico antigo)
        clientes.add(new ClienteVeiculo("Maria Souza", "XYZ-9999", "Hilux", "(11) 98888-2222", List.of()));

        mecanicos.add(
                new Mecanico(
                        1,
                        "André",
                        80.0
                )
        );

        mecanicos.add(
                new Mecanico(
                        2,
                        "Ricardo",
                        100.0
                )
        );

        mecanicos.add(
                new Mecanico(
                        3,
                        "Carlos",
                        150.0
                )
        );

        servicos.add(
                new Servico(
                        1,
                        "Troca de Óleo",
                        120.0
                )
        );

        servicos.add(
                new Servico(
                        2,
                        "Troca de Pastilhas",
                        250.0
                )
        );

        servicos.add(
                new Servico(
                        3,
                        "Revisão Completa",
                        600.0
                )
        );


    }

    public ClienteVeiculo buscarPorPlaca(String placaPesquisada) {
        if (placaPesquisada == null) return null;
        for (ClienteVeiculo cv : clientes) {
            if (cv.getPlaca().equalsIgnoreCase(placaPesquisada.trim())) {
                return cv;
            }
        }
        return null;
    }

    public void cadastrarCliente(
            ClienteVeiculo cliente
    ) {
        clientes.add(cliente);
    }

    public List<ClienteVeiculo> listarClientes() {
        return clientes;
    }

    public ClienteVeiculo buscarClientePorPlaca(String placa) {

        for (ClienteVeiculo cliente : clientes) {

            if (cliente.getPlaca()
                    .equalsIgnoreCase(placa)) {

                return cliente;
            }
        }

        return null;
    }

    public List<Mecanico> listarMecanicos() {
        return mecanicos;
    }

    public List<Servico> listarServicos() {
        return servicos;
    }

    public Mecanico buscarMecanicoPorId(int id) {

        for (Mecanico mecanico : mecanicos) {

            if (mecanico.getId() == id) {
                return mecanico;
            }
        }

        return null;
    }

    public Servico buscarServicoPorId(int id) {

        for (Servico servico : servicos) {

            if (servico.getId() == id) {
                return servico;
            }
        }

        return null;
    }

    public double calcularValorOS(int idMecanico, int idServico) {

        Mecanico mecanico =
                buscarMecanicoPorId(idMecanico);

        Servico servico =
                buscarServicoPorId(idServico);

        if (mecanico == null || servico == null) {
            return 0;
        }

        return servico.getValorBase() + mecanico.getTaxaServico();
    }

    public OrdemServico criarOS(ClienteVeiculo cliente, Mecanico mecanico, Servico servico) {

        double valorFinal = calcularValorOS(mecanico.getId(), servico.getId());

        OrdemServico os =
                new OrdemServico(
                        ordensServico.size() + 1,
                        cliente,
                        mecanico,
                        servico,
                        valorFinal,
                        "ABERTA"
                );

        ordensServico.add(os);

        return os;
    }

    public List<OrdemServico> listarOrdensServico() {
        return ordensServico;
    }

    public OrdemServico buscarOS(int numeroOS) {

        for (OrdemServico os : ordensServico) {

            if (os.getNumeroOS() == numeroOS) {
                return os;
            }
        }

        return null;
    }

    public void alterarStatusOS(int numeroOS, String novoStatus) {

        OrdemServico os =
                buscarOS(numeroOS);

        if (os == null) {
            return;
        }

        os.setStatus(novoStatus);
    }
}
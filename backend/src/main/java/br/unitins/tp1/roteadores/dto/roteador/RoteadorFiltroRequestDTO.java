package br.unitins.tp1.roteadores.dto.roteador;

import java.util.List;

public record RoteadorFiltroRequestDTO (
    Double precoMin,
    Double precoMax,
    List<String> protocolosSeguranca,
    List<String> sistemasOperacionais,
    List<String> bandasFrequencia,
    List<Integer> qtdAntenas,
    List<String> sinaisWireless,
    String sortBy
){

}

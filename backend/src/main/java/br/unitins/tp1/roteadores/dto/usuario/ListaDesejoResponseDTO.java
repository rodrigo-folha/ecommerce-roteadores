package br.unitins.tp1.roteadores.dto.usuario;

import br.unitins.tp1.roteadores.model.roteador.Roteador;

public record ListaDesejoResponseDTO(
    Long idProduto,
    String nomeProduto
) {

    public static ListaDesejoResponseDTO valueOf(Roteador roteador) {
        return new ListaDesejoResponseDTO(
            roteador.getId(),
            roteador.getNome()
        );
    }
    
}

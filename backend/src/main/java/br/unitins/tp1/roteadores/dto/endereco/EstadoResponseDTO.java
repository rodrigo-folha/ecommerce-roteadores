package br.unitins.tp1.roteadores.dto.endereco;

import br.unitins.tp1.roteadores.model.endereco.Estado;

public record EstadoResponseDTO(Long id, String nome, String sigla) {
    public static EstadoResponseDTO valueOf(Estado estado) {
        return new EstadoResponseDTO(estado.getId(), estado.getNome(), estado.getSigla());
    }
}

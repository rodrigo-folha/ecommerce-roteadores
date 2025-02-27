package br.unitins.tp1.roteadores.dto.roteador;

import br.unitins.tp1.roteadores.model.roteador.QuantidadeAntena;

public record QuantidadeAntenaResponseDTO(Long id, Integer quantidade) {
    public static QuantidadeAntenaResponseDTO valueOf(QuantidadeAntena quantidadeAntena) {
        return new QuantidadeAntenaResponseDTO(quantidadeAntena.getId(), quantidadeAntena.getQuantidade());
    }
}

package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDate;

import br.unitins.tp1.roteadores.model.pedido.Lote;

public record LoteResponseDTO(
    Long id,
    String codigo,
    LocalDate data,
    Integer estoque,
    Long idRoteador
) {

    public static LoteResponseDTO valueOf(Lote lote) {
        return new LoteResponseDTO(
            lote.getId(),
            lote.getCodigo(),
            lote.getData(),
            lote.getEstoque(),
            lote.getRoteador().getId()
        );

    }
    
}

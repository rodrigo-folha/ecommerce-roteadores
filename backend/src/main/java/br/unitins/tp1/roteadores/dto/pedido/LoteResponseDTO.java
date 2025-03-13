package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDate;

import br.unitins.tp1.roteadores.dto.roteador.RoteadorResponseDTO;
import br.unitins.tp1.roteadores.model.pedido.Lote;

public record LoteResponseDTO(
    Long id,
    String codigo,
    LocalDate data,
    Integer estoque,
    RoteadorResponseDTO roteador
) {

    public static LoteResponseDTO valueOf(Lote lote) {
        return new LoteResponseDTO(
            lote.getId(),
            lote.getCodigo(),
            lote.getData(),
            lote.getEstoque(),
            RoteadorResponseDTO.valueOf(lote.getRoteador())
        );

    }
    
}

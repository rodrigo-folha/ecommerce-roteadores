package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDate;

import br.unitins.tp1.roteadores.model.pedido.CupomDesconto;

public record CupomDescontoResponseDTO(
    Long id,
    String codigo,
    Double percentualDesconto,
    LocalDate validade
) {

    public static CupomDescontoResponseDTO valueOf(CupomDesconto cupomDesconto) {
        return new CupomDescontoResponseDTO(
            cupomDesconto.getId(),
            cupomDesconto.getCodigo(),
            cupomDesconto.getPercentualDesconto(),
            cupomDesconto.getValidade());
    }
    
}

package br.unitins.tp1.roteadores.dto.pagamento;

import java.time.LocalDateTime;

import br.unitins.tp1.roteadores.model.pagamento.Pix;

public record PixResponseDTO(
    Long id,
    String chave,
    LocalDateTime validade,
    Double valor
) {
    
    public static PixResponseDTO valueOf(Pix pix) {
        return new PixResponseDTO(
            pix.getId(),
            pix.getChave(),
            pix.getValidade(),
            pix.getValor());
    }
}

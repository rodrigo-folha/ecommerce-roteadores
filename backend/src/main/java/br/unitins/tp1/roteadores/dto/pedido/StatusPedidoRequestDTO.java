package br.unitins.tp1.roteadores.dto.pedido;

import br.unitins.tp1.roteadores.model.pedido.SituacaoPedido;
import jakarta.validation.constraints.NotNull;

public record StatusPedidoRequestDTO(
    @NotNull(message = "O campo situacaoPedido deve ser informado")
    SituacaoPedido situacaoPedido
) {
    
}

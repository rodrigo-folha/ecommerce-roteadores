package br.unitins.tp1.roteadores.dto.pedido;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemPedidoRequestDTO(
    @NotNull(message = "O campo idProduto deve ser informado")
    @Positive(message = "O campo id do produto deve ser informado corretamente.")
    Long idProduto,
    @NotNull(message = "O campo quantidade deve ser informado")
    @Positive(message = "Informe a quantidade")
    Integer quantidade
) {
    
}

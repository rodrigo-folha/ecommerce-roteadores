package br.unitins.tp1.roteadores.dto.pedido;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PedidoRequestDTO(
        @NotNull(message = "O campo valor total deve ser informado.")
        Double valorTotal,
        @Valid
        List<ItemPedidoRequestDTO> listaItemPedido,
        @NotNull(message = "O campo id endereco deve ser informado.")
        @Positive
        Long idEndereco,
        String cupomDesconto,
        @NotBlank(message = "O tipo de pagamento deve ser informado (boleto, pix ou cartao)")
        String tipoPagamento,
        Long idCartao
) {
}

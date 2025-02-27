package br.unitins.tp1.roteadores.dto.pedido;

import br.unitins.tp1.roteadores.model.pedido.ItemPedido;

public record ItemPedidoResponseDTO(
    Long idProduto,
    String nome,
    Integer quantidade,
    Double valor
) {
    
    public static ItemPedidoResponseDTO valueOf(ItemPedido itemPedido) {
        return new ItemPedidoResponseDTO(
            itemPedido.getLote().getRoteador().getId(),
            itemPedido.getLote().getRoteador().getNome(),
            itemPedido.getQuantidade(),
            itemPedido.getPreco());
    }
}

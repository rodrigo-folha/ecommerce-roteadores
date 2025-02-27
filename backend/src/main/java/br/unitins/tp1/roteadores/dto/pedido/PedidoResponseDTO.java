package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDateTime;
import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EnderecoResponseDTO;
import br.unitins.tp1.roteadores.dto.pagamento.PagamentoResponseDTO;
import br.unitins.tp1.roteadores.model.pedido.Pedido;

public record PedidoResponseDTO(
    Long id,
    LocalDateTime data,
    Double valorTotal,
    List<ItemPedidoResponseDTO> listaItemPedido,
    List<StatusPedidoResponseDTO> statusPedidos,
    EnderecoResponseDTO enderecoEntrega,
    Object pagamento
) {

    public static PedidoResponseDTO valueOf(Pedido pedido) {
        return new PedidoResponseDTO(
            pedido.getId(),
            pedido.getData(),
            pedido.getValorTotal(),
            pedido.getListaItemPedido().stream().map(ItemPedidoResponseDTO::valueOf).toList(),
            pedido.getStatusPedido().stream().map(StatusPedidoResponseDTO::valueOf).toList(),
            EnderecoResponseDTO.valueOf(pedido.getEnderecoEntrega()),
            PagamentoResponseDTO.valueOf(pedido.getPagamento()));
      
    }
    
}
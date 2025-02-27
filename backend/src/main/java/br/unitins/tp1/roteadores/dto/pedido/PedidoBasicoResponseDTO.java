package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDateTime;

import br.unitins.tp1.roteadores.model.pagamento.Boleto;
import br.unitins.tp1.roteadores.model.pagamento.CartaoPagamento;
import br.unitins.tp1.roteadores.model.pagamento.Pix;
import br.unitins.tp1.roteadores.model.pedido.Pedido;
import br.unitins.tp1.roteadores.model.pedido.SituacaoPedido;
import br.unitins.tp1.roteadores.repository.PagamentoRepository;

public record PedidoBasicoResponseDTO(
    Long id,
    Double valorTotal,
    String metodoPagamento,
    SituacaoPedido situacao,
    LocalDateTime data
) {

    public static PedidoBasicoResponseDTO valueOf(Pedido pedido) {
        return new PedidoBasicoResponseDTO(
            pedido.getId(),
            pedido.getValorTotal(),
            getTipoPagamento(pedido),
            pedido.getStatusPedido().getLast().getSituacaoPedido(),
            pedido.getStatusPedido().getLast().getDataAtualizacao());
    }

    public static String getTipoPagamento (Pedido pedido) {
        PagamentoRepository pagamentoRepository = new PagamentoRepository();
        if (pedido.getPagamento() instanceof Boleto) {
            return "Boleto";
        } else if (pedido.getPagamento() instanceof Pix) {
            return "Pix";
        } else if (pedido.getPagamento() instanceof CartaoPagamento) {
            return "Cartao";
        } else if (pagamentoRepository.findByBoleto(pedido.getId()) != null) {
            if (pedido.getStatusPedido().getLast().getSituacaoPedido().equals(SituacaoPedido.PAGAMENTO_EXPIRADO)) 
                return "Pagamento expirado!";
            
            return "Aguardando pagamento do boleto de id: "  + pedido.getId();
        } else if (pagamentoRepository.findByPix(pedido.getId()) != null) {
            if (pedido.getStatusPedido().getLast().getSituacaoPedido().equals(SituacaoPedido.PAGAMENTO_EXPIRADO)) 
                return "Pagamento expirado!";
                
            return "Aguardando pagamento do pix de id: "  + pedido.getId();
        } else
            return "Pagando ainda não realizado";
    }
    
}

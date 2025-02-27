package br.unitins.tp1.roteadores.service.pedido;

import java.util.List;

import br.unitins.tp1.roteadores.dto.pagamento.BoletoResponseDTO;
import br.unitins.tp1.roteadores.dto.pagamento.PixResponseDTO;
import br.unitins.tp1.roteadores.dto.pedido.PedidoRequestDTO;
import br.unitins.tp1.roteadores.dto.pedido.StatusPedidoRequestDTO;
import br.unitins.tp1.roteadores.model.pedido.Pedido;

public interface PedidoService {

    Pedido findById(String email, Long id);

    List<Pedido> findByEmail(String email);

    Pedido create(PedidoRequestDTO dto, String email);

    BoletoResponseDTO gerarBoleto(Pedido pedido);
    PixResponseDTO gerarCodigoPix(Pedido pedido);

    void registrarPagamentoPix(Long idPedido, Long idPix);
    void registrarPagamentoBoleto(Long idPedido, Long idBoleto);
    void registrarPagamentoCartao(Pedido pedido, Long idCartao);

    void updateStatusPedido(Long idPedido, StatusPedidoRequestDTO statusPedido);

    void cancelarPedido(Long idPedido);

    void devolverPedido(Long idPedido);

    // administrativo
    Pedido findById(Long id);
    List<Pedido> findAll();

}

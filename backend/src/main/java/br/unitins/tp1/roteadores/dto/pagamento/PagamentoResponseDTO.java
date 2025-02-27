package br.unitins.tp1.roteadores.dto.pagamento;

import br.unitins.tp1.roteadores.model.pagamento.Boleto;
import br.unitins.tp1.roteadores.model.pagamento.CartaoPagamento;
import br.unitins.tp1.roteadores.model.pagamento.Pagamento;
import br.unitins.tp1.roteadores.model.pagamento.Pix;

public record PagamentoResponseDTO(Object Pagamento) {
    
    public static Object valueOf(Pagamento pagamento) {
        if (pagamento instanceof Boleto) {
            Boleto boleto = (Boleto) pagamento;
            return BoletoResponseDTO.valueOf(boleto);
        }

        if (pagamento instanceof Pix) {
            Pix pix = (Pix) pagamento;
            return PixResponseDTO.valueOf(pix);
        }

        if (pagamento instanceof CartaoPagamento) {
            CartaoPagamento cartao = (CartaoPagamento) pagamento;
            return CartaoResponseDTO.valueOf(cartao);
        }

        return null;
    }

}

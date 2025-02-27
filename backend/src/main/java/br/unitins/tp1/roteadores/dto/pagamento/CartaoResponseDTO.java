package br.unitins.tp1.roteadores.dto.pagamento;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import br.unitins.tp1.roteadores.model.pagamento.Cartao;
import br.unitins.tp1.roteadores.model.pagamento.CartaoPagamento;
import br.unitins.tp1.roteadores.model.pagamento.ModalidadeCartao;

public record CartaoResponseDTO(
    Long id,
    String titular,
    String numero,
    String validade,
    ModalidadeCartao modalidadeCartao
) {

    public static CartaoResponseDTO valueOf(Cartao cartao) {
        return new CartaoResponseDTO(
            cartao.getId(),
            cartao.getTitular(),
            ofuscarNumero(cartao.getNumero()),
            converterData(cartao.getDataValidade()),
            cartao.getModalidadeCartao());
    }
    
    public static CartaoResponseDTO valueOf(CartaoPagamento cartao) {
        return new CartaoResponseDTO(
            cartao.getId(),
            cartao.getTitular(),
            ofuscarNumero(cartao.getNumero()),
            converterData(cartao.getDataValidade()),
            cartao.getModalidadeCartao());
    }

    private static String ofuscarNumero(String numero) {
        if (numero.length() < 4)
            return "****";
        
        int tamanho = numero.length();

        StringBuilder ofuscado = new StringBuilder();
        for (int i = 0; i < tamanho - 4; i++) {
            if (i > 0 && i % 4 == 0) {
                ofuscado.append(" ");
            }
            ofuscado.append("*");
        }

        ofuscado.append(" ").append(numero.substring(tamanho - 4));
        return ofuscado.toString().trim();
    }

    private static String converterData(LocalDate validade) {
        String dataformatada = validade.format(DateTimeFormatter.ofPattern("MM/yyyy"));
        return dataformatada;
    }
}

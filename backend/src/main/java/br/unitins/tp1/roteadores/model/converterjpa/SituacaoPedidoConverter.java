package br.unitins.tp1.roteadores.model.converterjpa;

import br.unitins.tp1.roteadores.model.pedido.SituacaoPedido;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class SituacaoPedidoConverter implements AttributeConverter<SituacaoPedido, Integer> {

    @Override
    public Integer convertToDatabaseColumn(SituacaoPedido situacaopedido) {
        return situacaopedido == null ? null : situacaopedido.getId();
    }

    @Override
    public SituacaoPedido convertToEntityAttribute(Integer idSituacaoPedido) {
        return SituacaoPedido.valueOf(idSituacaoPedido);
    }
    
}

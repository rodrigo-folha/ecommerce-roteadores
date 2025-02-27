package br.unitins.tp1.roteadores.model.converterjpa;

import br.unitins.tp1.roteadores.model.pagamento.ModalidadeCartao;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ModalidadeCartaoConverter implements AttributeConverter<ModalidadeCartao, Integer> {

    @Override
    public Integer convertToDatabaseColumn(ModalidadeCartao modalidadecartao) {
        return modalidadecartao == null ? null : modalidadecartao.getId();
    }

    @Override
    public ModalidadeCartao convertToEntityAttribute(Integer idModalidadeCartao) {
        return ModalidadeCartao.valueOf(idModalidadeCartao);
    }
    
}

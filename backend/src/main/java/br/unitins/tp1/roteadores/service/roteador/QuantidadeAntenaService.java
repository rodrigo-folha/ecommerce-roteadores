package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.QuantidadeAntenaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.QuantidadeAntena;

public interface QuantidadeAntenaService {
    QuantidadeAntena findById(Long id);

    List<QuantidadeAntena> findByQuantidade(Integer quantidade);

    List<QuantidadeAntena> findAll();

    QuantidadeAntena create(QuantidadeAntenaRequestDTO dto);

    QuantidadeAntena update(Long id, QuantidadeAntenaRequestDTO dto);

    void delete(Long id);
}

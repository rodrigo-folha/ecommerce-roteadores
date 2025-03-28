package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.BandaFrequenciaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.BandaFrequencia;

public interface BandaFrequenciaService {
    
    BandaFrequencia findById(Long id);

    List<BandaFrequencia> findByNome(String nome, Integer page, Integer pageSize);

    List<BandaFrequencia> findAll(Integer page, Integer pageSize);

    BandaFrequencia create(BandaFrequenciaRequestDTO dto);

    BandaFrequencia update(Long id, BandaFrequenciaRequestDTO dto);

    void delete(Long id);

    long count();
    long count(String nome);
}

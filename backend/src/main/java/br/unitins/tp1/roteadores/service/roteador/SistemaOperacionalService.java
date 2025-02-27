package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.SistemaOperacionalRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.SistemaOperacional;

public interface SistemaOperacionalService {
    SistemaOperacional findById(Long id);
    
    List<SistemaOperacional> findByNome(String nome);

    List<SistemaOperacional> findAll();

    SistemaOperacional create(SistemaOperacionalRequestDTO dto);

    SistemaOperacional update(Long id, SistemaOperacionalRequestDTO dto);

    void delete(Long id);
}

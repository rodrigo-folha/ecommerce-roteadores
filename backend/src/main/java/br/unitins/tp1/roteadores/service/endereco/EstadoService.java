package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EstadoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Estado;

public interface EstadoService {

    Estado findById(Long id);

    // List<Estado> findByNome(String nome);

    // List<Estado> findAll();

    Estado create(EstadoRequestDTO dto);

    Estado update(Long id, EstadoRequestDTO dto);

    void delete(Long id);

    List<Estado> findAll(Integer page, Integer pageSize);
    List<Estado> findByNome(String nome, Integer page, Integer pageSize);

    long count();
    long count(String nome);
    
}

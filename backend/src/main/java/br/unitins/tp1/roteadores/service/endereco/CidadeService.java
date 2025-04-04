package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.CidadeRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Cidade;

public interface CidadeService {

    Cidade findById(Long id);

    List<Cidade> findByNome(String nome, Integer page, Integer pageSize);

    List<Cidade> findAll(Integer page, Integer pageSize);

    Cidade create(CidadeRequestDTO dto);

    Cidade update(Long id, CidadeRequestDTO dto);

    void delete(Long id);

    long count();
    long count(String nome);
    
}

package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Endereco;

public interface EnderecoService {

    Endereco findById(Long id);

    List<Endereco> findAll(Integer page, Integer pageSize);

    Endereco create(EnderecoRequestDTO dto);

    Endereco update(Long id, EnderecoRequestDTO dto);

    void delete(Long id);

    long count();
    
}

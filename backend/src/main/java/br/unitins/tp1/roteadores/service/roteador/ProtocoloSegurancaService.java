package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.ProtocoloSegurancaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.ProtocoloSeguranca;

public interface ProtocoloSegurancaService {
    ProtocoloSeguranca findById(Long id);

    List<ProtocoloSeguranca> findByNome(String nome, Integer page, Integer pageSize);

    List<ProtocoloSeguranca> findAll(Integer page, Integer pageSize);

    ProtocoloSeguranca create(ProtocoloSegurancaRequestDTO dto);

    ProtocoloSeguranca update(Long id, ProtocoloSegurancaRequestDTO dto);

    void delete(Long id);

    long count();
    long count(String nome);
}

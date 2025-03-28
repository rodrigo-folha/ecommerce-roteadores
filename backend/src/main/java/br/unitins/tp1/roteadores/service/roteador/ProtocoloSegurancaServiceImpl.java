package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.ProtocoloSegurancaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.ProtocoloSeguranca;
import br.unitins.tp1.roteadores.repository.ProtocoloSegurancaRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ProtocoloSegurancaServiceImpl implements ProtocoloSegurancaService{

    @Inject
    public ProtocoloSegurancaRepository protocoloSegurancaRepository;

    @Override
    public ProtocoloSeguranca findById(Long id) {
        return protocoloSegurancaRepository.findById(id);
    }

    @Override
    public List<ProtocoloSeguranca> findByNome(String nome, Integer page, Integer pageSize) {
        return protocoloSegurancaRepository.findByNome(nome).page(page, pageSize).list();
    }

    @Override
    public List<ProtocoloSeguranca> findAll(Integer page, Integer pageSize) {
        PanacheQuery<ProtocoloSeguranca> query = null;
        if (page == null || pageSize == null)
            query = protocoloSegurancaRepository.findAll();
        else
            query = protocoloSegurancaRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    @Transactional
    public ProtocoloSeguranca create(ProtocoloSegurancaRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        ProtocoloSeguranca protocoloSeguranca = new ProtocoloSeguranca();
        protocoloSeguranca.setNome(dto.nome());

        protocoloSegurancaRepository.persist(protocoloSeguranca);

        return protocoloSeguranca;
    }

    @Override
    @Transactional
    public ProtocoloSeguranca update(Long id, ProtocoloSegurancaRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (protocoloSegurancaRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");

        ProtocoloSeguranca protocoloSeguranca = protocoloSegurancaRepository.findById(id);
        protocoloSeguranca.setNome(dto.nome());

        return protocoloSeguranca;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        protocoloSegurancaRepository.deleteById(id);
    }

    @Override
    public long count() {
        return protocoloSegurancaRepository.count();
    }

    @Override
    public long count(String nome) {
        return protocoloSegurancaRepository.findByNome(nome).count();
    }   
    
}

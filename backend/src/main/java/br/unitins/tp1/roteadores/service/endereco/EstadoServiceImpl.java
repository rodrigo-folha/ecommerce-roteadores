package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EstadoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Estado;
import br.unitins.tp1.roteadores.repository.EstadoRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class EstadoServiceImpl implements EstadoService {

    @Inject
    public EstadoRepository estadoRepository;

    @Override
    public Estado findById(Long id) {
        if (estadoRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
        return estadoRepository.findById(id);
    }

    @Override
    @Transactional
    public Estado create(EstadoRequestDTO dto) {
        Estado estado = new Estado();
        estado.setNome(dto.nome());
        estado.setSigla(dto.sigla());

        estadoRepository.persist(estado);
        return estado;
    }

    @Override
    @Transactional
    public Estado update(Long id, EstadoRequestDTO dto) {
        if (estadoRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
            
        Estado estado = estadoRepository.findById(id);
        
        estado.setNome(dto.nome());
        estado.setSigla(dto.sigla());
        
        return estado;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        estadoRepository.deleteById(id);
    }

    @Override
    public List<Estado> findAll(Integer page, Integer pageSize) {
        PanacheQuery<Estado> query = null;
        if (page == null || pageSize == null)
            query = estadoRepository.findAll();
        else
            query = estadoRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    public List<Estado> findByNome(String nome, Integer page, Integer pageSize) {
        return estadoRepository.findByNome(nome).page(page, pageSize).list();
    }

    @Override
    public long count() {
        return estadoRepository.findAll().count();
    }

    @Override
    public long count(String nome) {
        return estadoRepository.findByNome(nome).count();
    }

    

    
}

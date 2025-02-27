package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EstadoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Estado;
import br.unitins.tp1.roteadores.repository.EstadoRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
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
    public List<Estado> findByNome(String nome) {
        return estadoRepository.findByNome(nome);
    }

    @Override
    public List<Estado> findAll() {
        return estadoRepository.findAll().list();
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
    
}

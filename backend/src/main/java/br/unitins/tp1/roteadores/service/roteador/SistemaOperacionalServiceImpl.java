package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.SistemaOperacionalRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.SistemaOperacional;
import br.unitins.tp1.roteadores.repository.SistemaOperacionalRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class SistemaOperacionalServiceImpl implements SistemaOperacionalService {

    @Inject
    public SistemaOperacionalRepository sistemaOperacionalRepository;

    @Inject
    public RoteadorService roteadorService;

    @Override
    public SistemaOperacional findById(Long id) {
        return sistemaOperacionalRepository.findById(id);
    }

    @Override
    public List<SistemaOperacional> findByNome(String nome, Integer page, Integer pageSize) {
        return sistemaOperacionalRepository.findByNome(nome).page(page, pageSize).list();
    }

    @Override
    public List<SistemaOperacional> findAll(Integer page, Integer pageSize) {
        PanacheQuery<SistemaOperacional> query = null;
        if (page == null || pageSize == null)
            query = sistemaOperacionalRepository.findAll();
        else
            query = sistemaOperacionalRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    public long count() {
        return sistemaOperacionalRepository.count();
    }

    @Override
    public long count(String nome) {
        return sistemaOperacionalRepository.findByNome(nome).count();
    }


    @Override
    @Transactional
    public SistemaOperacional create(SistemaOperacionalRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        SistemaOperacional sistemaOperacional = new SistemaOperacional();
        sistemaOperacional.setNome(dto.nome());
    
        sistemaOperacionalRepository.persist(sistemaOperacional);

        return sistemaOperacional;
    }

    @Override
    @Transactional
    public SistemaOperacional update(Long id, SistemaOperacionalRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (sistemaOperacionalRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
            
        SistemaOperacional sistemaOperacional = sistemaOperacionalRepository.findById(id);

        sistemaOperacional.setNome(dto.nome());

        return sistemaOperacional;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        // List<Roteador> roteadores = roteadorService.findBySistemaOperacional(id);
        // if (!roteadores.isEmpty())
        //     throw new ValidationException("id", "O idSistemaOperacional esta sendo utilizado por outras tabelas, nao é possivel deletar");

        // if (sistemaOperacionalRepository.findById(id) == null)
        //     throw new ValidationException("id", "id nao encontrado");
            
        sistemaOperacionalRepository.deleteById(id);
    }
    
}

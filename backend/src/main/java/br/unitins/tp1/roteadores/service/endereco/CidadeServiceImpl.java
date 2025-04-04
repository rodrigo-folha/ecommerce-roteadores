package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.CidadeRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Cidade;
import br.unitins.tp1.roteadores.repository.CidadeRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CidadeServiceImpl implements CidadeService {

    @Inject
    public CidadeRepository cidadeRepository;

    @Inject
    public EstadoService estadoService;

    @Override
    public Cidade findById(Long id) {
        if (cidadeRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
        return cidadeRepository.findById(id);
    }

    @Override
    public List<Cidade> findByNome(String nome, Integer page, Integer pageSize) {
        return cidadeRepository.findByNome(nome).page(page, pageSize).list();
    }

    @Override
    public List<Cidade> findAll(Integer page, Integer pageSize) {
        PanacheQuery<Cidade> query = null;
        if (page == null || pageSize == null)
            query = cidadeRepository.findAll();
        else
            query = cidadeRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    @Transactional
    public Cidade create(CidadeRequestDTO dto) {
        if (estadoService.findById(dto.idEstado()) == null)
            throw new ValidationException("idEstado", "O id do estado nao foi encontrado");

        Cidade cidade = new Cidade();
        cidade.setNome(dto.nome());
        cidade.setEstado(estadoService.findById(dto.idEstado()));
        cidadeRepository.persist(cidade);

        return cidade;
    }

    @Override
    @Transactional
    public Cidade update(Long id, CidadeRequestDTO dto) {
        if (cidadeRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");

        if (estadoService.findById(dto.idEstado()) == null)
            throw new ValidationException("idEstado", "O id do estado nao foi encontrado");
            
        Cidade cidade = cidadeRepository.findById(id);
        cidade.setNome(dto.nome());
        cidade.setEstado(estadoService.findById(dto.idEstado()));
        return cidade;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        cidadeRepository.deleteById(id);
    }

    @Override
    public long count() {
        return cidadeRepository.findAll().count();
    }

    @Override
    public long count(String nome) {
        return cidadeRepository.findByNome(nome).count();
    }
    
}

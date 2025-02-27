package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.CidadeRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Cidade;
import br.unitins.tp1.roteadores.repository.CidadeRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
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
    public List<Cidade> findByNome(String nome) {
        return cidadeRepository.findByNome(nome);
    }

    @Override
    public List<Cidade> findAll() {
        return cidadeRepository.findAll().list();
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
    
}

package br.unitins.tp1.roteadores.service.endereco;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Endereco;
import br.unitins.tp1.roteadores.repository.EnderecoRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class EnderecoServiceImpl implements EnderecoService {

    @Inject
    public EnderecoRepository enderecoRepository;

    @Inject
    public EstadoService estadoService;

    @Inject
    public CidadeService cidadeService;

    @Override
    public Endereco findById(Long id) {
        if (enderecoRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
        return enderecoRepository.findById(id);
    }

    @Override
    public List<Endereco> findAll(Integer page, Integer pageSize) {
        PanacheQuery<Endereco> query = null;
        if (page == null || pageSize == null)
            query = enderecoRepository.findAll();
        else
            query = enderecoRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    @Transactional
    public Endereco create(EnderecoRequestDTO dto) {
        if (cidadeService.findById(dto.idCidade()) == null)
            throw new ValidationException("idEstado", "O id da cidade nao foi encontrado");

        Endereco endereco = new Endereco();
        endereco.setLogradouro(dto.logradouro());
        endereco.setComplemento(dto.complemento());
        endereco.setNumero(dto.numero());
        endereco.setBairro(dto.bairro());
        endereco.setCep(dto.cep());
        endereco.setCidade(cidadeService.findById(dto.idCidade()));
        enderecoRepository.persist(endereco);

        return endereco;
    }

    @Override
    @Transactional
    public Endereco update(Long id, EnderecoRequestDTO dto) {
        if (enderecoRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");

        if (estadoService.findById(dto.idCidade()) == null)
            throw new ValidationException("idCidade", "O id da cidade nao foi encontrado");
            
        Endereco endereco = enderecoRepository.findById(id);
        endereco.setLogradouro(dto.logradouro());
        endereco.setComplemento(dto.complemento());
        endereco.setNumero(dto.numero());
        endereco.setBairro(dto.bairro());
        endereco.setCep(dto.cep());
        endereco.setCidade(cidadeService.findById(dto.idCidade()));

        return endereco;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        enderecoRepository.deleteById(id);
    }

    @Override
    public long count() {
        return enderecoRepository.findAll().count();
    }
    
}

package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.QuantidadeAntenaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.QuantidadeAntena;
import br.unitins.tp1.roteadores.repository.QuantidadeAntenaRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class QuantidadeAntenaServiceImpl implements QuantidadeAntenaService {

    @Inject
    public QuantidadeAntenaRepository quantidadeAntenaRepository;

    @Override
    public QuantidadeAntena findById(Long id) {
        return quantidadeAntenaRepository.findById(id);
    }

    @Override
    public List<QuantidadeAntena> findByQuantidade(Integer quantidade, Integer page, Integer pageSize) {
        return quantidadeAntenaRepository.findByQuantidade(quantidade).page(page, pageSize).list();
    }

    @Override
    public List<QuantidadeAntena> findAll(Integer page, Integer pageSize) {
        PanacheQuery<QuantidadeAntena> query = null;
        if (page == null || pageSize == null)
            query = quantidadeAntenaRepository.findAll();
        else
            query = quantidadeAntenaRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    @Transactional
    public QuantidadeAntena create(QuantidadeAntenaRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        QuantidadeAntena quantidadeAntena = new QuantidadeAntena();
        quantidadeAntena.setQuantidade(dto.quantidade());

        quantidadeAntenaRepository.persist(quantidadeAntena);

        return quantidadeAntena;
    }

    @Override
    @Transactional
    public QuantidadeAntena update(Long id, QuantidadeAntenaRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (quantidadeAntenaRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
            
        QuantidadeAntena quantidadeAntena = quantidadeAntenaRepository.findById(id);
        quantidadeAntena.setQuantidade(dto.quantidade());

        return quantidadeAntena;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        quantidadeAntenaRepository.deleteById(id);
    }
    
    @Override
    public long count() {
        return quantidadeAntenaRepository.count();
    }

    @Override
    public long count(Integer quantidade) {
        return quantidadeAntenaRepository.findByQuantidade(quantidade).count();
    }   

}

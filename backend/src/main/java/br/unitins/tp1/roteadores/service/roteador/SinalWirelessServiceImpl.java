package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.SinalWirelessRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.SinalWireless;
import br.unitins.tp1.roteadores.repository.SinalWirelessRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class SinalWirelessServiceImpl implements SinalWirelessService {

    @Inject
    public SinalWirelessRepository sinalwirelessRepository;

    @Override
    public SinalWireless findById(Long id) {
        return sinalwirelessRepository.findById(id);
    }

    @Override
    public List<SinalWireless> findByNome(String nome, Integer page, Integer pageSize) {
        return sinalwirelessRepository.findByNome(nome).page(page, pageSize).list();
    }

    @Override
    public List<SinalWireless> findAll(Integer page, Integer pageSize) {
        PanacheQuery<SinalWireless> query = null;
        if (page == null || pageSize == null)
            query = sinalwirelessRepository.findAll();
        else
            query = sinalwirelessRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    @Transactional
    public SinalWireless create(SinalWirelessRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        SinalWireless sinalwireless = new SinalWireless();
        sinalwireless.setNome(dto.nome());

        sinalwirelessRepository.persist(sinalwireless);
        return sinalwireless;
    }

    @Override
    @Transactional
    public SinalWireless update(Long id, SinalWirelessRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (sinalwirelessRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
        SinalWireless sinalwireless = sinalwirelessRepository.findById(id);
        
        sinalwireless.setNome(dto.nome());
        
        return sinalwireless;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        sinalwirelessRepository.deleteById(id);
    }

    @Override
    public long count() {
        return sinalwirelessRepository.count();
    }

    @Override
    public long count(String nome) {
        return sinalwirelessRepository.findByNome(nome).count();
    }   

 
    
}

package br.unitins.tp1.roteadores.service.pedido;

import java.util.List;

import br.unitins.tp1.roteadores.dto.pedido.LoteRequestDTO;
import br.unitins.tp1.roteadores.model.pedido.Lote;
import br.unitins.tp1.roteadores.repository.LoteRepository;
import br.unitins.tp1.roteadores.service.roteador.RoteadorService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class LoteServiceImpl implements LoteService {

    @Inject
    public LoteRepository loteRepository;

    @Inject
    public RoteadorService roteadorService;

    @Override
    public Lote findById(Long id) {
        if (loteRepository.findById(id) == null)
            throw new ValidationException("id", "id nao encontrado");
        
        return loteRepository.findById(id);
    }

    @Override
    public Lote findByIdRoteador(Long idRoteador) {
        if (loteRepository.findByIdRoteador(idRoteador) == null)
            throw new ValidationException("idRoteador", "id do roteador nao encontrado.");

        return loteRepository.findByIdRoteador(idRoteador);
    }

    @Override
    public List<Lote> findByIdRoteadorQtdeTotal(Long idRoteador) {
        return loteRepository.findByIdRoteadorQtdeTotal(idRoteador);
    }

    @Override
    public Lote findByCodigo(String codigo) {
        if (loteRepository.findByCodigo(codigo) == null)
            throw new ValidationException("codigo", "Codigo nao encontrado");
        
        return loteRepository.findByCodigo(codigo);
    } 

    @Override
    public List<Lote> findAll() {
        return loteRepository.findAll().list();
    }

    @Override
    @Transactional
    public Lote create(LoteRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (loteRepository.findByIdRoteador(dto.idRoteador()) == null)
            throw new ValidationException("idRoteador", "id do roteador nao encontrado.");

        // buscando o estado a partir de um id do lote
        Lote lote = new Lote();
        lote.setRoteador(roteadorService.findById(dto.idRoteador()));
        lote.setCodigo(dto.codigo());
        lote.setData(dto.data());
        lote.setEstoque(dto.estoque());

        // salvando o lote
        loteRepository.persist(lote);

        return lote;
    }

    @Override
    @Transactional
    public Lote update(Long id, LoteRequestDTO dto) {
        if (loteRepository.findById(id) == null)
            throw new ValidationException("id", "id nao encontrado");

        if (loteRepository.findByIdRoteador(dto.idRoteador()) == null)
            throw new ValidationException("idRoteador", "id do roteador nao encontrado.");

        Lote lote = loteRepository.findById(id);

        lote.setRoteador(roteadorService.findById(dto.idRoteador()));
        lote.setCodigo(dto.codigo());
        lote.setData(dto.data());
        lote.setEstoque(dto.estoque());
        
        return lote;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (loteRepository.findById(id) == null)
            throw new ValidationException("id", "id nao encontrado");
            
        loteRepository.deleteById(id);
    }
    
}

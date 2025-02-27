package br.unitins.tp1.roteadores.service.pedido;

import java.util.List;

import br.unitins.tp1.roteadores.dto.pedido.CupomDescontoRequestDTO;
import br.unitins.tp1.roteadores.model.pedido.CupomDesconto;
import br.unitins.tp1.roteadores.repository.CupomDescontoRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CupomDescontoServiceImpl implements CupomDescontoService {

    @Inject
    public CupomDescontoRepository cupomdescontoRepository;

    @Override
    public CupomDesconto findById(Long id) {
        return cupomdescontoRepository.findById(id);
    }

    @Override
    public CupomDesconto findByCodigo(String codigo) {   
        return cupomdescontoRepository.findByCodigo(codigo);
    } 

    @Override
    public List<CupomDesconto> findAll() {
        return cupomdescontoRepository.findAll().list();
    }

    @Override
    @Transactional
    public CupomDesconto create(CupomDescontoRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        // buscando o estado a partir de um id do cupomdesconto
        if (cupomdescontoRepository.findByCodigo(dto.codigo()) != null)
            throw new ValidationException("codigo", "O cupom com este codigo ja existe, cadastre outro");

        if (dto.percentualDesconto() < 0)
            throw new ValidationException("percentualDesconto", "O percentual de desconto nao pode ser negativo");

        CupomDesconto cupomdesconto = new CupomDesconto();
        cupomdesconto.setCodigo(dto.codigo());
        cupomdesconto.setPercentualDesconto(dto.percentualDesconto());
        cupomdesconto.setValidade(dto.validade());

        // salvando o cupomdesconto
        cupomdescontoRepository.persist(cupomdesconto);

        return cupomdesconto;
    }

    @Override
    @Transactional
    public CupomDesconto update(Long id, CupomDescontoRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");

        CupomDesconto cupomdesconto = cupomdescontoRepository.findById(id);

        if (cupomdesconto == null)
            throw new ValidationException("id", "Id nao encontrado");

        if (cupomdescontoRepository.findByCodigo(dto.codigo()) != null && (!dto.codigo().equals(cupomdesconto.getCodigo())))
            throw new ValidationException("codigo", "O cupom com este codigo ja existe, cadastre outro");

        if (dto.percentualDesconto() < 0)
            throw new ValidationException("percentualDesconto", "O percentual de desconto nao pode ser negativo");
            
        cupomdesconto.setCodigo(dto.codigo());
        cupomdesconto.setPercentualDesconto(dto.percentualDesconto());
        cupomdesconto.setValidade(dto.validade());
        
        return cupomdesconto;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (cupomdescontoRepository.findById(id) == null)
            throw new ValidationException("id", "id nao encontrado");
            
        cupomdescontoRepository.deleteById(id);
    }
    
}

package br.unitins.tp1.roteadores.service.pedido;

import java.util.List;

import br.unitins.tp1.roteadores.dto.pedido.CupomDescontoRequestDTO;
import br.unitins.tp1.roteadores.model.pedido.CupomDesconto;

public interface CupomDescontoService {
    
    CupomDesconto findById(Long id);

    CupomDesconto findByCodigo(String codigo);
    
    List<CupomDesconto> findAll();

    CupomDesconto create(CupomDescontoRequestDTO dto);

    CupomDesconto update(Long id, CupomDescontoRequestDTO dto);

    void delete(Long id); 
}

package br.unitins.tp1.roteadores.service.pedido;

import java.util.List;

import br.unitins.tp1.roteadores.dto.pedido.LoteRequestDTO;
import br.unitins.tp1.roteadores.model.pedido.Lote;

public interface LoteService {
    
    Lote findById(Long id);

    Lote findByCodigo(String codigo);

    Lote findByIdRoteador(Long idRoteador);

    List<Lote> findByIdRoteadorQtdeTotal(Long idRoteador);
    
    List<Lote> findAll();

    Lote create(LoteRequestDTO dto);

    Lote update(Long id, LoteRequestDTO dto);

    void delete(Long id); 
}

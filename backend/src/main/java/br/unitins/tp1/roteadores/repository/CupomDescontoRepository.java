package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.pedido.CupomDesconto;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CupomDescontoRepository implements PanacheRepository<CupomDesconto> {

    public CupomDesconto findByCodigo(String codigo) {
        return find("SELECT c FROM CupomDesconto c WHERE c.codigo = ?1", codigo).firstResult();
    }
    
}

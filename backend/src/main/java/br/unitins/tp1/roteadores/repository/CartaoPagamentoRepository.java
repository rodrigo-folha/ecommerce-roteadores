package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.pagamento.CartaoPagamento;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CartaoPagamentoRepository implements PanacheRepository<CartaoPagamento> {
    
}

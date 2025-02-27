package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.pedido.Pedido;
import br.unitins.tp1.roteadores.model.pedido.SituacaoPedido;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PedidoRepository implements PanacheRepository<Pedido> {
    public List<Pedido> findByCliente (Long idCliente) {
        return find("SELECT p FROM Pedido p WHERE p.cliente.id = ?1", idCliente).list();
    }  
    
    public List<Pedido> findByEmail (String email) {
        return find("SELECT p FROM Pedido p JOIN p.cliente c JOIN c.usuario u WHERE u.email LIKE ?1", "%" + email + "%").list();
    }

    public List<Pedido> findPedidoSemPagamentoNaoCancelado() {
        return find("SELECT p FROM Pedido p JOIN p.statusPedido s WHERE s.situacaoPedido != ?1 AND p.pagamento IS NULL", SituacaoPedido.CANCELADO).list();
    }
}

package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.pedido.Lote;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LoteRepository implements PanacheRepository<Lote> {
    public Lote findByIdRoteador(Long idRoteador) {
        StringBuffer jpql = new StringBuffer();
        jpql.append("SELECT ");
        jpql.append("l ");
        jpql.append("FROM ");
        jpql.append("Lote l ");
        jpql.append("WHERE ");
        jpql.append("l.roteador.id = ?1 ");
        jpql.append("AND l.estoque > 0 ");
        jpql.append("ORDER BY l.data ");

        return find(jpql.toString(), idRoteador).firstResult();
    }

    public List<Lote> findByIdRoteadorQtdeTotal(Long idRoteador) {
        StringBuffer jpql = new StringBuffer();
        jpql.append("SELECT ");
        jpql.append("l ");
        jpql.append("FROM ");
        jpql.append("Lote l ");
        jpql.append("WHERE ");
        jpql.append("l.roteador.id = ?1 ");
        jpql.append("AND l.estoque > 0 ");
        jpql.append("ORDER BY l.data ");

        return find(jpql.toString(), idRoteador).list();
    }

    public Lote findByCodigo(String codigo) {
        StringBuffer jpql = new StringBuffer();
        jpql.append("SELECT ");
        jpql.append("l ");
        jpql.append("FROM ");
        jpql.append("Lote l ");
        jpql.append("WHERE ");
        jpql.append("l.codigo = ?1 ");

        return find(jpql.toString(), codigo).firstResult();
    }
}

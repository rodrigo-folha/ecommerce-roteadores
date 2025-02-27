package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.QuantidadeAntena;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class QuantidadeAntenaRepository implements PanacheRepository<QuantidadeAntena> {
    public List<QuantidadeAntena> findByQuantidade(Integer quantidade) {
        return find("quantidade = ?1", quantidade).list();
    }
}

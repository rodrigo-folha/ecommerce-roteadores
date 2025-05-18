package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.roteador.ProtocoloSeguranca;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProtocoloSegurancaRepository implements PanacheRepository<ProtocoloSeguranca> {
    public PanacheQuery<ProtocoloSeguranca> findByNome (String nome) {
        return find("nome ILIKE ?1", "%" + nome + "%");
    }    
}

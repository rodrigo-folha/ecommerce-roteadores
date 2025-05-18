package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.roteador.SistemaOperacional;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SistemaOperacionalRepository implements PanacheRepository<SistemaOperacional>{
    public PanacheQuery<SistemaOperacional> findByNome(String nome) {
        return find("SELECT s FROM SistemaOperacional s WHERE s.nome ILIKE ?1", "%" + nome + "%");
    }
    
}

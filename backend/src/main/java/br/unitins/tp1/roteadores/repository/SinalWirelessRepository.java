package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.roteador.SinalWireless;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SinalWirelessRepository implements PanacheRepository<SinalWireless> {
    public PanacheQuery<SinalWireless> findByNome(String nome) {
        return find("SELECT s FROM SinalWireless s WHERE s.nome LIKE ?1", "%" + nome + "%");
    }    
    
}

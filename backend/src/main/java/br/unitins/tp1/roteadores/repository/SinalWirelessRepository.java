package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.SinalWireless;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SinalWirelessRepository implements PanacheRepository<SinalWireless> {

    public List<SinalWireless> findByNome(String nome) {
        return find("SELECT s FROM SinalWireless s WHERE s.nome LIKE ?1", "%" + nome + "%").list();
    }    
    
}

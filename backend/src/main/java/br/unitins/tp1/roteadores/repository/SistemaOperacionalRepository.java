package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.SistemaOperacional;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SistemaOperacionalRepository implements PanacheRepository<SistemaOperacional>{
    public List<SistemaOperacional> findByNome(String nome) {
        return find("SELECT s FROM SistemaOperacional s WHERE s.nome like ?1", "%" + nome + "%").list();
    }
    
}

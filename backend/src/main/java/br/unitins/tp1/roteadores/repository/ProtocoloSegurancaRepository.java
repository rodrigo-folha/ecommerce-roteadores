package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.ProtocoloSeguranca;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProtocoloSegurancaRepository implements PanacheRepository<ProtocoloSeguranca> {
    public List<ProtocoloSeguranca> findByNome (String nome) {
        return find("nome LIKE ?1", "%" + nome + "%").list();
    }    
}

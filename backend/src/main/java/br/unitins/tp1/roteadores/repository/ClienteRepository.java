package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.usuario.Cliente;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ClienteRepository implements PanacheRepository<Cliente> {
    public PanacheQuery<Cliente> findByNome (String nome) {
        return find("SELECT c FROM Cliente c JOIN c.usuario u WHERE u.nome LIKE ?1", "%" + nome + "%");
    }   
    
    public Cliente findByUsuario (String email) {
        return find("SELECT c FROM Cliente c JOIN c.usuario u WHERE u.email = ?1", email).firstResult();
    }
    
    public List<Cliente> findByEmail (String email) {
        return find("SELECT c FROM Cliente c JOIN c.usuario u WHERE u.email LIKE ?1", "%" + email + "%").list();
    }   
}

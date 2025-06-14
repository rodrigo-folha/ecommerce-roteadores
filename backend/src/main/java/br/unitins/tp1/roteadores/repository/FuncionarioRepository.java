package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.usuario.Funcionario;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FuncionarioRepository implements PanacheRepository<Funcionario> {
    public PanacheQuery<Funcionario> findByNome (String nome) {
        return find("SELECT f FROM Funcionario f JOIN f.usuario u WHERE u.nome ILIKE ?1", "%" + nome + "%");
    }   
    
    public Funcionario findByUsuario (String email) {
        return find("SELECT f FROM Funcionario f JOIN f.usuario u WHERE u.email = ?1", email).firstResult();
    }   

    public List<Funcionario> findByEmail (String email) {
        return find("SELECT f FROM Funcionario f JOIN f.usuario u WHERE u.email ILIKE ?1", "%" + email + "%").list();
    }  
}

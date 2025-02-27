package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.usuario.Funcionario;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FuncionarioRepository implements PanacheRepository<Funcionario> {
    public List<Funcionario> findByNome (String nome) {
        return find("SELECT f FROM Funcionario f JOIN f.usuario u WHERE u.nome LIKE ?1", "%" + nome + "%").list();
    }   
    
    public Funcionario findByUsuario (String email) {
        return find("SELECT f FROM Funcionario f JOIN f.usuario u WHERE u.email = ?1", email).firstResult();
    }   

    public List<Funcionario> findByEmail (String email) {
        return find("SELECT f FROM Funcionario f JOIN f.usuario u WHERE u.email LIKE ?1", "%" + email + "%").list();
    }  
}

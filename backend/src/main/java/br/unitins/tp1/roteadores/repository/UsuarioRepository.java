package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.usuario.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {
    public Usuario findByEmailAndSenha (String email, String senha) {
        return find("SELECT u FROM Usuario u WHERE u.email = ?1 AND u.senha = ?2", email, senha).firstResult();
    }   
    
    public Usuario findByEmail (String email) {
        return find("SELECT u FROM Usuario u WHERE u.email =?1", email).firstResult();
    } 

    public Usuario findByCpf (String cpf) {
        return find ("SELECT u FROM Usuario u WHERE u.cpf = ?1", cpf).firstResult();
    }
}

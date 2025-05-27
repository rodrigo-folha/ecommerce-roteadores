package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.endereco.Endereco;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EnderecoRepository implements PanacheRepository<Endereco> {

    public PanacheQuery<Endereco> findByUsername(String login) {
        return find("SELECT e FROM Endereco e JOIN usuario u WHERE u.enderecos = ?1", login );
    }

    // public PanacheQuery<Cliente> findByNome (String nome) {
    //     return find("SELECT c FROM Cliente c JOIN c.usuario u WHERE u.nome ILIKE ?1", "%" + nome + "%");
    // }   
    
}

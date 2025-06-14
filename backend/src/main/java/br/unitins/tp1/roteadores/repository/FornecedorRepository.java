package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.Fornecedor;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FornecedorRepository implements PanacheRepository<Fornecedor> {

    public PanacheQuery<Fornecedor> findByNome(String nome) {
        return find("nome ILIKE ?1", "%" + nome + "%");
    }

    public List<Fornecedor> findByCnpj(String cnpj) {
        return find("cnpj LIKE ?1", "%" + cnpj + "%").list();
    }

    public List<Fornecedor> findByEmail(String email) {
        return find("email ILIKE ?1", "%" + email + "%").list();
    }
    
}

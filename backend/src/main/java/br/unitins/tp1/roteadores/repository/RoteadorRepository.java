package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.Roteador;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoteadorRepository implements PanacheRepository<Roteador> {

    public List<Roteador> findByNome(String nome) {
        return find("SELECT r FROM Roteador r WHERE r.nome LIKE ?1", "%" + nome + "%").list();
    }

    public List<Roteador> findBySinalWireless(Long id) {
        return find("sinalWireless.id = ?1", id).list();
    }

    public List<Roteador> findBySistemaOperacional(Long id) {
        return find("sistemaOperacional.id = ?1", id).list();
    }

    public List<Roteador> findByBandaFrequencia(Long id) {
        return find("bandaFrequencia.id = ?1", id).list();
    }

    public List<Roteador> findByProtocoloSeguranca(Long id) {
        return find("protocoloSeguranca.id = ?1", id).list();
    }

    public List<Roteador> findByQuantidadeAntena(Long id) {
        return find("SELECT r FROM Roteador r WHERE r.quantidadeAntena.id = ?1", id).list();
    }

    public List<Roteador> findByPreco(Double min, Double max) {
        return find("preco BETWEEN ?1 AND ?2", min, max).list();
    }

}

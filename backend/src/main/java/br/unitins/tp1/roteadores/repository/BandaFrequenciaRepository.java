package br.unitins.tp1.roteadores.repository;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.BandaFrequencia;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class BandaFrequenciaRepository implements PanacheRepository<BandaFrequencia> {
    public List<BandaFrequencia> findByNome (String nome) {
        return find("SELECT b FROM BandaFrequencia b WHERE b.nome LIKE ?1", "%" + nome + "%").list();
    }    
}

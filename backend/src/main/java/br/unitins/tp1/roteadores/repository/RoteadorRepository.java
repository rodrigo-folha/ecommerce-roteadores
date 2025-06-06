package br.unitins.tp1.roteadores.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.unitins.tp1.roteadores.dto.roteador.RoteadorFiltroRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.Roteador;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoteadorRepository implements PanacheRepository<Roteador> {

    public PanacheQuery<Roteador> findByNome(String nome) {
        return find("SELECT r FROM Roteador r WHERE r.nome ILIKE ?1", "%" + nome + "%");
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

    public PanacheQuery<Roteador> buscarComFiltros(RoteadorFiltroRequestDTO filtros) {
        var jpql = new StringBuilder("FROM Roteador r WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (filtros == null) {
            return find("FROM Roteador r ORDER BY r.preco ASC");
        }

        if (filtros.precoMin() != null) {
            jpql.append("AND r.preco >= :precoMin ");
            params.put("precoMin", filtros.precoMin());
        }

        if (filtros.precoMax() != null) {
            jpql.append("AND r.preco <= :precoMax ");
            params.put("precoMax", filtros.precoMax());
        }

        if (filtros.protocolosSeguranca() != null && !filtros.protocolosSeguranca().isEmpty()) {
            jpql.append("AND r.protocoloSeguranca.id IN :protocolos ");
            params.put("protocolos", filtros.protocolosSeguranca());
        }

        if (filtros.sistemasOperacionais() != null && !filtros.sistemasOperacionais().isEmpty()) {
            jpql.append("AND r.sistemaOperacional.id IN :sistemas ");
            params.put("sistemas", filtros.sistemasOperacionais());
        }

        if (filtros.bandasFrequencia() != null && !filtros.bandasFrequencia().isEmpty()) {
            jpql.append("AND r.bandaFrequencia.id IN :bandas ");
            params.put("bandas", filtros.bandasFrequencia());
        }

        if (filtros.qtdAntenas() != null && !filtros.qtdAntenas().isEmpty()) {
            jpql.append("AND r.quantidadeAntena.id IN :antenas ");
            params.put("antenas", filtros.qtdAntenas());
        }

        if (filtros.sinaisWireless() != null && !filtros.sinaisWireless().isEmpty()) {
            jpql.append("AND r.sinalWireless.id IN :sinais ");
            params.put("sinais", filtros.sinaisWireless());
        }

        String orderClause = filtros.sortBy() != null && filtros.sortBy().equalsIgnoreCase("preco-desc")
                ? " ORDER BY r.preco DESC"
                : " ORDER BY r.preco ASC";
        jpql.append(orderClause);

        return find(jpql.toString(), params);
    }


}

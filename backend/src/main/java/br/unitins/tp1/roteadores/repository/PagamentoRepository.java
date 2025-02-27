package br.unitins.tp1.roteadores.repository;

import br.unitins.tp1.roteadores.model.pagamento.Boleto;
import br.unitins.tp1.roteadores.model.pagamento.Pagamento;
import br.unitins.tp1.roteadores.model.pagamento.Pix;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PagamentoRepository implements PanacheRepository<Pagamento> {

    public Boleto findByBoleto(Long idBoleto) {
        return find("SELECT p FROM Pagamento p WHERE TYPE(p) = Boleto AND p.id = ?1", idBoleto).firstResult();
    }

    public Pix findByPix(Long idPix) {
        return find("SELECT p FROM Pagamento p WHERE TYPE(p) = Pix AND p.id = ?1", idPix).firstResult();
    }

}

package br.unitins.tp1.roteadores.model.pagamento;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;

@Entity
public class Boleto extends Pagamento {

    private String codigoBarras;
    private LocalDateTime validade;

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public LocalDateTime getValidade() {
        return validade;
    }

    public void setValidade(LocalDateTime validade) {
        this.validade = validade;
    }

}

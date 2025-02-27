package br.unitins.tp1.roteadores.model.pedido;

import java.time.LocalDate;

import br.unitins.tp1.roteadores.model.DefaultEntity;
import jakarta.persistence.Entity;

@Entity
public class CupomDesconto extends DefaultEntity {

    private String codigo;
    private Double percentualDesconto;
    private LocalDate validade;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Double getPercentualDesconto() {
        return percentualDesconto;
    }

    public void setPercentualDesconto(Double percentualDesconto) {
        this.percentualDesconto = percentualDesconto;
    }

    public LocalDate getValidade() {
        return validade;
    }

    public void setValidade(LocalDate validade) {
        this.validade = validade;
    }

}

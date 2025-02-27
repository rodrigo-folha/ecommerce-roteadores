package br.unitins.tp1.roteadores.model.pedido;

import java.time.LocalDate;

import br.unitins.tp1.roteadores.model.DefaultEntity;
import br.unitins.tp1.roteadores.model.roteador.Roteador;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Lote extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "id_roteador")
    private Roteador roteador;
    private LocalDate data;
    private String codigo;
    private Integer estoque;

    public Roteador getRoteador() {
        return roteador;
    }

    public void setRoteador(Roteador roteador) {
        this.roteador = roteador;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

}

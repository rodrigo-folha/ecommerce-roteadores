package br.unitins.tp1.roteadores.model.endereco;

import br.unitins.tp1.roteadores.model.DefaultEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Estado extends DefaultEntity {
    @Column(length = 60, nullable = false)
    private String nome;

    @Column(length = 2, nullable = false)
    private String sigla;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

}

package br.unitins.tp1.roteadores.model.roteador;

import br.unitins.tp1.roteadores.model.DefaultEntity;
import jakarta.persistence.Entity;

@Entity
public class BandaFrequencia extends DefaultEntity {
    private String nome;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

}

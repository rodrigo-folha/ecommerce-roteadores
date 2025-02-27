package br.unitins.tp1.roteadores.model.pagamento;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;

@Entity
public class Pix extends Pagamento {

    private String chave;
    private LocalDateTime validade;

    public String getChave() {
        return chave;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }

    public LocalDateTime getValidade() {
        return validade;
    }

    public void setValidade(LocalDateTime validade) {
        this.validade = validade;
    }

}

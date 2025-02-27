package br.unitins.tp1.roteadores.model.pedido;

import java.time.LocalDateTime;

import br.unitins.tp1.roteadores.model.DefaultEntity;
import jakarta.persistence.Entity;

@Entity
public class StatusPedido extends DefaultEntity {

    private LocalDateTime dataAtualizacao;
    private SituacaoPedido situacaoPedido;

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public SituacaoPedido getSituacaoPedido() {
        return situacaoPedido;
    }

    public void setSituacaoPedido(SituacaoPedido situacaoPedido) {
        this.situacaoPedido = situacaoPedido;
    }

}

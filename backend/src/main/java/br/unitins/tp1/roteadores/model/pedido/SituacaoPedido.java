package br.unitins.tp1.roteadores.model.pedido;

public enum SituacaoPedido {

    AGUARDANDO_PAGAMENTO(1, "Aguardando Pagamento"),
    PAGAMENTO_AUTORIZADO(2, "Pagamento Autorizado"),
    PAGAMENTO_EXPIRADO(3, "Pagamento Expirado"),
    CANCELADO(4, "Cancelado"),
    ENVIADO(5, "Enviado"),
    ENTREGUE(6, "Entregue"),
    DEVOLVIDO(7, "Devolvido");

    private final Integer id;
    private final String label;

    SituacaoPedido(Integer id, String label) {
        this.id = id;
        this.label = label;
    }

    public Integer getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public static SituacaoPedido valueOf(Integer id) {
        if (id == null)
            return null;
        for (SituacaoPedido sp : SituacaoPedido.values()) {
            if (sp.getId().equals(id))
                return sp;
        }
        throw new IllegalArgumentException("Id inválido");
    }
}

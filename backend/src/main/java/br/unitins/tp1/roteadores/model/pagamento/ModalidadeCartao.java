package br.unitins.tp1.roteadores.model.pagamento;

public enum ModalidadeCartao {

    CREDITO(1, "Credito"),
    DEBITO(2, "Debito");

    private final Integer id;
    private final String label;

    ModalidadeCartao(Integer id, String label) {
        this.id = id;
        this.label = label;
    }

    public Integer getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public static ModalidadeCartao valueOf(Integer id) {
        if (id == null)
            return null;
        for (ModalidadeCartao mc : ModalidadeCartao.values()) {
            if (mc.getId().equals(id))
                return mc;
        }
        throw new IllegalArgumentException("Id inválido");
    }
}

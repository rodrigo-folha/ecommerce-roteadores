package br.unitins.tp1.roteadores.model.pagamento;

import java.time.LocalDate;

import jakarta.persistence.Entity;

@Entity
public class CartaoPagamento extends Pagamento {

    private String titular;
    private String cpfCartao;
    private String numero;
    private LocalDate dataValidade;
    private String cvc;

    private ModalidadeCartao modalidadeCartao;

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public String getCpfCartao() {
        return cpfCartao;
    }

    public void setCpfCartao(String cpfCartao) {
        this.cpfCartao = cpfCartao;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public String getCvc() {
        return cvc;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    public ModalidadeCartao getModalidadeCartao() {
        return modalidadeCartao;
    }

    public void setModalidadeCartao(ModalidadeCartao modalidadeCartao) {
        this.modalidadeCartao = modalidadeCartao;
    }

}

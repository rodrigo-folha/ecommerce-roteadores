package br.unitins.tp1.roteadores.model.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.model.DefaultEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Roteador extends DefaultEntity {

    @Column(length = 255, nullable = false)
    private String nome;

    @Column(length = 1000, nullable = false)
    private String descricao;

    @Column(nullable = false)
    private Double preco;

    @ManyToOne
    @JoinColumn(name = "id_sinalWireless")
    private SinalWireless sinalWireless;

    @ManyToOne
    @JoinColumn(name = "id_sistemaOperacional")
    private SistemaOperacional sistemaOperacional;

    @ManyToOne
    @JoinColumn(name = "id_bandaFrequencia")
    private BandaFrequencia bandaFrequencia;

    @ManyToOne
    @JoinColumn(name = "id_protocoloSeguranca")
    private ProtocoloSeguranca protocoloSeguranca;

    @ManyToOne
    @JoinColumn(name = "id_quantidadeAntena")
    private QuantidadeAntena quantidadeAntena;

    @ElementCollection
    @CollectionTable(name = "imagem_roteador", joinColumns = @JoinColumn(name = "id_roteador"))
    private List<String> listaImagem;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public SinalWireless getSinalWireless() {
        return sinalWireless;
    }

    public void setSinalWireless(SinalWireless sinalWireless) {
        this.sinalWireless = sinalWireless;
    }

    public SistemaOperacional getSistemaOperacional() {
        return sistemaOperacional;
    }

    public void setSistemaOperacional(SistemaOperacional sistemaOperacional) {
        this.sistemaOperacional = sistemaOperacional;
    }

    public BandaFrequencia getBandaFrequencia() {
        return bandaFrequencia;
    }

    public void setBandaFrequencia(BandaFrequencia bandaFrequencia) {
        this.bandaFrequencia = bandaFrequencia;
    }

    public ProtocoloSeguranca getProtocoloSeguranca() {
        return protocoloSeguranca;
    }

    public void setProtocoloSeguranca(ProtocoloSeguranca protocoloSeguranca) {
        this.protocoloSeguranca = protocoloSeguranca;
    }

    public QuantidadeAntena getQuantidadeAntena() {
        return quantidadeAntena;
    }

    public void setQuantidadeAntena(QuantidadeAntena quantidadeAntena) {
        this.quantidadeAntena = quantidadeAntena;
    }

    public List<String> getListaImagem() {
        return listaImagem;
    }

    public void setListaImagem(List<String> listaImagem) {
        this.listaImagem = listaImagem;
    }

}

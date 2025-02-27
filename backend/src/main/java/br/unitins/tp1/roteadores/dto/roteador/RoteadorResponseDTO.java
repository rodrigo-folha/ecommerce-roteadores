package br.unitins.tp1.roteadores.dto.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.model.roteador.Roteador;

public record RoteadorResponseDTO(
    Long id,
    String nome,
    String descricao,
    Double preco,
    SinalWirelessResponseDTO sinalWireless,
    SistemaOperacionalResponseDTO sistemaOperacional,
    BandaFrequenciaResponseDTO bandaFrequencia,
    ProtocoloSegurancaResponseDTO protocoloSeguranca,
    QuantidadeAntenaResponseDTO quantidadeAntena,
    List<String> listaImagem
) {
    public static RoteadorResponseDTO valueOf(Roteador roteador) {
        return new RoteadorResponseDTO(
            roteador.getId(),
            roteador.getNome(),
            roteador.getDescricao(),
            roteador.getPreco(),
            SinalWirelessResponseDTO.valueOf(roteador.getSinalWireless()),
            SistemaOperacionalResponseDTO.valueOf(roteador.getSistemaOperacional()),
            BandaFrequenciaResponseDTO.valueOf(roteador.getBandaFrequencia()),
            ProtocoloSegurancaResponseDTO.valueOf(roteador.getProtocoloSeguranca()),
            QuantidadeAntenaResponseDTO.valueOf(roteador.getQuantidadeAntena()),
            roteador.getListaImagem()
        );
    }
}

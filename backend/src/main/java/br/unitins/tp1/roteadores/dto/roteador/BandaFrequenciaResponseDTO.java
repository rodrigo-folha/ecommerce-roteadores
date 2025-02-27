package br.unitins.tp1.roteadores.dto.roteador;

import br.unitins.tp1.roteadores.model.roteador.BandaFrequencia;

public record BandaFrequenciaResponseDTO(Long id, String nome) {
    public static BandaFrequenciaResponseDTO valueOf(BandaFrequencia bandaFrequencia) {
        return new BandaFrequenciaResponseDTO(bandaFrequencia.getId(), bandaFrequencia.getNome());
    }
    
}

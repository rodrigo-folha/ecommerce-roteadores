package br.unitins.tp1.roteadores.dto.roteador;

import br.unitins.tp1.roteadores.model.roteador.SinalWireless;

public record SinalWirelessResponseDTO(Long id, String nome) {
    public static SinalWirelessResponseDTO valueOf(SinalWireless sinalwireless) {
        return new SinalWirelessResponseDTO(sinalwireless.getId(), sinalwireless.getNome());
    }
}

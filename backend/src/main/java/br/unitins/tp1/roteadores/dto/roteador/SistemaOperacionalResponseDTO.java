package br.unitins.tp1.roteadores.dto.roteador;

import br.unitins.tp1.roteadores.model.roteador.SistemaOperacional;

public record SistemaOperacionalResponseDTO(Long id, String nome) {
    public static SistemaOperacionalResponseDTO valueOf(SistemaOperacional sistemaOperacional) {
        return new SistemaOperacionalResponseDTO(sistemaOperacional.getId(), sistemaOperacional.getNome());
    }
}

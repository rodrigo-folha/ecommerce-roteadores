package br.unitins.tp1.roteadores.dto.usuario.patches;

import jakarta.validation.constraints.NotBlank;

public record NomePatchRequestDTO(
    @NotBlank
    String novoNome
) {
    
}

package br.unitins.tp1.roteadores.dto.usuario.patches;

import jakarta.validation.constraints.NotBlank;

public record CpfPatchRequestDTO(
    @NotBlank(message = "O campo cpf deve ser informado.")
    String cpf
) {
    
}

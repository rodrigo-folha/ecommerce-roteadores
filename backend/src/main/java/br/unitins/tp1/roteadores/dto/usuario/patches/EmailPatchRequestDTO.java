package br.unitins.tp1.roteadores.dto.usuario.patches;

import jakarta.validation.constraints.Email;

public record EmailPatchRequestDTO(
    @Email
    String novoEmail
) {
    
}

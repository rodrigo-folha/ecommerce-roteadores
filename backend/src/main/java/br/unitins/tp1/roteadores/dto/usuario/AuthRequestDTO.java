package br.unitins.tp1.roteadores.dto.usuario;

import jakarta.validation.constraints.NotBlank;

public record AuthRequestDTO(
    @NotBlank(message = "O campo email deve ser informado.")
    String email,
    @NotBlank(message = "A senha não pode ser nula ou vazia")
    String senha
) {
    
}

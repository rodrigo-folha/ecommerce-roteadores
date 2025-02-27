package br.unitins.tp1.roteadores.dto.usuario.patches;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record DataNascimentoPatchRequestDTO(
    @NotNull(message = "O campo data de nascimento deve ser informado.")
    LocalDate dataNascimento
) {
    
}

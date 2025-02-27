package br.unitins.tp1.roteadores.dto.roteador;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SistemaOperacionalRequestDTO (
    @NotBlank
    @Size(max = 20, message = "O campo nome deve conter no máximo 20 caracteres.")
    String nome
) {
    
}

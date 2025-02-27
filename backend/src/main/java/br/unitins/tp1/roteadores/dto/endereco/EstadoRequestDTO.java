package br.unitins.tp1.roteadores.dto.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EstadoRequestDTO(
    @NotBlank(message = "O campo nome deve ser informado.")
    @Size(max = 30, message = "O campo deve conter no máximo 30 caracteres.")
    String nome,
    @NotBlank(message = "O campo sigla deve ser informado.")
    @Size(min = 2, max = 2, message = "O campo sigla deve possuir 2 caracteres")
    String sigla
) {

}

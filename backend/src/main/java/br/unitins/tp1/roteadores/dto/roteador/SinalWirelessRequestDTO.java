package br.unitins.tp1.roteadores.dto.roteador;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SinalWirelessRequestDTO (
    @NotBlank(message = "O campo deve ser informado.")
    @Size(max = 100, message = "O campo nome deve conter no máximo 100 caracteres.")
    String nome
){

}

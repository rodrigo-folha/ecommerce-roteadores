package br.unitins.tp1.roteadores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TelefoneRequestDTO (
    @NotBlank(message = "O campo codigo de área deve ser informado") 
    @Size(min = 2 , max = 2 , message = "O código de área deve conter 2 digitos")
    String codigoArea,
    @NotBlank(message = "O campo codigo de área deve ser informado")
    @Size(min = 8 , max = 9, message = "O campo número deve conter no máximo 9 digitos ")
    String numero
){
    
}

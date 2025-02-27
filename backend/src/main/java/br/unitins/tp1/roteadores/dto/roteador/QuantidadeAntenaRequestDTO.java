package br.unitins.tp1.roteadores.dto.roteador;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record QuantidadeAntenaRequestDTO(
    @NotNull(message = "O campo quantidade deve ser informado")
    @Positive
    Integer quantidade
) {

}

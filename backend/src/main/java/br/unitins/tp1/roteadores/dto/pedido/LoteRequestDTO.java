package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record LoteRequestDTO(
    @NotNull(message = "O campo idRoteador deve ser informado.")
    Long idRoteador,
    @NotNull(message = "O campo data deve ser informado.")
    LocalDate data,
    @NotBlank(message = "O campo codigo deve ser informado.")
    String codigo,
    @NotNull(message = "O campo codigo deve ser informado.")
    @Positive
    Integer estoque
) {
    
}

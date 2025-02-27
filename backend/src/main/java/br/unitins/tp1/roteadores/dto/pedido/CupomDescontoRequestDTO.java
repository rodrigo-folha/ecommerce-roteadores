package br.unitins.tp1.roteadores.dto.pedido;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CupomDescontoRequestDTO(
    @NotBlank(message = "O campo codigo deve ser informado.")
    String codigo,
    @NotNull(message = "O campo percentual de desconto deve ser informado")
    Double percentualDesconto,
    @NotNull
    @FutureOrPresent(message = "A data de validade não pode ser uma data antiga.")
    LocalDate validade
) {
    
}

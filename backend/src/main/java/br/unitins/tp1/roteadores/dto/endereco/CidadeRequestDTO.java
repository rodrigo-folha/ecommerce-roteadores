package br.unitins.tp1.roteadores.dto.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CidadeRequestDTO(
    @NotBlank(message = "O campo nome deve ser informado.")
    @Size(max = 60, message = "O campo nome deve conter no máximo 60 caracteres.")
    String nome,
    @NotNull(message = "O campo id estado deve ser informado.")
    @Positive(message = "O campo id do estado deve ser informado corretamente.")
    Long idEstado
) {


}

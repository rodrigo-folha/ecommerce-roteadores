package br.unitins.tp1.roteadores.dto.roteador;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record RoteadorRequestDTO (
    @NotBlank(message = "O campo nome deve ser informado.")
    @Size(max = 255, message = "O campo nome deve conter no máximo 255 caracteres.")
    String nome,
    @NotBlank(message = "O campo descricao deve ser informado.")
    @Size(max = 1000, message = "O campo descrição deve conter no máximo 1000 caracteres.")
    String descricao,
    @NotNull(message = "O campo nao pode ser nulo.")
    Double preco,
    @NotNull
    @Positive(message = "Informe um campo valido para o id de SinalWireless")
    Long idSinalWireless,
    @NotNull
    @Positive(message = "Informe um campo valido para o id de SistemaOperacional")
    Long idSistemaOperacional,
    @NotNull
    @Positive(message = "Informe um campo valido para o id de Banda de Frequencia")
    Long idBandaFrequencia,
    @NotNull
    @Positive(message = "Informe um campo valido para o id de Protocolo de Seguranca")
    Long idProtocoloSeguranca,
    @NotNull
    @Positive(message = "Informe um campo valido para o id de Quantidade de Antenas")
    Long idQuantidadeAntena
    
){

}

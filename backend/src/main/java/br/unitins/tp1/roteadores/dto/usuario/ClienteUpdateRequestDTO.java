package br.unitins.tp1.roteadores.dto.usuario;

import java.time.LocalDate;
import java.util.List;

import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClienteUpdateRequestDTO(
    @NotBlank(message = "O campo nome deve ser informado.")
    String nome,
    @NotBlank(message = "O campo cpf deve ser informado.")
    String cpf,
    @NotNull(message = "O campo data de nascimento deve ser informado")
    LocalDate dataNascimento,
    @Valid
    List<TelefoneRequestDTO> telefones,
    @Valid
    List<EnderecoRequestDTO> enderecos
) {
    
}

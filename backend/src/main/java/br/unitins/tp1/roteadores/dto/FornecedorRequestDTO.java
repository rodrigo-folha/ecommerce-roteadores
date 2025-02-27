package br.unitins.tp1.roteadores.dto;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FornecedorRequestDTO (
    @NotBlank(message = "O campo nome deve ser informado.")
    String nome,
    @NotNull(message = "O campo cnpj não pode ser nulo.")
    String cnpj,
    @NotNull(message = "O campo email não pode ser nulo.")
    @Email
    String email,
    @NotNull
    @Valid
    List<TelefoneRequestDTO> telefones,
    @NotNull
    @Valid
    List<EnderecoRequestDTO> enderecos
) {
    
}

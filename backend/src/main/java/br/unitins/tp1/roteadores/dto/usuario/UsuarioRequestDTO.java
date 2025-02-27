package br.unitins.tp1.roteadores.dto.usuario;

import java.time.LocalDate;
import java.util.List;

import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(
    @NotBlank(message = "O campo nome deve ser informado.")
    String nome,
    @NotBlank(message = "O campo cpf deve ser informado.")
    String cpf,
    LocalDate dataNascimento,
    @NotBlank(message = "O campo email deve ser informado.")
    @Email
    String email,
    @NotBlank(message = "O campo senha deve ser informado.")
    @Size(min = 6, max = 20, message = "A senha deve ter no minimo 6 caracteres e no maximo 20 caracteres")
    String senha,
    @Valid
    List<TelefoneRequestDTO> telefones,
    @Valid
    List<EnderecoRequestDTO> enderecos
) {
    
}

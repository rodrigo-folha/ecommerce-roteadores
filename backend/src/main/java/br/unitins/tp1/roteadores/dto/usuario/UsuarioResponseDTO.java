package br.unitins.tp1.roteadores.dto.usuario;

import java.time.LocalDate;
import java.util.List;

import br.unitins.tp1.roteadores.dto.TelefoneResponseDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoResponseDTO;
import br.unitins.tp1.roteadores.model.usuario.Perfil;
import br.unitins.tp1.roteadores.model.usuario.Usuario;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String cpf,
    LocalDate dataNascimento,
    String email,
    String senha,
    List<Perfil> perfil,
    List<TelefoneResponseDTO> telefones,
    List<EnderecoResponseDTO> enderecos
) {
    
    public static UsuarioResponseDTO valueOf(Usuario usuario) {
        return new UsuarioResponseDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getCpf(),
            usuario.getDataNascimento(),
            usuario.getEmail(),
            ofuscarSenha(usuario.getSenha()),
            usuario.getPerfis(),
            usuario.getTelefones().stream().map(TelefoneResponseDTO::valueOf).toList(),
            usuario.getEnderecos().stream().map(EnderecoResponseDTO::valueOf).toList()
        );
    }

    public static String ofuscarSenha(String senha) {
        return "******";
    }
}

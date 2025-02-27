package br.unitins.tp1.roteadores.dto.usuario;

import br.unitins.tp1.roteadores.model.usuario.Usuario;

public record UsuarioBasicoResponseDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    String senha
) {
    
    public static UsuarioBasicoResponseDTO valueOf(Usuario usuario) {
        return new UsuarioBasicoResponseDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getCpf(),
            usuario.getEmail(),
            usuario.getSenha());
    }
}

package br.unitins.tp1.roteadores.dto.usuario;

import java.time.LocalDateTime;

import br.unitins.tp1.roteadores.model.usuario.Cliente;

public record ClienteBasicoResponseDTO(
    Long id,
    LocalDateTime dataCadastro,
    UsuarioBasicoResponseDTO usuario
) {
    
    public static ClienteBasicoResponseDTO valueOf(Cliente cliente) {
        return new ClienteBasicoResponseDTO(
            cliente.getId(),
            cliente.getDataCadastro(),
            UsuarioBasicoResponseDTO.valueOf(cliente.getUsuario()));
    }
}

package br.unitins.tp1.roteadores.dto.usuario;

import jakarta.validation.Valid;

public record ClienteBasicoRequestDTO(
    @Valid
    UsuarioBasicoRequestDTO usuario
) {
    
}

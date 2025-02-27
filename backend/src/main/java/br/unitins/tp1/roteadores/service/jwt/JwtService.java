package br.unitins.tp1.roteadores.service.jwt;

import br.unitins.tp1.roteadores.dto.usuario.UsuarioResponseDTO;

public interface JwtService {

    String generateJwt(UsuarioResponseDTO dto);
}

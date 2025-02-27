package br.unitins.tp1.roteadores.dto.usuario;

import java.time.LocalDateTime;
import java.util.List;

import br.unitins.tp1.roteadores.dto.pagamento.CartaoResponseDTO;
import br.unitins.tp1.roteadores.model.usuario.Cliente;

public record ClienteResponseDTO(
    Long id,
    LocalDateTime dataCadastro,
    String nomeImagem,
    UsuarioResponseDTO usuario,
    List<CartaoResponseDTO> cartao
) {
    
    public static ClienteResponseDTO valueOf(Cliente cliente) {
        return new ClienteResponseDTO(
            cliente.getId(),
            cliente.getDataCadastro(),
            cliente.getNomeImagem(),
            UsuarioResponseDTO.valueOf(cliente.getUsuario()),
            cliente.getCartoes().stream().map(CartaoResponseDTO::valueOf).toList());
    }
}

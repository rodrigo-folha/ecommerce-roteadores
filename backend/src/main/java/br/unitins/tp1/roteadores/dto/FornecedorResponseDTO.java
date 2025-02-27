package br.unitins.tp1.roteadores.dto;

import java.util.List;

import br.unitins.tp1.roteadores.dto.endereco.EnderecoResponseDTO;
import br.unitins.tp1.roteadores.model.Fornecedor;

public record FornecedorResponseDTO(
    Long id,
    String nome,
    String cnpj,
    String email,
    List<TelefoneResponseDTO> telefones,
    List<EnderecoResponseDTO> enderecos
) {
    public static FornecedorResponseDTO valueOf(Fornecedor fornecedor) {
        return new FornecedorResponseDTO(
            fornecedor.getId(),
            fornecedor.getNome(),
            fornecedor.getCnpj(),
            fornecedor.getEmail(),
            fornecedor.getTelefones().stream().map(TelefoneResponseDTO::valueOf).toList(),
            fornecedor.getEnderecos().stream().map(EnderecoResponseDTO::valueOf).toList()
        );
    }
}

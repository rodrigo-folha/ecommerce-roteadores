package br.unitins.tp1.roteadores.service;

import java.util.List;

import br.unitins.tp1.roteadores.dto.FornecedorRequestDTO;
import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.model.Fornecedor;

public interface FornecedorService {
    Fornecedor findById(Long id);
    
    List<Fornecedor> findByNome(String nome);

    List<Fornecedor> findByCnpj(String cnpj);

    List<Fornecedor> findByEmail(String email);

    List<Fornecedor> findAll();

    Fornecedor create(FornecedorRequestDTO dto);

    Fornecedor update(Long id, FornecedorRequestDTO dto);

    void updateEnderecoEspecifico(Long id, Long idEndereco, EnderecoRequestDTO dto);

    void updateEndereco(Long id, List<EnderecoRequestDTO> dto);

    void updateTelefoneEspecifico(Long id, Long idTelefone, TelefoneRequestDTO dto);

    void updateTelefone(Long id, List<TelefoneRequestDTO> dto);

    void delete(Long id);
    
}

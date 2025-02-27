package br.unitins.tp1.roteadores.service;

import java.util.List;

import br.unitins.tp1.roteadores.dto.pagamento.CartaoRequestDTO;
import br.unitins.tp1.roteadores.model.pagamento.Cartao;

public interface CartaoService {

    Cartao findById(String email, Long id);

    List<Cartao> findByCliente(String username);

    // List<Cartao> findAll();

    Cartao create(String email, CartaoRequestDTO dto);

    void update(String email, Long idCartao, CartaoRequestDTO dto);

    void delete(String email, Long id);
}

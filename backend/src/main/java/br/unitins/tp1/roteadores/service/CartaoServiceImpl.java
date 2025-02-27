package br.unitins.tp1.roteadores.service;

import java.util.ArrayList;
import java.util.List;

import br.unitins.tp1.roteadores.dto.pagamento.CartaoRequestDTO;
import br.unitins.tp1.roteadores.model.pagamento.Cartao;
import br.unitins.tp1.roteadores.model.usuario.Cliente;
import br.unitins.tp1.roteadores.repository.CartaoRepository;
import br.unitins.tp1.roteadores.service.usuario.ClienteService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CartaoServiceImpl implements CartaoService {

    @Inject
    public CartaoRepository cartaoRepository;

    @Inject
    public ClienteService clienteService;

    @Override
    public Cartao findById(String email, Long idCartao) {
        Cliente cliente = clienteService.findByUsuario(email);

        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");
        
        if (cliente.getCartoes().contains(cartaoRepository.findById(idCartao)) == false) 
            throw new ValidationException("idCartao", "Cartao nao encontrado"); 
        
        return cartaoRepository.findById(idCartao);
    }

    @Override
    public List<Cartao> findByCliente(String username) {
        return clienteService.findByUsuario(username).getCartoes();
    }

    // @Override
    // public List<Cartao> findAll() {
    //     return cartaoRepository.findAll().list();
    // }

    @Override
    @Transactional
    public Cartao create(String email, CartaoRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Cliente cliente = clienteService.findByUsuario(email);
        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");

        Cartao cartao = new Cartao();
        cartao.setTitular(dto.titular());
        cartao.setNumero(dto.numero());
        cartao.setDataValidade(dto.dataValidade());
        cartao.setCpfCartao(dto.cpfCartao());
        cartao.setCvc(dto.cvc());
        cartao.setModalidadeCartao(dto.modalidade());

        if (cliente.getCartoes() == null)
            cliente.setCartoes(new ArrayList<>());

        cliente.getCartoes().add(cartao);
        
        return cartao;
    }

    @Override
    @Transactional
    public void update(String email, Long idCartao, CartaoRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Cliente cliente = clienteService.findByUsuario(email);

        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");

        Cartao cartao = cartaoRepository.findById(idCartao);
        
        if (!cliente.getCartoes().contains(cartao))
            throw new ValidationException("idCartao", "Cartao nao encontrado");

        cartao.setTitular(dto.titular());
        cartao.setNumero(dto.numero());
        cartao.setDataValidade(dto.dataValidade());
        cartao.setCpfCartao(dto.cpfCartao());
        cartao.setCvc(dto.cvc());
        cartao.setModalidadeCartao(dto.modalidade());
        
    }

    @Override
    @Transactional
    public void delete(String email, Long id) {
        Cliente cliente = clienteService.findByUsuario(email);
        Cartao cartao = cartaoRepository.findById(id);

        if (!cliente.getCartoes().contains(cartao))
            throw new ValidationException("idCartao", "Cartao nao encontrado");

        cliente.getCartoes().remove(cartao);
    }

}

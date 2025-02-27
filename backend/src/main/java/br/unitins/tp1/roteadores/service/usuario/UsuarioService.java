package br.unitins.tp1.roteadores.service.usuario;

import java.util.List;

import br.unitins.tp1.roteadores.model.usuario.Usuario;

public interface UsuarioService {
    
    Usuario findById(Long id);

    Usuario findByEmailAndSenha(String email, String senha);

    Usuario findByEmail(String email);

    Usuario findByCpf(String cpf);

    List<Usuario> findAll();

    void delete(Long id); 
}

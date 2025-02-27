package br.unitins.tp1.roteadores.service.usuario;

import java.util.List;

import br.unitins.tp1.roteadores.model.usuario.Usuario;
import br.unitins.tp1.roteadores.repository.UsuarioRepository;
import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UsuarioServiceImpl implements UsuarioService {

    @Inject
    public UsuarioRepository usuarioRepository;

    @Override
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario findByEmailAndSenha(String email, String senha) {
        return usuarioRepository.findByEmailAndSenha(email, senha);
    }

    @Override
    public Usuario findByEmail(String email) {
        // if (usuarioRepository.findByEmail(email) == null)
        //     throw new ValidationException("email", "email nao encontrado");
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario findByCpf(String cpf) {
        if (usuarioRepository.findByCpf(cpf) == null)
            throw new ValidationException("cpf", "cpf nao encontrado");
        return usuarioRepository.findByCpf(cpf);
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll().list();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }
    
}

package br.unitins.tp1.roteadores.service.usuario;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteBasicoRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteUpdateRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.CpfPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.DataNascimentoPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.EmailPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.NomePatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.SenhaPatchRequestDTO;
import br.unitins.tp1.roteadores.model.Telefone;
import br.unitins.tp1.roteadores.model.endereco.Endereco;
import br.unitins.tp1.roteadores.model.roteador.Roteador;
import br.unitins.tp1.roteadores.model.usuario.Cliente;
import br.unitins.tp1.roteadores.model.usuario.Funcionario;
import br.unitins.tp1.roteadores.model.usuario.Perfil;
import br.unitins.tp1.roteadores.model.usuario.Usuario;
import br.unitins.tp1.roteadores.repository.ClienteRepository;
import br.unitins.tp1.roteadores.repository.FuncionarioRepository;
import br.unitins.tp1.roteadores.repository.UsuarioRepository;
import br.unitins.tp1.roteadores.service.endereco.CidadeService;
import br.unitins.tp1.roteadores.service.roteador.RoteadorService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ClienteServiceImpl implements ClienteService {

    @Inject
    public ClienteRepository clienteRepository;

    @Inject
    public FuncionarioRepository funcionarioRepository;

    @Inject
    public UsuarioRepository usuarioRepository;

    @Inject
    public CidadeService cidadeService;

    @Inject
    public RoteadorService roteadorService;

    @Inject
    public HashService hashService;

    @Override
    public Cliente findById(Long id) {
        if (clienteRepository.findById(id) == null)
            throw new ValidationException("id", "cliente nao encontrado");
        return clienteRepository.findById(id);
    }

    @Override
    public List<Cliente> findByNome(String nome) {
        return clienteRepository.findByNome(nome);
    }

    @Override
    public Cliente findByUsuario(String email) {
        if (clienteRepository.findByUsuario(email) == null)
            throw new ValidationException("email", "cliente nao encontrado");
        
        return clienteRepository.findByUsuario(email);
    }

    @Override
    public List<Cliente> findByEmail(String email) {        
        return clienteRepository.findByEmail(email);
    }

    @Override
    public List<Cliente> findAll() {
        return clienteRepository.findAll().list();
    }

    @Override
    public Cliente getMinhasInformacoess(String email) {
        Cliente cliente = clienteRepository.findByUsuario(email);
        if (cliente == null)
            throw new ValidationException("email", "cliente nao encontrado");
        return cliente;
    }

    @Override
    @Transactional
    public Cliente create(ClienteRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (usuarioRepository.findByEmail(dto.usuario().email()) != null)
            throw new ValidationException("email", "email já cadastrado.");

        if (usuarioRepository.findByCpf(dto.usuario().cpf()) != null)
            throw new ValidationException("cpf", "cpf já cadastrado.");

        Cliente cliente = new Cliente();
        Usuario usuario = new Usuario();

        usuario.setNome(dto.usuario().nome());
        usuario.setCpf(dto.usuario().cpf());
        usuario.setDataNascimento(dto.usuario().dataNascimento());
        usuario.setEmail(dto.usuario().email());
        usuario.setSenha(hashService.getHashSenha(dto.usuario().senha()));
        if (usuario.getPerfis() == null)
            usuario.setPerfis(new ArrayList<>());
        usuario.getPerfis().add(Perfil.USER);
        // usuario.setPerfil(Perfil.USER);
        usuario.setTelefones(dto.usuario().telefones().stream().map(this::converterTelefone).toList());
        usuario.setEnderecos(dto.usuario().enderecos().stream().map(this::converterEndereco).toList());

        if (cliente.getCartoes() == null) {
            cliente.setCartoes(new ArrayList<>());
        }
        
        usuarioRepository.persist(usuario);
        cliente.setUsuario(usuario);
        cliente.setDataCadastro(LocalDateTime.now());
        clienteRepository.persist(cliente);

        return cliente;
    }

    @Override
    @Transactional
    public Cliente gerarClienteFromFuncionario(String email) {
        Cliente verificarCliente = clienteRepository.findByUsuario(email);

        if (verificarCliente != null)
            throw new ValidationException("email", "Ja existe um cliente cadastrado para esse usuario");
        
        if (funcionarioRepository.findByUsuario(email) == null)
            throw new ValidationException("email", "Nao existe nenhum funcionario cadastrado com esse email. Crie uma conta nova");

        Funcionario funcionario = funcionarioRepository.findByUsuario(email);
        Cliente cliente = new Cliente();
        cliente.setUsuario(funcionario.getUsuario());
        Usuario usuario = funcionario.getUsuario();
        if (usuario.getPerfis() == null)
            usuario.setPerfis(new ArrayList<>());

        usuario.getPerfis().add(Perfil.USER);
        // cliente.getUsuario().setPerfil(Perfil.USER);
        cliente.setDataCadastro(LocalDateTime.now());
        if (cliente.getCartoes() == null)
            cliente.setCartoes(new ArrayList<>());

        clienteRepository.persist(cliente);

        return cliente;
    }

    @Override
    @Transactional
    public Cliente createClienteBasico(ClienteBasicoRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (usuarioRepository.findByEmail(dto.usuario().email()) != null)
            throw new ValidationException("email", "email já cadastrado.");

        if (usuarioRepository.findByCpf(dto.usuario().cpf()) != null)
            throw new ValidationException("cpf", "cpf já cadastrado.");

        Cliente cliente = new Cliente();
        Usuario usuario = new Usuario();

        usuario.setNome(dto.usuario().nome());
        usuario.setCpf(dto.usuario().cpf());
        usuario.setEmail(dto.usuario().email());
        usuario.setSenha(hashService.getHashSenha(dto.usuario().senha()));
        if (usuario.getPerfis() == null)
            usuario.setPerfis(new ArrayList<>());

        usuario.getPerfis().add(Perfil.USER);
        // usuario.setPerfil(Perfil.USER);
        
        usuarioRepository.persist(usuario);
        cliente.setUsuario(usuario);
        cliente.setDataCadastro(LocalDateTime.now());
        clienteRepository.persist(cliente);

        return cliente;
    }

    @Override
    @Transactional
    public Cliente update(String email, ClienteUpdateRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (clienteRepository.findByUsuario(email) == null)
            throw new ValidationException("email", "email nao encontrado");

        Cliente cliente = clienteRepository.findByUsuario(email);
        Usuario usuario = cliente.getUsuario();

        if (usuarioRepository.findByCpf(dto.cpf()) != null && (!dto.cpf().equals(usuario.getCpf())))
            throw new ValidationException("cpf", "cpf já cadastrado.");   

        usuario.setNome(dto.nome());
        usuario.setCpf(dto.cpf());
        usuario.setDataNascimento(dto.dataNascimento());
        if (usuario.getPerfis() == null)
            usuario.setPerfis(new ArrayList<>());

        if (!usuario.getPerfis().contains(Perfil.USER))
            usuario.getPerfis().add(Perfil.USER);

        // usuario.setPerfil(Perfil.USER);
        updateTelefones(usuario, dto.telefones());
        updateEnderecos(usuario, dto.enderecos());

        return cliente;
    }

    @Override
    @Transactional
    public Cliente updateNomeImagem(String email, String nomeImagem) {
        Cliente cliente = clienteRepository.findByUsuario(email);
        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");

        cliente.setNomeImagem(nomeImagem);
        return cliente;
    }

    @Override
    @Transactional
    public void updateEnderecoEspecifico(String email, Long idEndereco, EnderecoRequestDTO dto) {
        Cliente cliente = clienteRepository.findByUsuario(email);

        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");

        Endereco endereco = cliente.getUsuario().getEnderecos().stream().filter(a -> a.getId().equals((idEndereco)))
                .findFirst()
                .orElseThrow(() -> new ValidationException("idEndereco", "Endereco nao encontrado"));

        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCep(dto.cep());
        endereco.setCidade(cidadeService.findById(dto.idCidade()));

        cliente.getUsuario().setEnderecos(cliente.getUsuario().getEnderecos());
    }

    @Override
    @Transactional
    public void updateEndereco(String email, List<EnderecoRequestDTO> dto) {
        Cliente cliente = clienteRepository.findByUsuario(email);

        if (cliente == null)
            throw new ValidationException("idCliente", "Cliente nao encontrado");

        updateEnderecos(cliente.getUsuario(), dto);
    }

    @Override
    @Transactional
    public void updateTelefoneEspecifico(String email, Long idTelefone, TelefoneRequestDTO dto) {
        Cliente cliente = clienteRepository.findByUsuario(email);

        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");

        Telefone telefone = cliente.getUsuario().getTelefones().stream().filter(a -> a.getId().equals((idTelefone)))
                .findFirst()
                .orElseThrow(() -> new ValidationException("idTelefone", "Telefone nao encontrado"));
        
        telefone.setCodigoArea(dto.codigoArea());
        telefone.setNumero(dto.numero());

        cliente.getUsuario().setTelefones(cliente.getUsuario().getTelefones());
    }

    @Override
    @Transactional
    public void updateTelefone(String email, List<TelefoneRequestDTO> dto) {
        Cliente cliente = clienteRepository.findByUsuario(email);

        if (cliente == null)
            throw new ValidationException("email", "Cliente nao encontrado");

        updateTelefones(cliente.getUsuario(), dto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        clienteRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void adicionarProdutoListaDesejo(String email, Long idProduto) {
        Cliente cliente = clienteRepository.findByUsuario(email);

        if (cliente.getListaDesejos() == null)
            cliente.setListaDesejos(new ArrayList<>());

        Roteador roteador = roteadorService.findById(idProduto);
        if (roteador == null)
            throw new ValidationException("idProduto", "Roteador nao encontrado");

        if (cliente.getListaDesejos().contains(roteador))
            throw new ValidationException("idProduto", "O produto ja se encontra na lista de desejos");
        
        cliente.getListaDesejos().add(roteador);
    }

    @Override
    @Transactional
    public void removerProdutoListaDesejo(String email, Long idProduto) {
        Cliente cliente = clienteRepository.findByUsuario(email);
        List<Roteador> listaDesejos = cliente.getListaDesejos();

        if (listaDesejos == null)
            throw new ValidationException("listaDesejos", "Voce nao possui uma lista de desejos");
        
        Roteador roteador = roteadorService.findById(idProduto);
        if (roteador == null)
            throw new ValidationException("idProduto", "Roteador nao encontrado");
        
        if (!listaDesejos.contains(roteador))
            throw new ValidationException("idProduto", "O produto nao esta na lista de desejos");

        listaDesejos.remove(roteador);
    }

    @Override
    public List<Roteador> getListaDesejos(String email) {
        Cliente cliente = clienteRepository.findByUsuario(email);
        return cliente.getListaDesejos();
    }

    @Override
    @Transactional
    public void updateSenha(String email, SenhaPatchRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null)
            throw new ValidationException("email", "usuario nao encontrado");

        if (usuario.getSenha().equals(hashService.getHashSenha(dto.senhaAtual())) == false) 
            throw new ValidationException("senhaAtual", "A senha atual esta invalida");
        
        if (!dto.novaSenha().equals(dto.repetirNovaSenha()))
            throw new ValidationException("repetirNovaSenha", "as senhas nao conferem");

        usuario.setSenha(hashService.getHashSenha(dto.novaSenha()));
    }

    @Override
    @Transactional
    public void updateNome(String email, NomePatchRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null)
            throw new ValidationException("email", "usuario nao encontrado");

        if (!(dto.novoNome().length() > 0))
            throw new ValidationException("nome", "O nome nao pode estar vazio");

        usuario.setNome(dto.novoNome());
    }

    @Override
    @Transactional
    public void updateEmail(String email, EmailPatchRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null)
            throw new ValidationException("email", "usuario nao encontrado");

        if (dto.novoEmail().equals(usuario.getEmail()))
            throw new ValidationException("email", "O novo email nao pode ser igual ao atual");

        if (usuarioRepository.findByEmail(dto.novoEmail()) != null && (!dto.novoEmail().equals(usuario.getEmail()))) 
            throw new ValidationException("novoEmail", "Email ja cadastrado");
        
        usuario.setEmail(dto.novoEmail());
    }

    @Override
    @Transactional
    public void updateCpf(String email, CpfPatchRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null)
            throw new ValidationException("email", "usuario nao encontrado");

        if (dto.cpf().equals(usuario.getCpf()))
            throw new ValidationException("cpf", "O novo cpf nao pode ser igual ao atual");

        if (usuarioRepository.findByCpf(dto.cpf()) != null && (!dto.cpf().equals(usuario.getCpf())))
            throw new ValidationException("cpf", "Cpf ja cadastrado");
        
        usuario.setCpf(dto.cpf());
    }

    @Override
    @Transactional
    public void updateDataNascimento(String email, DataNascimentoPatchRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null)
            throw new ValidationException("email", "usuario nao encontrado");
        
        usuario.setDataNascimento(dto.dataNascimento());
    }

    private Endereco converterEndereco(EnderecoRequestDTO enderecoDto) {
        Endereco endereco = new Endereco();
        endereco.setLogradouro(enderecoDto.logradouro());
        endereco.setBairro(enderecoDto.bairro());
        endereco.setNumero(enderecoDto.numero());
        endereco.setComplemento(enderecoDto.complemento());
        endereco.setCep(enderecoDto.cep());
        endereco.setCidade(cidadeService.findById(enderecoDto.idCidade()));
        return endereco;
    }
    
    private Telefone converterTelefone(TelefoneRequestDTO telefoneDto) {
        Telefone telefone = new Telefone();
        telefone.setCodigoArea(telefoneDto.codigoArea());
        telefone.setNumero(telefoneDto.numero());
        return telefone;
    }

    private void updateTelefones(Usuario usuario, List<TelefoneRequestDTO> novosTelefonesDTO) {
        List<Telefone> telefonesExistentes = usuario.getTelefones();

        if (novosTelefonesDTO == null) {
            throw new ValidationException("telefone", "o valor nao pode ser nulo");
        }
    
        telefonesExistentes.removeIf(telefone -> 
            novosTelefonesDTO.stream().noneMatch(dto -> 
                dto.codigoArea().equals(telefone.getCodigoArea()) && dto.numero().equals(telefone.getNumero()))
        );
    
        // Adicionar ou atualizar telefones
        for (TelefoneRequestDTO dto : novosTelefonesDTO) {
            Telefone telefoneExistente = telefonesExistentes.stream()
                .filter(t -> t.getCodigoArea().equals(dto.codigoArea()) && t.getNumero().equals(dto.numero()))
                .findFirst()
                .orElse(null);
    
            if (telefoneExistente == null) {
                Telefone novoTelefone = new Telefone();
                novoTelefone.setCodigoArea(dto.codigoArea());
                novoTelefone.setNumero(dto.numero());
                telefonesExistentes.add(novoTelefone);
            } else {
                telefoneExistente.setCodigoArea(dto.codigoArea());
                telefoneExistente.setNumero(dto.numero());
            }
        }
    }
    
    private void updateEnderecos(Usuario usuario, List<EnderecoRequestDTO> novosEnderecosDTO) {
        List<Endereco> enderecosExistentes = usuario.getEnderecos();
    
        enderecosExistentes.removeIf(endereco -> 
            novosEnderecosDTO.stream().noneMatch(dto -> 
                dto.logradouro().equals(endereco.getLogradouro()) && dto.numero().equals(endereco.getNumero()))
        );
    
        for (EnderecoRequestDTO dto : novosEnderecosDTO) {
            Endereco enderecoExistente = enderecosExistentes.stream()
                .filter(e -> e.getLogradouro().equals(dto.logradouro()) && e.getNumero().equals(dto.numero()))
                .findFirst()
                .orElse(null);
    
            if (enderecoExistente == null) {
                Endereco novoEndereco = new Endereco();
                novoEndereco.setLogradouro(dto.logradouro());
                novoEndereco.setBairro(dto.bairro());
                novoEndereco.setNumero(dto.numero());
                novoEndereco.setComplemento(dto.complemento());
                novoEndereco.setCep(dto.cep());
                novoEndereco.setCidade(cidadeService.findById(dto.idCidade()));
                enderecosExistentes.add(novoEndereco);
            } else {
                enderecoExistente.setLogradouro(dto.logradouro());
                enderecoExistente.setBairro(dto.bairro());
                enderecoExistente.setNumero(dto.numero());
                enderecoExistente.setComplemento(dto.complemento());
                enderecoExistente.setCep(dto.cep());
                enderecoExistente.setCidade(cidadeService.findById(dto.idCidade()));
            }
        }
    }
    
}

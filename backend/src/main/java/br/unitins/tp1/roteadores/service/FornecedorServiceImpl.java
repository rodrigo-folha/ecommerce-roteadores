package br.unitins.tp1.roteadores.service;

import java.util.ArrayList;
import java.util.List;

import br.unitins.tp1.roteadores.dto.FornecedorRequestDTO;
import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.model.Fornecedor;
import br.unitins.tp1.roteadores.model.Telefone;
import br.unitins.tp1.roteadores.model.endereco.Endereco;
import br.unitins.tp1.roteadores.repository.FornecedorRepository;
import br.unitins.tp1.roteadores.service.endereco.CidadeService;
import br.unitins.tp1.roteadores.service.usuario.UsuarioService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class FornecedorServiceImpl implements FornecedorService {

    @Inject
    public FornecedorRepository fornecedorRepository;

    @Inject
    public UsuarioService usuarioService;

    @Inject
    public CidadeService cidadeService;

    @Override
    public Fornecedor findById(Long id) {
        return fornecedorRepository.findById(id);
    }

    @Override
    public List<Fornecedor> findByNome(String nome) {
        return fornecedorRepository.findByNome(nome);
    }

    @Override
    public List<Fornecedor> findByCnpj(String cnpj) {
        return fornecedorRepository.findByCnpj(cnpj);
    }

    @Override
    public List<Fornecedor> findByEmail(String email) {
        return fornecedorRepository.findByEmail(email);
    }

    @Override
    public List<Fornecedor> findAll() {
        return fornecedorRepository.findAll().list();
    }

    @Override
    @Transactional
    public Fornecedor create(FornecedorRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Fornecedor fornecedor = new Fornecedor();

        if ((!fornecedorRepository.findByCnpj(dto.cnpj()).isEmpty()))
            throw new ValidationException("cnpj", "cnpj já cadastrado.");

        if (!fornecedorRepository.findByEmail(dto.email()).isEmpty())
            throw new ValidationException("email", "email já cadastrado.");

        if (usuarioService.findByEmail(dto.email()) != null)
            throw new ValidationException("email", "email já cadastrado.");

        fornecedor.setNome(dto.nome());
        fornecedor.setCnpj(dto.cnpj());
        fornecedor.setEmail(dto.email());
        fornecedor.setTelefones(getTelefones(dto));
        fornecedor.setEnderecos(getEnderecos(dto));

        fornecedorRepository.persist(fornecedor);

        return fornecedor;
    }

    @Override
    @Transactional
    public Fornecedor update(Long id, FornecedorRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Fornecedor fornecedor = fornecedorRepository.findById(id);
        if (fornecedor == null)
            throw new ValidationException("id", "fornecedor nao encontrado");
        
        if (!fornecedorRepository.findByCnpj(dto.cnpj()).isEmpty() && !dto.cnpj().equals(fornecedor.getCnpj()))
            throw new ValidationException("cnpj", "cnpj já cadastrado.");

        if (!fornecedorRepository.findByEmail(dto.email()).isEmpty() && !dto.email().equals(fornecedor.getEmail()))
            throw new ValidationException("email", "email já cadastrado.");

        if (usuarioService.findByEmail(dto.email()) != null)
            throw new ValidationException("email", "email já cadastrado.");
            
        fornecedor.setNome(dto.nome());
        fornecedor.setCnpj(dto.cnpj());
        fornecedor.setEmail(dto.email());
        updateTelefones(fornecedor, dto.telefones());
        updateEnderecos(fornecedor, dto.enderecos());

        return fornecedor;
    }

    @Override
    @Transactional
    public void updateEnderecoEspecifico(Long id, Long idEndereco, EnderecoRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Fornecedor fornecedor = fornecedorRepository.findById(id);

        if (fornecedor == null)
            throw new ValidationException("idFornecedor", "Fornecedor nao encontrado");

        Endereco endereco = fornecedor.getEnderecos().stream().filter(a -> a.getId().equals((idEndereco)))
                .findFirst()
                .orElseThrow(() -> new ValidationException("idEndereco", "Endereco nao encontrado"));

        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCep(dto.cep());
        endereco.setCidade(cidadeService.findById(dto.idCidade()));

        fornecedor.setEnderecos(fornecedor.getEnderecos());
    }

    @Override
    @Transactional
    public void updateEndereco(Long id, List<EnderecoRequestDTO> dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Fornecedor fornecedor = fornecedorRepository.findById(id);

        if (fornecedor == null)
            throw new ValidationException("idfornecedor", "Fornecedor nao encontrado");

        updateEnderecos(fornecedor, dto);
    }

    @Override
    @Transactional
    public void updateTelefoneEspecifico(Long id, Long idTelefone, TelefoneRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Fornecedor fornecedor = fornecedorRepository.findById(id);

        if (fornecedor == null)
            throw new ValidationException("idFornecedor", "Fornecedor nao encontrado");

        Telefone telefone = fornecedor.getTelefones().stream().filter(a -> a.getId().equals((idTelefone)))
                .findFirst()
                .orElseThrow(() -> new ValidationException("idEndereco", "Endereco nao encontrado"));
        
        telefone.setCodigoArea(dto.codigoArea());
        telefone.setNumero(dto.numero());

        fornecedor.setTelefones(fornecedor.getTelefones());
    }

    @Override
    @Transactional
    public void updateTelefone(Long id, List<TelefoneRequestDTO> dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
        
        Fornecedor fornecedor = fornecedorRepository.findById(id);

        if (fornecedor == null)
            throw new ValidationException("idFornecedor", "Fornecedor nao encontrado");

        updateTelefones(fornecedor, dto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        fornecedorRepository.deleteById(id);
    }

    private List<Telefone> getTelefones(FornecedorRequestDTO dto) {
        List<Telefone> telefones = new ArrayList<>();

        for (int i = 0; i < dto.telefones().size(); i++) {
            Telefone telefone = new Telefone();
            TelefoneRequestDTO telefoneRequestDTO = dto.telefones().get(i);
            telefone.setCodigoArea(telefoneRequestDTO.codigoArea());
            telefone.setNumero(telefoneRequestDTO.numero());
            telefones.add(telefone);
        }

        return telefones;
    }

    private List<Endereco> getEnderecos(FornecedorRequestDTO dto) {
        List<Endereco> enderecos = new ArrayList<>();

        for (int i = 0; i < dto.enderecos().size(); i++) {
            Endereco endereco = new Endereco();
            EnderecoRequestDTO enderecoRequestDTO = dto.enderecos().get(i);
            endereco.setLogradouro(enderecoRequestDTO.logradouro());
            endereco.setBairro(enderecoRequestDTO.bairro());
            endereco.setNumero(enderecoRequestDTO.numero());
            endereco.setComplemento(enderecoRequestDTO.complemento());
            endereco.setCep(enderecoRequestDTO.cep());
            endereco.setCidade(cidadeService.findById(enderecoRequestDTO.idCidade()));
            enderecos.add(endereco);
        }

        return enderecos;
    }

    private void updateTelefones(Fornecedor fornecedor, List<TelefoneRequestDTO> novosTelefonesDTO) {
        List<Telefone> telefonesExistentes = fornecedor.getTelefones();
    
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
    
    private void updateEnderecos(Fornecedor fornecedor, List<EnderecoRequestDTO> novosEnderecosDTO) {
        List<Endereco> enderecosExistentes = fornecedor.getEnderecos();
    
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

package br.unitins.tp1.roteadores.service.usuario;

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
import br.unitins.tp1.roteadores.model.roteador.Roteador;
import br.unitins.tp1.roteadores.model.usuario.Cliente;

public interface ClienteService {

    Cliente findById(Long id);
    
    List<Cliente> findByNome(String nome);
    
    Cliente findByUsuario (String email);
    
    List<Cliente> findAll();
    
    Cliente create(ClienteRequestDTO dto);
    
    void delete(Long id);

    List<Cliente> findByEmail(String email);
    
    void adicionarProdutoListaDesejo(String email, Long idProduto);
    
    void removerProdutoListaDesejo(String email, Long idProduto);
    
    List<Roteador> getListaDesejos(String email);
    
    Cliente createClienteBasico(ClienteBasicoRequestDTO dto);
    
    // metodos para o cliente utilizar
    Cliente getMinhasInformacoess(String email);
    Cliente update(String email, ClienteUpdateRequestDTO dto);
    void updateSenha(String email, SenhaPatchRequestDTO dto);
    void updateNome(String email, NomePatchRequestDTO dto);
    void updateEmail(String email, EmailPatchRequestDTO dto);
    void updateEnderecoEspecifico(String email, Long idEndereco, EnderecoRequestDTO dto);
    void updateEndereco(String email, List<EnderecoRequestDTO> dto);
    void updateTelefoneEspecifico(String email, Long idTelefone, TelefoneRequestDTO dto);
    void updateTelefone(String email, List<TelefoneRequestDTO> dto);
    Cliente updateNomeImagem(String email, String nomeImagem);
    Cliente gerarClienteFromFuncionario(String email);
    void updateCpf(String email, CpfPatchRequestDTO dto);
    void updateDataNascimento(String email, DataNascimentoPatchRequestDTO dto);
}

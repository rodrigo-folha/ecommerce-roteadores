package br.unitins.tp1.roteadores.service.roteador;

import java.util.ArrayList;
import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.RoteadorFiltroRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.RoteadorRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.Roteador;
import br.unitins.tp1.roteadores.repository.LoteRepository;
import br.unitins.tp1.roteadores.repository.RoteadorRepository;
import br.unitins.tp1.roteadores.service.FornecedorService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class RoteadorServiceImpl implements RoteadorService {

    @Inject
    public RoteadorRepository roteadorRepository;

    @Inject
    public SinalWirelessService sinalWirelessService;

    @Inject
    public SistemaOperacionalService sistemaOperacionalService;

    @Inject
    public BandaFrequenciaService bandaFrequenciaService;

    @Inject
    public ProtocoloSegurancaService protocoloSegurancaService;

    @Inject
    public QuantidadeAntenaService quantidadeAntenaService;

    @Inject
    public FornecedorService fornecedorService;

    @Inject
    public LoteRepository loteRepository;

    @Override
    public Roteador findById(Long id) {
        if (roteadorRepository.findById(id) == null)
            throw new ValidationException("id", "id nao encontrado");
            
        return roteadorRepository.findById(id);
    }

    @Override
    public List<Roteador> findByNome(String nome, Integer page, Integer pageSize) {
        return roteadorRepository.findByNome(nome).page(page, pageSize).list();
    }

    @Override
    public List<Roteador> findBySinalWireless(Long id) {
        return roteadorRepository.findBySinalWireless(id);
    }

    @Override
    public List<Roteador> findBySistemaOperacional(Long id) {
        return roteadorRepository.findBySistemaOperacional(id);
    }

    @Override
    public List<Roteador> findByBandaFrequencia(Long id) {
        return roteadorRepository.findByBandaFrequencia(id);
    }

    @Override
    public List<Roteador> findByProtocoloSeguranca(Long id) {
        return roteadorRepository.findByProtocoloSeguranca(id);
    }

    @Override
    public List<Roteador> findByQuantidadeAntena(Long id) {
        return roteadorRepository.findByQuantidadeAntena(id);
    }

    @Override
    public List<Roteador> findByPreco(Double min, Double max) {
        return roteadorRepository.findByPreco(min, max);
    }

    @Override
    public List<Roteador> findAll(Integer page, Integer pageSize) {
        PanacheQuery<Roteador> query = null;
        if (page == null || pageSize == null)
            query = roteadorRepository.findAll();
        else
            query = roteadorRepository.findAll().page(page, pageSize);

        return query.list();
    }

    @Override
    @Transactional
    public Roteador create(RoteadorRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        Roteador roteador = new Roteador();
        roteador.setNome(dto.nome());
        roteador.setDescricao(dto.descricao());
        roteador.setPreco(dto.preco());
        roteador.setSinalWireless(sinalWirelessService.findById(dto.idSinalWireless()));
        roteador.setSistemaOperacional(sistemaOperacionalService.findById(dto.idSistemaOperacional()));
        roteador.setBandaFrequencia(bandaFrequenciaService.findById(dto.idBandaFrequencia()));
        roteador.setProtocoloSeguranca(protocoloSegurancaService.findById(dto.idProtocoloSeguranca()));
        roteador.setQuantidadeAntena(quantidadeAntenaService.findById(dto.idQuantidadeAntena()));
        roteador.setFornecedor(fornecedorService.findById(dto.idFornecedor()));
        roteadorRepository.persist(roteador);

        return roteador;
    }

    @Override
    @Transactional
    public Roteador update(Long id, RoteadorRequestDTO dto) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");
            
        if (roteadorRepository.findById(id) == null)
            throw new ValidationException("id", "Id nao encontrado");
            
        Roteador roteador = roteadorRepository.findById(id);
        roteador.setNome(dto.nome());
        roteador.setDescricao(dto.descricao());
        roteador.setPreco(dto.preco());
        roteador.setSinalWireless(sinalWirelessService.findById(dto.idSinalWireless()));
        roteador.setSistemaOperacional(sistemaOperacionalService.findById(dto.idSistemaOperacional()));
        roteador.setBandaFrequencia(bandaFrequenciaService.findById(dto.idBandaFrequencia()));
        roteador.setProtocoloSeguranca(protocoloSegurancaService.findById(dto.idProtocoloSeguranca()));
        roteador.setQuantidadeAntena(quantidadeAntenaService.findById(dto.idQuantidadeAntena()));
        roteador.setFornecedor(fornecedorService.findById(dto.idFornecedor()));

        return roteador;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        loteRepository.deleteByRoteador(id);
        roteadorRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Roteador updateNomeImagem(Long id, String nomeImagem) {
        Roteador roteador = roteadorRepository.findById(id);
        if (roteador == null)
            throw new ValidationException("idRoteador", "Roteador não encontrado");

        if (roteador.getListaImagem() == null)
            roteador.setListaImagem(new ArrayList<>());

        // Evita duplicatas
        if (!roteador.getListaImagem().contains(nomeImagem)) {
            roteador.getListaImagem().add(nomeImagem);
        }

        return roteador;
    }

    @Override
    public long count() {
        return roteadorRepository.count();
    }

    @Override
    public long count(String nome) {
        return roteadorRepository.findByNome(nome).count();
    }

    @Override
    public long countQuantidadeTotalById(Long id) {
        return loteRepository.findByIdRoteadorQtdeTotal(id)
                .stream()
                .reduce(0, (subtotal, b) -> subtotal + b.getEstoque(), Integer::sum);
    }

    @Override
    public List<Roteador> buscarComFiltros(RoteadorFiltroRequestDTO filtros) {
        return roteadorRepository.buscarComFiltros(filtros).list();
    }

    @Override
    @Transactional
    public void removerNomeImagem(Long idRoteador, String nomeImagem) {
        Roteador roteador = roteadorRepository.findById(idRoteador);
        if (roteador == null)
            throw new ValidationException("idRoteador", "Roteador não encontrado.");

        if (roteador.getListaImagem() != null && roteador.getListaImagem().contains(nomeImagem)) {
            roteador.getListaImagem().remove(nomeImagem);
        } else {
            throw new ValidationException("nomeImagem", "Imagem não encontrada no roteador.");
        }
    }
}

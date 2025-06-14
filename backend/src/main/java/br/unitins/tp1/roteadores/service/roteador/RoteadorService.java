package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.RoteadorFiltroRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.RoteadorRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.Roteador;

public interface RoteadorService {
    Roteador findById(Long id);

    List<Roteador> findByNome(String nome, Integer page, Integer pageSize);

    List<Roteador> findBySinalWireless(Long id);

    List<Roteador> findBySistemaOperacional(Long id);

    List<Roteador> findByBandaFrequencia(Long id);

    List<Roteador> findByProtocoloSeguranca(Long id);

    List<Roteador> findByQuantidadeAntena(Long id);

    List<Roteador> findByPreco(Double min, Double max);

    List<Roteador> findAll(Integer page, Integer pageSize);

    Roteador create(RoteadorRequestDTO dto);

    Roteador update(Long id, RoteadorRequestDTO dto);

    Roteador updateNomeImagem(Long id, String nomeImagem);

    void delete(Long id);

    long count();
    
    long count(String nome);

    long countQuantidadeTotalById(Long id);

    List<Roteador> buscarComFiltros(RoteadorFiltroRequestDTO filtros);
    
    void removerNomeImagem(Long idRoteador, String nomeImagem);
}

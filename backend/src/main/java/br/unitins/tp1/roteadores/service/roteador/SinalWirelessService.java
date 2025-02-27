package br.unitins.tp1.roteadores.service.roteador;

import java.util.List;

import br.unitins.tp1.roteadores.dto.roteador.SinalWirelessRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.SinalWireless;

public interface SinalWirelessService {
    SinalWireless findById(Long id);

    List<SinalWireless> findByNome(String nome);

    List<SinalWireless> findAll();

    SinalWireless create(SinalWirelessRequestDTO sinalwireless);

    SinalWireless update(Long id, SinalWirelessRequestDTO sinalwireless);

    void delete(Long id);
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roteador } from '../models/roteador.model';

@Injectable({
  providedIn: 'root'
})
export class RoteadorService {

  private baseUrl = 'http://localhost:8080/roteadores';

  constructor(private httpClient: HttpClient) { }

  findById(id: string): Observable<Roteador> {
    return this.httpClient.get<Roteador>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/${nome}`);
  }

  findBySinalWireless(idSinalWireless: number): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/sinalwireless/${idSinalWireless}`);
  }

  findBySistemaOperacional(idSistemaOperacional: number): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/sistemasoperacionais/${idSistemaOperacional}`);
  }

  findByBandaFrequencia(idBandaFrequencia: number): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/bandafrequencias/${idBandaFrequencia}`);
  }

  findByProtocoloSeguranca(idProtocoloSeguranca: number): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/protocolosseguranca/${idProtocoloSeguranca}`);
  }

  findByQuantidadeAntenas(quantidadeAntenas: number): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/quantidadeantenas/${quantidadeAntenas}`);
  }

  findByPreco(min: number, max: number): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}/search/preco/min/max`);
  }

  findAll(): Observable<Roteador[]> {
    return this.httpClient.get<Roteador[]>(`${this.baseUrl}`);
  }

  insert(roteador: Roteador): Observable<Roteador> {
    const data = {
      nome: roteador.nome,
      descricao: roteador.descricao,
      preco: roteador.preco,
      idSinalWireless: roteador.sinalWireless.id,
      idSistemaOperacional: roteador.sistemaOperacional.id,
      idBandaFrequencia: roteador.bandaFrequencia.id,
      idProtocoloSeguranca: roteador.protocoloSeguranca.id,
      idQuantidadeAntena: roteador.quantidadeAntena.id
    }

    return this.httpClient.post<Roteador>(`${this.baseUrl}`, data);
  }

  update(roteador: Roteador): Observable<Roteador> {
    const data = {
      nome: roteador.nome,
      descricao: roteador.descricao,
      preco: roteador.preco,
      sistemaOperacional: roteador.sistemaOperacional.id,
      bandaFrequencia: roteador.bandaFrequencia.id,
      protocoloSeguranca: roteador.protocoloSeguranca.id,
      quantidadeAntena: roteador.quantidadeAntena.id,
      sinalWireless: roteador.sinalWireless.id
    }

    return this.httpClient.put<Roteador>(`${this.baseUrl}/${roteador.id}`, data);
  }

  delete(roteador: Roteador): Observable<Roteador> {
    return this.httpClient.delete<Roteador>(`${this.baseUrl}/${roteador.id}`);
  }
}

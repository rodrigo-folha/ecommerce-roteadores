import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roteador } from '../models/roteador.model';
import { IPaginator } from '../interfaces/ipaginator';
import { RoteadorFilterRequest } from '../models/roteador-filter-request';

@Injectable({
  providedIn: 'root'
})
export class RoteadorService {

  private baseUrl = 'http://localhost:8080/roteadores';

  constructor(private httpClient: HttpClient) { }

  findById(id: string): Observable<Roteador> {
    return this.httpClient.get<Roteador>(`${this.baseUrl}/${id}`);
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

  countQuantidadeTotalById(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/roteador/${id}/count`);
  }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Roteador>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Roteador>>(this.baseUrl, {params});
  }

  findByNome(nome?:string, page?: number, pageSize?: number): Observable<IPaginator<Roteador>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Roteador>>(`${this.baseUrl}/search/nome/${nome}`, {params});
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
      idQuantidadeAntena: roteador.quantidadeAntena.id,
      idFornecedor: roteador.fornecedor.id,
    }

    return this.httpClient.post<Roteador>(`${this.baseUrl}`, data);
  }

  update(roteador: Roteador): Observable<Roteador> {
    const data = {
      nome: roteador.nome,
      descricao: roteador.descricao,
      preco: roteador.preco,
      idSinalWireless: roteador.sinalWireless.id,
      idSistemaOperacional: roteador.sistemaOperacional.id,
      idBandaFrequencia: roteador.bandaFrequencia.id,
      idProtocoloSeguranca: roteador.protocoloSeguranca.id,
      idQuantidadeAntena: roteador.quantidadeAntena.id,
      idFornecedor: roteador.fornecedor.id
    }

    return this.httpClient.put<Roteador>(`${this.baseUrl}/${roteador.id}`, data);
  }

  delete(roteador: Roteador): Observable<Roteador> {
    return this.httpClient.delete<Roteador>(`${this.baseUrl}/${roteador.id}`);
  }

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/download/imagem/${nomeImagem}`;
  }

  getUrlImages(listaImagem: string[]): string[] {
    return listaImagem.map(nomeImagem => `${this.baseUrl}/download/imagem/${nomeImagem}`);
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);
    
    return this.httpClient.patch<Roteador>(`${this.baseUrl}/${id}/upload/imagem`, formData);
  }

  buscarComFiltros(filtros: RoteadorFilterRequest): Observable<Roteador[]> {
    return this.httpClient.post<Roteador[]>(`${this.baseUrl}/search/filtros`, filtros);
  }
}

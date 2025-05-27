import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private baseUrl = 'http://localhost:8080/enderecos';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Endereco>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<IPaginator<Endereco>>(this.baseUrl, {params});
  }

  findByNome(nome?:string, page?: number, pageSize?: number): Observable<IPaginator<Endereco>> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Endereco>>(`${this.baseUrl}/search/nome/${nome}`, {params});
  }

  findById(id: String): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/${id}`);
  }

  insert(endereco: Endereco): Observable<Endereco> {
    const data = {
      logradouro: endereco.logradouro,
      complemento: endereco.complemento,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cep: endereco.cep,
      idCidade: endereco.cidade.id
    }
    return this.httpClient.post<Endereco>(this.baseUrl, data);
  }

  update(endereco: Endereco): Observable<any> {
    const data = {
      logradouro: endereco.logradouro,
      complemento: endereco.complemento,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cep: endereco.cep,
      idCidade: endereco.cidade.id
    }
    return this.httpClient.put<Endereco>(`${this.baseUrl}/${endereco.id}`, data);
  }

  delete(endereco: Endereco): Observable<any> {
    return this.httpClient.delete<Endereco>(`${this.baseUrl}/${endereco.id}`);
  }
}

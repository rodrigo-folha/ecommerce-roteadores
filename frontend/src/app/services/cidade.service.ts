import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cidade } from '../models/cidade.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private baseUrl = 'http://localhost:8080/cidades';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Cidade>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<IPaginator<Cidade>>(this.baseUrl, {params});
  }

  findById(id: String): Observable<Cidade> {
    return this.httpClient.get<Cidade>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: String): Observable<Cidade[]> {
    return this.httpClient.get<Cidade[]>(`${this.baseUrl}/search/${nome}`);
  }

  insert(cidade: Cidade): Observable<Cidade> {
    const data = {
      nome: cidade.nome,
      idEstado: cidade.estado.id
    }
    return this.httpClient.post<Cidade>(this.baseUrl, data);
  }

  update(cidade: Cidade): Observable<any> {
    const data = {
      nome: cidade.nome,
      idEstado: cidade.estado.id
    }
    return this.httpClient.put<Cidade>(`${this.baseUrl}/${cidade.id}`, data);
  }

  delete(cidade: Cidade): Observable<any> {
    return this.httpClient.delete<Cidade>(`${this.baseUrl}/${cidade.id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SistemaOperacional } from '../models/sistema-operacional.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class SistemaOperacionalService {
  private baseUrl = 'http://localhost:8080/sistemasoperacionais';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<SistemaOperacional>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<SistemaOperacional>>(this.baseUrl, {params});
  }

  findByNome(nome?:string, page?: number, pageSize?: number): Observable<IPaginator<SistemaOperacional>> {
      let params = {};
    
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          pageSize: pageSize.toString()
        }
      }
      return this.httpClient.get<IPaginator<SistemaOperacional>>(`${this.baseUrl}/search/nome/${nome}`, {params});
    }

  findById(id: String): Observable<SistemaOperacional> {
    return this.httpClient.get<SistemaOperacional>(`${this.baseUrl}/${id}`);
  }

  insert(sistemaOperacional: SistemaOperacional): Observable<SistemaOperacional> {
    return this.httpClient.post<SistemaOperacional>(this.baseUrl, sistemaOperacional);
  }

  update(sistemaOperacional: SistemaOperacional): Observable<any> {
    return this.httpClient.put<SistemaOperacional>(`${this.baseUrl}/${sistemaOperacional.id}`, sistemaOperacional);
  }

  delete(sistemaOperacional: SistemaOperacional): Observable<any> {
    return this.httpClient.delete<SistemaOperacional>(`${this.baseUrl}/${sistemaOperacional.id}`);
  }
}

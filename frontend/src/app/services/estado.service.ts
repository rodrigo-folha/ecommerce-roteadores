import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseUrl = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Estado>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<IPaginator<Estado>>(this.baseUrl, {params});
  }

  findByNome(nome?:string, page?: number, pageSize?: number): Observable<IPaginator<Estado>> {
      let params = {};
    
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          pageSize: pageSize.toString()
        }
      }
      return this.httpClient.get<IPaginator<Estado>>(`${this.baseUrl}/search/nome/${nome}`, {params});
    }

  findById(id: String): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/${id}`);
  }

  insert(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(this.baseUrl, estado);
  }

  update(estado: Estado): Observable<any> {
    return this.httpClient.put<Estado>(`${this.baseUrl}/${estado.id}`, estado);
  }

  delete(estado: Estado): Observable<any> {
    return this.httpClient.delete<Estado>(`${this.baseUrl}/${estado.id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuantidadeAntena } from '../models/quantidade-antena.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class QuantidadeAntenaService {
  private baseUrl = 'http://localhost:8080/quantidadeantenas';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<QuantidadeAntena>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<QuantidadeAntena>>(this.baseUrl, {params});
  }

  findById(id: String): Observable<QuantidadeAntena> {
    return this.httpClient.get<QuantidadeAntena>(`${this.baseUrl}/${id}`);
  }

  insert(quantidadeAntena: QuantidadeAntena): Observable<QuantidadeAntena> {
    return this.httpClient.post<QuantidadeAntena>(this.baseUrl, quantidadeAntena);
  }

  update(quantidadeAntena: QuantidadeAntena): Observable<any> {
    return this.httpClient.put<QuantidadeAntena>(`${this.baseUrl}/${quantidadeAntena.id}`, quantidadeAntena);
  }

  delete(quantidadeAntena: QuantidadeAntena): Observable<any> {
    return this.httpClient.delete<QuantidadeAntena>(`${this.baseUrl}/${quantidadeAntena.id}`);
  }
}

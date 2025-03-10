import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuantidadeAntena } from '../models/quantidade-antena.model';

@Injectable({
  providedIn: 'root'
})
export class QuantidadeAntenaService {
  private baseUrl = 'http://localhost:8080/quantidadeantenas';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<QuantidadeAntena[]> {
    return this.httpClient.get<QuantidadeAntena[]>(this.baseUrl);
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

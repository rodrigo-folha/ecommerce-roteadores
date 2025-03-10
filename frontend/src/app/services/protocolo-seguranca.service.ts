import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProtocoloSeguranca } from '../models/protocolo-seguranca.model';

@Injectable({
  providedIn: 'root'
})
export class ProtocoloSegurancaService {
  private baseUrl = 'http://localhost:8080/protocolosseguranca';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<ProtocoloSeguranca[]> {
    return this.httpClient.get<ProtocoloSeguranca[]>(this.baseUrl);
  }

  findById(id: String): Observable<ProtocoloSeguranca> {
    return this.httpClient.get<ProtocoloSeguranca>(`${this.baseUrl}/${id}`);
  }

  insert(protocoloSeguranca: ProtocoloSeguranca): Observable<ProtocoloSeguranca> {
    return this.httpClient.post<ProtocoloSeguranca>(this.baseUrl, protocoloSeguranca);
  }

  update(protocoloSeguranca: ProtocoloSeguranca): Observable<any> {
    return this.httpClient.put<ProtocoloSeguranca>(`${this.baseUrl}/${protocoloSeguranca.id}`, protocoloSeguranca);
  }

  delete(protocoloSeguranca: ProtocoloSeguranca): Observable<any> {
    return this.httpClient.delete<ProtocoloSeguranca>(`${this.baseUrl}/${protocoloSeguranca.id}`);
  }
}

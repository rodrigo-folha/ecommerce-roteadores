import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProtocoloSeguranca } from '../models/protocolo-seguranca.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class ProtocoloSegurancaService {
  private baseUrl = 'http://localhost:8080/protocolosseguranca';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<ProtocoloSeguranca>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<ProtocoloSeguranca>>(this.baseUrl, {params});
  }

  findByNome(nome?:string, page?: number, pageSize?: number): Observable<IPaginator<ProtocoloSeguranca>> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<ProtocoloSeguranca>>(`${this.baseUrl}/search/nome/${nome}`, {params});
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

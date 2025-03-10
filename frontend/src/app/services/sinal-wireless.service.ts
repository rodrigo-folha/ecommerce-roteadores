import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SinalWireless } from '../models/sinal-wireless.model';

@Injectable({
  providedIn: 'root'
})
export class SinalWirelessService {
  private baseUrl = 'http://localhost:8080/sinalwireless';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<SinalWireless[]> {
    return this.httpClient.get<SinalWireless[]>(this.baseUrl);
  }

  findById(id: String): Observable<SinalWireless> {
    return this.httpClient.get<SinalWireless>(`${this.baseUrl}/${id}`);
  }

  insert(sinalWireless: SinalWireless): Observable<SinalWireless> {
    return this.httpClient.post<SinalWireless>(this.baseUrl, sinalWireless);
  }

  update(sinalWireless: SinalWireless): Observable<any> {
    return this.httpClient.put<SinalWireless>(`${this.baseUrl}/${sinalWireless.id}`, sinalWireless);
  }

  delete(sinalWireless: SinalWireless): Observable<any> {
    return this.httpClient.delete<SinalWireless>(`${this.baseUrl}/${sinalWireless.id}`);
  }
}

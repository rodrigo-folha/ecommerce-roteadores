import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cupom } from '../models/cupom.model';
import { Observable } from 'rxjs';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class CupomService {
private baseUrl = 'http://localhost:8080/cuponsdesconto';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Cupom>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<IPaginator<Cupom>>(this.baseUrl, {params});
  }

  findById(id: String): Observable<Cupom> {
    return this.httpClient.get<Cupom>(`${this.baseUrl}/${id}`);
  }

  insert(cupom: Cupom): Observable<Cupom> {
    return this.httpClient.post<Cupom>(this.baseUrl, cupom);
  }

  update(cupom: Cupom): Observable<any> {
    return this.httpClient.put<Cupom>(`${this.baseUrl}/${cupom.id}`, cupom);
  }

  delete(cupom: Cupom): Observable<any> {
    return this.httpClient.delete<Cupom>(`${this.baseUrl}/${cupom.id}`);
  }
}

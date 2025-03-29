import { Injectable } from '@angular/core';
import { Lote } from '../models/lote.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  private baseUrl = 'http://localhost:8080/lotes';
  
    constructor(private httpClient: HttpClient) { }
  
    findAll(page?: number, pageSize?: number): Observable<IPaginator<Lote>> {
        let params = {};
    
        if (page !== undefined && pageSize !== undefined) {
          params = {
            page: page.toString(),
            pageSize: pageSize.toString()
          }
        }
        return this.httpClient.get<IPaginator<Lote>>(this.baseUrl, {params});
      }
  
    findById(id: String): Observable<Lote> {
      return this.httpClient.get<Lote>(`${this.baseUrl}/${id}`);
    }

    findByCodigo(codigo: String): Observable<Lote> {
      return this.httpClient.get<Lote>(`${this.baseUrl}/search/codigo/${codigo}`);
    }

    findByIdRoteadorQtdeTotal(idRoteador: String): Observable<Lote[]> {
      return this.httpClient.get<Lote[]>(`${this.baseUrl}/search/roteador/qtdetotal/${idRoteador}`);
    }
  
    insert(lote: Lote): Observable<Lote> {
      const data = {
        idRoteador: lote.idRoteador,
        data: lote.data,
        codigo: lote.codigo,
        estoque: lote.estoque
      }
      
      return this.httpClient.post<Lote>(this.baseUrl, data);
    }
    
    update(lote: Lote): Observable<Lote> {
      const data = {
        idRoteador: lote.idRoteador,
        data: lote.data,
        codigo: lote.codigo,
        estoque: lote.estoque
      }
      return this.httpClient.put<Lote>(`${this.baseUrl}/${lote.id}`, data);
    }
  
    delete(lote: Lote): Observable<any> {
      return this.httpClient.delete<Lote>(`${this.baseUrl}/${lote.id}`);
    }
}

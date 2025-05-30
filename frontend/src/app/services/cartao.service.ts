import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cartao } from '../models/cartao.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private baseUrl = 'http://localhost:8080/cartoes';

  constructor(private httpClient: HttpClient,
    private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
      const token1 = localStorage.getItem('jwt_token');
      const token = token1?.replaceAll('"', '');
      if (!token) {
        this.router.navigate(['/login']);
        throw new Error('Usuário não autenticado')
      }
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

  findAll(): Observable<Cartao[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Cartao[]>(this.baseUrl, { headers });
  }

  findById(id: String): Observable<Cartao> {
    const headers = this.getHeaders();
    return this.httpClient.get<Cartao>(`${this.baseUrl}/${id}`, { headers });
  }

  insert(cartao: Cartao): Observable<Cartao> {
    const headers = this.getHeaders();
    const data = {
      titular: cartao.titular,
      cpfCartao: cartao.cpfCartao,
      numero: cartao.numero,
      cvc: cartao.cvc,
      dataValidade: cartao.dataValidade,
      modalidade: cartao.modalidade
    }
    return this.httpClient.post<Cartao>(this.baseUrl, data, { headers });
  }

  update(cartao: Cartao): Observable<Cartao> {
    const headers = this.getHeaders();
    const data = {
      titular: cartao.titular,
      cpfCartao: cartao.cpfCartao,
      numero: cartao.numero,
      cvc: cartao.cvc,
      dataValidade: cartao.dataValidade,
      modalidade: cartao.modalidade
    }
    return this.httpClient.put<Cartao>(`${this.baseUrl}/${cartao.id}`, data, { headers });
  }

  delete(cartao: Cartao): Observable<Cartao> {
    const headers = this.getHeaders();
    return this.httpClient.delete<Cartao>(`${this.baseUrl}/${cartao.id}`, { headers });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = 'http://localhost:8080/clientes';
  private baseUrlClientesBasicos = 'http://localhost:8080/clientesbasicos';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.baseUrl);
  }

  findById(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/nome/${nome}`);
  }

  findByCpf(cpf: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/cpf/${cpf}`);
  }

  findByEmail(email: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/email/${email}`);
  }

  create(usuario: Usuario): Observable<Cliente> {
    const data = {
      usuario: {
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        senha: usuario.senha
      }
    }
    return this.httpClient.post<Cliente>(`${this.baseUrlClientesBasicos}/cadastrar-cliente/`, data);
  }

}

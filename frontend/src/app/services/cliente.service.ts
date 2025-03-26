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

  findById(id: string): Observable<Cliente> {
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

  insertBasico(usuario: Usuario): Observable<Cliente> {
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

  insert(usuario: Usuario): Observable<Cliente> {
        const data = {
          usuario: {
            nome: usuario.nome,
            cpf: usuario.cpf,
            dataNascimento: usuario.dataNascimento,
            email: usuario.email,
            senha: usuario.senha,
            telefones: usuario.telefones.map(telefone => ({
              codigoArea: telefone.codigoArea,
              numero: telefone.numero
            })),
            enderecos: usuario.enderecos.map(endereco => ({
              logradouro: endereco.logradouro,
              bairro: endereco.bairro,
              numero: endereco.numero,
              complemento: endereco.complemento,
              cep: endereco.cep,
              idCidade: endereco.cidade.id
            }))
          }
        };
        return this.httpClient.post<Cliente>(`${this.baseUrl}`, data);
      }

  update(usuario: Usuario): Observable<Cliente> {
        const data = {
          nome: usuario.nome,
          cpf: usuario.cpf,
          dataNascimento: usuario.dataNascimento,
          email: usuario.email,
          senha: usuario.senha,
          telefones: usuario.telefones.map(telefone => ({
            codigoArea: telefone.codigoArea,
            numero: telefone.numero
          })),
          enderecos: usuario.enderecos.map(endereco => ({
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            numero: endereco.numero,
            complemento: endereco.complemento,
            cep: endereco.cep,
            idCidade: endereco.cidade.id
          }))
        };
  
        return this.httpClient.put<Cliente>(`${this.baseUrl}/${usuario.id}`, data);
      }

  delete(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.baseUrl}/${cliente.id}`);
  }

}

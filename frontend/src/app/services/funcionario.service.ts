import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';
import { Usuario } from '../models/usuario.model';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private baseUrl = 'http://localhost:8080/funcionarios';
  
    constructor(private httpClient: HttpClient) { }
  
    findAll(page?: number, pageSize?: number): Observable<IPaginator<Funcionario>> {
      let params = {};
  
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          pageSize: pageSize.toString()
        }
      }
  
      return this.httpClient.get<IPaginator<Funcionario>>(this.baseUrl, {params});
    }
  
    findById(id: string): Observable<Funcionario> {
      return this.httpClient.get<Funcionario>(`${this.baseUrl}/${id}`);
    }
  
    findByNome(nome: string): Observable<Funcionario[]> {
      return this.httpClient.get<Funcionario[]>(`${this.baseUrl}/nome/${nome}`);
    }
  
    findByCpf(cpf: string): Observable<Funcionario> {
      return this.httpClient.get<Funcionario>(`${this.baseUrl}/cpf/${cpf}`);
    }
  
    findByEmail(email: string): Observable<Funcionario> {
      return this.httpClient.get<Funcionario>(`${this.baseUrl}/email/${email}`);
    }
  
    insert(usuario: Usuario): Observable<Funcionario> {
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
      return this.httpClient.post<Funcionario>(`${this.baseUrl}`, data);
    }

    update(usuario: Usuario): Observable<Funcionario> {
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

      return this.httpClient.put<Funcionario>(`${this.baseUrl}/${usuario.id}`, data);
    }

    delete(funcionario: Funcionario): Observable<Funcionario> {
        return this.httpClient.delete<Funcionario>(`${this.baseUrl}/${funcionario.id}`);
    }
}

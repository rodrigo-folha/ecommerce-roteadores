import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/fornecedor.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPaginator } from '../interfaces/ipaginator';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private baseUrl = 'http://localhost:8080/fornecedores';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Fornecedor>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Fornecedor>>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome?: string, page?: number, pageSize?: number): Observable<IPaginator<Fornecedor>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Fornecedor>>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  findByCpf(cpf: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/cpf/${cpf}`);
  }

  findByEmail(email: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/email/${email}`);
  }

  insert(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      email: fornecedor.email,
      cnpj: fornecedor.cnpj,
      telefones: fornecedor.telefones.map((telefone) => ({
        codigoArea: telefone.codigoArea,
        numero: telefone.numero,
      })),
      enderecos: fornecedor.enderecos.map((endereco) => ({
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        cep: endereco.cep,
        idCidade: endereco.cidade.id,
      })),
    };
    return this.httpClient.post<Fornecedor>(`${this.baseUrl}`, data);
  }

  update(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      email: fornecedor.email,
      cnpj: fornecedor.cnpj,
      telefones: fornecedor.telefones.map((telefone) => ({
        codigoArea: telefone.codigoArea,
        numero: telefone.numero,
      })),
      enderecos: fornecedor.enderecos.map((endereco) => ({
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        cep: endereco.cep,
        idCidade: endereco.cidade.id,
      })),
    };

    return this.httpClient.put<Fornecedor>(`${this.baseUrl}/${fornecedor.id}`, data);
  }

  delete(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.delete<Fornecedor>(
      `${this.baseUrl}/${fornecedor.id}`
    );
  }
}

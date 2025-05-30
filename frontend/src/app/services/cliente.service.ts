import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Usuario } from '../models/usuario.model';
import { IPaginator } from '../interfaces/ipaginator';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = 'http://localhost:8080/clientes';
  private baseUrlClientesBasicos = 'http://localhost:8080/clientesbasicos';

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

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Cliente>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<IPaginator<Cliente>>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome?: string, page?: number, pageSize?: number): Observable<IPaginator<Cliente>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Cliente>>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  findByCpf(cpf: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/search/cpf/${cpf}`);
  }

  findByEmail(email: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/search/email/${email}`);
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

  updateBasico(usuario: Usuario): Observable<Cliente> {
    const headers = this.getHeaders();
    const data = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      dataNascimento: usuario.dataNascimento,
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
    
    return this.httpClient.put<Cliente>(`${this.baseUrlClientesBasicos}/update`, data, { headers });
  }

  buscarListaDesejo(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<any[]>(`${this.baseUrlClientesBasicos}/desejos`, { headers })
  }

  adicionarItemListaDesejo(idProduto: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.patch<any>(`${this.baseUrlClientesBasicos}/desejos/adicionar/${idProduto}`, {}, { headers })
  }

  removerItemListaDesejo(idProduto: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.patch<any>(`${this.baseUrlClientesBasicos}/desejos/remover/${idProduto}`, {}, { headers })
  }

  delete(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.baseUrl}/${cliente.id}`);
  }

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrlClientesBasicos}/imagem/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);
    
    return this.httpClient.patch<Cliente>(`${this.baseUrlClientesBasicos}/imagem/upload`, formData, { headers});
  }

}

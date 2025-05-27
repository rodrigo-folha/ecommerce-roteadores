import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';
  private baseUrlFuncionario = 'http://localhost:8080/auth/funcionario';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService,
    private clienteService: ClienteService
  ) { 
    this.initUsuarioLogado();
  }

  private initUsuarioLogado() {
    let usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      if (!(typeof usuario === 'string')) {
        usuario = JSON.stringify(usuario); // Se ele já tiver como string, ele vai colocar aspas extras no texto, por isso a verificação com o if
      }
      const usuarioLogado = JSON.parse(usuario);

      this.setUsuarioLogado(usuarioLogado);
      this.usuarioLogadoSubject.next(usuarioLogado);
    }
  }

  loginADM(login: string, senha: string): Observable<any> {
    const params = {
      login: login,
      senha: senha
    }

    return this.http.post(`${this.baseUrlFuncionario}`, params, {observe: 'response'}).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.setToken(authToken);
          const usuarioLogado = res.body;

          if (usuarioLogado) {
            this.setUsuarioLogado(usuarioLogado);
            this.usuarioLogadoSubject.next(usuarioLogado);
          }
        }
      })
    )
  }

  loginUser(login: string, senha: string): Observable<any> {
    const params = {
      email: login,
      senha: senha
    }

    return this.http.post(`${this.baseUrl}`, params, {observe: 'response'}).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.setToken(authToken);
          const usuarioLogado = res.body;

          if (usuarioLogado) {
            this.setUsuarioLogado(usuarioLogado);
            this.usuarioLogadoSubject.next(usuarioLogado);
          }
        }
      })
    )
  }

  loginUserKeycloak(login: string, senha: string): Observable<any> {
    const params = {
      email: login,
      senha: senha
    }

    return this.http.post(`${this.baseUrl}/keycloak`, params, {observe: 'response'}).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.setToken(authToken);
          const usuarioLogado = res.body;

          if (usuarioLogado) {
            this.setUsuarioLogado(usuarioLogado);
            this.usuarioLogadoSubject.next(usuarioLogado);
          }
        }
      })
    )
  }

  setUsuarioLogado(usuario: Usuario): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, usuario);
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.log("Token inválido", error);
      return true;
    }
  }
  
}

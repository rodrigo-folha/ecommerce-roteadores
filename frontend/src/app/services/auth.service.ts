import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';
  private baseUrlFuncionario = 'http://localhost:8080/auth/funcionario';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private tipoUsuarioKey = 'tipo_usuario';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private httpClient: HttpClient,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) { 
    this.initUsuarioLogado();
  }

  private initUsuarioLogado() {
    const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      this.usuarioLogadoSubject.next(usuario);
    }
  }

  login(email: string, senha: string, tipo: 'cliente' | 'funcionario'): Observable<any> {
    const params = {
      email: email,
      senha: senha
    };

    const url = tipo === 'funcionario' ? this.baseUrlFuncionario : this.baseUrl;

    return this.httpClient.post(url, params, { observe: 'response' }).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';

        if (authToken) {
          this.setToken(authToken);
          const usuario = res.body;

          if (usuario) {
            this.setUsuarioLogado(usuario, tipo);
            this.usuarioLogadoSubject.next(usuario);
          }
        };
      })
    );
  }

  setUsuarioLogado(usuario: Usuario, tipo: 'cliente' | 'funcionario') {
    this.localStorageService.setItem(this.usuarioLogadoKey, usuario);
    this.localStorageService.setItem(this.tipoUsuarioKey, tipo);
    this.usuarioLogadoSubject.next(usuario);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.localStorageService.removeItem(this.tipoUsuarioKey);
    this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return !token || this.jwtHelper.isTokenExpired(token);
  }


}

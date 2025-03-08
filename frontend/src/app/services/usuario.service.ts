import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseURL: string = 'http://localhost:8080'

  constructor() { }
}

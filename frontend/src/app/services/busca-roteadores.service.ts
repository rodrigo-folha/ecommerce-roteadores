import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BuscaRoteadoresService {
  termoBusca = signal<string>('');
}
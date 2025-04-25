import { Component, LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Roteador } from '../../../models/roteador.model';
import { RoteadorService } from '../../../services/roteador.service';
import { CommonModule, NgFor, registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
registerLocaleData(localePt);

@Component({
  selector: 'app-pagina-inicial',
  imports: [CommonModule, NgFor, MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css',
  providers: [provideNativeDateAdapter(), {
        provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
        { provide: LOCALE_ID, useValue: 'pt-BR'}
      ],
})
export class PaginaInicialComponent {

  roteadores: Roteador[] = [];
  constructor(
    private roteadorService: RoteadorService,
  ) { }

  ngOnInit(): void {
    this.roteadorService.findAll().subscribe((data) => {
      this.roteadores = data.resultado;
    })
  }

}

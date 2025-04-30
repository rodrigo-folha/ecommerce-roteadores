import { Component, LOCALE_ID, OnInit, signal } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Roteador } from '../../../models/roteador.model';
import { RoteadorService } from '../../../services/roteador.service';
import { CommonModule, NgFor, registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
registerLocaleData(localePt);

type Card = {
  title: string;
  preco: number;
  imageUrl: string;
};

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
export class PaginaInicialComponent implements OnInit{

  roteadores: Roteador[] = [];
  cards = signal<Card[]>([]);
  constructor(
    private roteadorService: RoteadorService,
  ) { }

  ngOnInit(): void {
    this.carregarRoteadores();
    this.roteadorService.findAll().subscribe((data) => {
      this.roteadores = data.resultado;
    })
  }

  carregarRoteadores() {
    this.roteadorService.findAll().subscribe((data) => {
      this.roteadores = data.resultado;
      this.carregarCards();
    })
  }

  carregarCards() {
    console.log('esses são os roteadores: ', this.roteadores);
    const cards: Card[] = [];
    this.roteadores.forEach((roteador) => {
      cards.push({
        title: roteador.nome,
        preco: roteador.preco,
        imageUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
      })
    })
    this.cards.set(cards);
  }
}

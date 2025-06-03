import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, LOCALE_ID, signal } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { Roteador } from '../../../../models/roteador.model';
import { RoteadorService } from '../../../../services/roteador.service';
import { CarrinhoService } from '../../../../services/carrinho.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../../services/cliente.service';
registerLocaleData(localePt);

type Card = {
  id: number;
  titulo: string;
  preco: number;
  rating: number;
  reviews: number;
  imageUrl: string;
};

@Component({
  selector: 'app-roteadores-cards',
  providers: [provideNativeDateAdapter(), {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
      { provide: LOCALE_ID, useValue: 'pt-BR'}
    ],
  imports: [CommonModule, RouterLink],
  templateUrl: './roteadores-cards.component.html',
  styleUrl: './roteadores-cards.component.css'
})
export class RoteadoresCardsComponent {

  roteadores: Roteador[] = [];
  cards = signal<Card[]>([]);
  listaDesejo: number[] = [];

  constructor(
    private roteadorService: RoteadorService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
  ) { }

  ngOnInit(): void {
    this.carregarRoteadores();
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (usuarioLogado) {
      this.carregarListaDesejos();
    }
  }

  carregarRoteadores() {
    this.roteadorService.findAll(0,4).subscribe((data) => {
      this.roteadores = data.resultado;
      this.carregarCards();
    })
  }

  carregarCards() {
    const cards: Card[] = [];
    this.roteadores.forEach((roteador) => {
      cards.push({
        id: roteador.id,
        titulo: roteador.nome,
        preco: roteador.preco,
        rating: 4.8,
        reviews: 100,
        imageUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
      })
    })
    this.cards.set(cards);
  }
  
  carregarListaDesejos() {
    this.clienteService.buscarListaDesejo().subscribe((lista) => {
      this.listaDesejo = lista.map(item => item.idProduto);
    })
  }

  isInWishlist(card: Card): boolean {
    return this.listaDesejo.includes(card.id);
  }

  adicionarItemListaDesejo(card: Card) {
    if (this.isInWishlist(card)) {
      this.clienteService.removerItemListaDesejo(card.id).subscribe(() => {
        this.listaDesejo = this.listaDesejo.filter(item => item !== card.id);
        this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi removido da lista de desejos.')
      });
    } else {
      this.clienteService.adicionarItemListaDesejo(card.id).subscribe(() => {
        this.listaDesejo.push(card.id);
        this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado a lista de desejos.')
      })
    }
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado ao carrinho.')
    this.carrinhoService.adicionar({
      id: card.id,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1,
      imageUrl: card.imageUrl
    })
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}

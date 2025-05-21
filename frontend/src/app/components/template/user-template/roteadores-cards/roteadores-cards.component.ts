import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, LOCALE_ID, signal } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { Roteador } from '../../../../models/roteador.model';
import { RoteadorService } from '../../../../services/roteador.service';
import { CarrinhoService } from '../../../../services/carrinho.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor(
    private roteadorService: RoteadorService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.carregarRoteadores();
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

  products = [
    {
      name: "Roteador 1",
      category: "Clothing",
      price: "29.99",
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: null,
      rating: 4.5,
      reviews: 128,
      inWishlist: false,
    },
    {
      name: "Roteador 2",
      category: "Accessories",
      price: "89.99",
      salePrice: "69.99",
      image: "../login/placeholder.svg",
      badge: "Sale",
      rating: 4.8,
      reviews: 64,
      inWishlist: true,
    },
    {
      name: "Roteador 3",
      category: "Jewelry",
      price: "49.99",
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: "New",
      rating: 4.2,
      reviews: 42,
      inWishlist: false,
    },
    {
      name: "Roteador 4",
      category: "Clothing",
      price: "59.99",
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: null,
      rating: 4.6,
      reviews: 96,
      inWishlist: false,
    },
  ]

  addToCart(product: any) {
    console.log("Added to cart:", product)
    // Implement cart functionality
  }

  isInWishlist(product: any): boolean {
    return product.inWishlist
  }

  toggleWishlist(product: any) {
    product.inWishlist = !product.inWishlist
    console.log(product.inWishlist ? "Added to wishlist:" : "Removed from wishlist:", product)
    // Implement wishlist functionality
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

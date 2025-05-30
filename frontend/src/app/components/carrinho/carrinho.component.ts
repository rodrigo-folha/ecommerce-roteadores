import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, LOCALE_ID } from '@angular/core';
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RoteadorService } from '../../services/roteador.service';
import { Roteador } from '../../models/roteador.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
registerLocaleData(localePt);

@Component({
  selector: 'app-carrinho',
  providers: [provideNativeDateAdapter(), {
          provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
          { provide: LOCALE_ID, useValue: 'pt-BR'}
        ],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent {
  carrinhoItens:ItemCarrinho[] = [];
  roteador: Roteador = new Roteador();

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
    private roteadorService: RoteadorService,
  ) {
  }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinhoItens = itens;
    })
  }

  // removerItem(item: ItemCarrinho) {
  //   this.carrinhoService.remover(item);
  // }

  // calcularTotal() {
  //   return this.carrinhoItens.reduce((total, item) => total + item.quantidade * item.preco, 0);
  // }

  finalizarCompra() {
    
  }

  aumentarQuantidade(item: any) {
    item.quantidade++;
  }

  diminuirQuantidade(item: any) {
    if (item.quantidade > 1) {
      item.quantidade--;
    } else {
      this.removerItem(item);
    }
  }

  removerItem(item: any) {
    const index = this.carrinhoItens.indexOf(item);
    if (index >= 0) {
      this.carrinhoItens.splice(index, 1);
    }
  }

  calcularTotal() {
    return this.carrinhoItens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  imagemProdutos(item: ItemCarrinho) {
    this.roteadorService.findById(item.id.toString()).subscribe((roteadorItem) => {
      this.roteador = roteadorItem;
    })

    console.log('Esse é o roteador: ', this.roteador);
    this.roteadorService.getUrlImage(this.roteador.listaImagem[0].toString());
    console.log('Essa é a img: ', this.roteador.listaImagem[0].toString())
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent {
  carrinhoItens:ItemCarrinho[] = [];

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinhoItens = itens;
    })
  }

  removerItem(item: ItemCarrinho) {
    this.carrinhoService.remover(item);
  }

  calcularTotal() {
    return this.carrinhoItens.reduce((total, item) => total + item.quantidade * item.preco, 0);
  }

  finalizarCompra() {
    
  }
}

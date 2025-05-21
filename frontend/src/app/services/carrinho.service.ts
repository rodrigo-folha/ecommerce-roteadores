import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ItemCarrinho } from '../models/item-carrinho';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();
  quantidadeProdutos$ = this.carrinho$.pipe(map(items => items.length));

  constructor(private localStorageService: LocalStorageService) {
    const carrinhoArmazenado = localStorageService.getItem('carrinho') || [];
    this.carrinhoSubject.next(carrinhoArmazenado);
  }

  adicionar(roteador: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(item => item.id === roteador.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinhoAtual.push({
        ...roteador
      })
    }

    this.carrinhoSubject.next(carrinhoAtual);
    this.atualizarArmazenamentoLocal();
  }

  atualizarArmazenamentoLocal() {
    this.localStorageService.setItem('carrinho', this.carrinhoSubject.value);
  }


  remover(item: ItemCarrinho) {
    const carrinhoAtual = this.carrinhoSubject.value;
    const carrinhoAtualizado = carrinhoAtual.filter(itemCarrinho => itemCarrinho !== item);

    this.carrinhoSubject.next(carrinhoAtualizado);
    this.atualizarArmazenamentoLocal();
  }

  removerTudo() {
    this.carrinhoSubject.next([]);
    this.localStorageService.removeItem('carrinho');
    // window.location.reload();
  }

  obter() {
    return this.carrinhoSubject.value;
  }

}
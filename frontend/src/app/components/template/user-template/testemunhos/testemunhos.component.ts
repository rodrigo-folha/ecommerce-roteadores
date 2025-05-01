import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testemunhos',
  imports: [CommonModule],
  templateUrl: './testemunhos.component.html',
  styleUrl: './testemunhos.component.css'
})
export class TestemunhosComponent {
  testimonials = [
    {
      name: "Rodrigo Folha",
      avatar: "../login/placeholder.svg",
      rating: 5,
      content:
        "Eu venho comprando aqui há anos e a qualidade é sempre excelente. Recomendo!",
    },
    {
      name: "Otávio Nardini",
      avatar: "../login/placeholder.svg",
      rating: 4,
      content:
        "Comprei um roteador com conexão gigabit, chegou certinho dentro do prazo, o roteador é ótimo. Recomendo",
    },
    {
      name: "Clara",
      avatar: "../login/placeholder.svg",
      rating: 5,
      content:
        "Produto excelente e entrega fenomenal, chegou antes do prazo previsto!",
    },
  ]
}

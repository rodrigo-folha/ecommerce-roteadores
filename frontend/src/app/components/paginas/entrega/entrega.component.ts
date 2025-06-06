import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-entrega',
  imports: [CommonModule],
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent {
  shippingRates = [
    {
      region: "Sudeste",
      standard: "2-4 dias úteis",
      express: "1-2 dias úteis",
      standardPrice: "R$ 15,90",
      expressPrice: "R$ 25,90",
    },
    {
      region: "Sul",
      standard: "3-5 dias úteis",
      express: "2-3 dias úteis",
      standardPrice: "R$ 18,90",
      expressPrice: "R$ 28,90",
    },
    {
      region: "Centro-Oeste",
      standard: "4-6 dias úteis",
      express: "2-4 dias úteis",
      standardPrice: "R$ 22,90",
      expressPrice: "R$ 32,90",
    },
    {
      region: "Nordeste",
      standard: "5-8 dias úteis",
      express: "3-5 dias úteis",
      standardPrice: "R$ 25,90",
      expressPrice: "R$ 35,90",
    },
    {
      region: "Norte",
      standard: "6-10 dias úteis",
      express: "4-6 dias úteis",
      standardPrice: "R$ 28,90",
      expressPrice: "R$ 38,90",
    },
  ]
}

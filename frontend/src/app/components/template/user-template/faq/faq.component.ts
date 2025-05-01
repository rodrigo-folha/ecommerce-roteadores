import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface FaqItem {
  question: string
  answer: string
  isOpen: boolean
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqItems: FaqItem[] = [
    {
      question: "Quais formas de pagamento são aceitas?",
      answer:
        'Aceitamos cartões de crédito (Visa, MasterCard, Elo, etc.), Pix, boleto bancário e carteiras digitais como Mercado Pago e PayPal.',
      isOpen: false,
    },
    {
      question: "Posso parcelar minha compra?",
      answer:
        "Sim! Parcelamos em até 12x no cartão de crédito, com ou sem juros dependendo da promoção vigente.",
      isOpen: false,
    },
    {
      question: "É seguro comprar neste site?",
      answer:
        "Sim. Nosso site possui certificado SSL, e seus dados são criptografados e protegidos durante todo o processo de compra.",
      isOpen: false,
    },
    {
      question: "Qual o prazo de entrega?",
      answer:
        "O prazo varia conforme o CEP. Ele será exibido no momento da compra.",
      isOpen: false,
    },
    {
      question: "Posso rastrear meu pedido?",
      answer:
        "Sim. Após o envio, você receberá um e-mail com o código de rastreio e poderá acompanhar em tempo real.",
      isOpen: false,
    },
    {
      question: "Posso trocar ou devolver um produto?",
      answer:
        "Sim. Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.",
      isOpen: false,
    },
  ]

  toggleAccordion(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen
  }
}

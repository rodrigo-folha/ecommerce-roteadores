import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  ngOnInit() {
    window.scroll(0, 0);
  }

  faqCategories = [
    {
      title: "Compras e Pedidos",
      icon: "🛒",
      questions: [
        {
          question: "Como faço um pedido no Connect Hub?",
          answer:
            "Navegue pelos produtos, adicione ao carrinho e finalize a compra. Aceitamos cartão de crédito, débito, PIX e boleto bancário.",
          isOpen: false,
        },
        {
          question: "Posso cancelar meu pedido?",
          answer:
            "Sim, você pode cancelar seu pedido até 2 horas após a confirmação. Após esse prazo, entre em contato conosco.",
          isOpen: false,
        },
        {
          question: "Como acompanho meu pedido?",
          answer:
            'Acesse sua conta no site, vá em "Meus Pedidos" e clique no pedido desejado para ver o status e rastreamento.',
          isOpen: false,
        },
        {
          question: "Vocês emitem nota fiscal?",
          answer:
            "Sim, emitimos nota fiscal eletrônica para todos os pedidos. Ela é enviada por e-mail após a confirmação do pagamento.",
          isOpen: false,
        },
      ],
    },
    {
      title: "Produtos e Especificações",
      icon: "📡",
      questions: [
        {
          question: "Qual roteador é ideal para minha casa?",
          answer:
            "Depende do tamanho da área e número de dispositivos. Para casas até 100m², recomendamos AC1200. Para áreas maiores, AC1900 ou superior.",
          isOpen: false,
        },
        {
          question: "Qual a diferença entre AC e AX?",
          answer:
            "AC é o padrão WiFi 5 (802.11ac) e AX é o WiFi 6 (802.11ax). O AX oferece maior velocidade, menor latência e melhor eficiência energética.",
          isOpen: false,
        },
        {
          question: "Os roteadores vêm configurados?",
          answer:
            "Não, os roteadores vêm com configuração de fábrica. Oferecemos suporte gratuito para configuração inicial.",
          isOpen: false,
        },
        {
          question: "Posso usar qualquer provedor de internet?",
          answer: "Sim, nossos roteadores são compatíveis com todos os provedores de internet do Brasil.",
          isOpen: false,
        },
      ],
    },
    {
      title: "Entrega e Frete",
      icon: "🚚",
      questions: [
        {
          question: "Qual o prazo de entrega?",
          answer:
            "Varia conforme a região: Sudeste 2-4 dias, Sul 3-5 dias, Centro-Oeste 4-6 dias, Nordeste 5-8 dias, Norte 6-10 dias úteis.",
          isOpen: false,
        },
        {
          question: "Vocês entregam em todo o Brasil?",
          answer: "Sim, entregamos em todo território nacional através dos Correios e transportadoras parceiras.",
          isOpen: false,
        },
        {
          question: "Como calcular o frete?",
          answer: "O frete é calculado automaticamente no carrinho baseado no CEP de destino e peso dos produtos.",
          isOpen: false,
        },
        {
          question: "Frete grátis a partir de quanto?",
          answer: "Oferecemos frete grátis para compras acima de R$ 299,00 (entrega padrão) para todo o Brasil.",
          isOpen: false,
        },
      ],
    },
    {
      title: "Suporte Técnico",
      icon: "🔧",
      questions: [
        {
          question: "Como configurar meu roteador?",
          answer:
            "Oferecemos suporte gratuito por telefone, WhatsApp ou e-mail. Também temos vídeos tutoriais em nosso site.",
          isOpen: false,
        },
        {
          question: "Meu roteador não está funcionando, o que fazer?",
          answer:
            "Primeiro, verifique as conexões e reinicie o equipamento. Se o problema persistir, entre em contato com nosso suporte.",
          isOpen: false,
        },
        {
          question: "Vocês fazem configuração remota?",
          answer:
            "Sim, oferecemos configuração remota gratuita para clientes que compraram conosco. Agende pelo WhatsApp.",
          isOpen: false,
        },
        {
          question: "Como atualizar o firmware?",
          answer:
            "Acesse a interface do roteador (geralmente 192.168.1.1), vá em Administração > Atualização de Firmware e siga as instruções.",
          isOpen: false,
        },
      ],
    },
  ]

  toggleQuestion(categoryIndex: number, questionIndex: number) {
    this.faqCategories[categoryIndex].questions[questionIndex].isOpen =
      !this.faqCategories[categoryIndex].questions[questionIndex].isOpen
  }

  expandAll() {
    this.faqCategories.forEach((category) => {
      category.questions.forEach((question) => {
        question.isOpen = true
      })
    })
  }

  collapseAll() {
    this.faqCategories.forEach((category) => {
      category.questions.forEach((question) => {
        question.isOpen = false
      })
    })
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-garantia',
  imports: [CommonModule],
  templateUrl: './garantia.component.html',
  styleUrl: './garantia.component.css'
})
export class GarantiaComponent {

  ngOnInit() {
    window.scroll(0, 0);
  }

  warrantyTypes = [
    {
      title: 'Garantia de Fábrica',
      duration: '12 meses',
      coverage: 'Defeitos de fabricação e componentes',
      description: 'Cobertura padrão oferecida pelo fabricante para todos os roteadores.'
    },
    {
      title: 'Garantia Estendida Connect Hub',
      duration: '24 meses',
      coverage: 'Defeitos + Suporte técnico premium',
      description: 'Extensão da garantia com suporte técnico especializado e atendimento prioritário.'
    },
    {
      title: 'Garantia Empresarial',
      duration: '36 meses',
      coverage: 'Cobertura completa + Substituição',
      description: 'Para empresas, inclui substituição imediata e suporte 24/7.'
    }
  ];

  serviceSteps = [
    {
      step: 1,
      title: 'Contato Inicial',
      description: 'Entre em contato conosco informando o problema e número de série do produto.'
    },
    {
      step: 2,
      title: 'Diagnóstico',
      description: 'Nossa equipe técnica fará um diagnóstico inicial e orientará sobre os próximos passos.'
    },
    {
      step: 3,
      title: 'Envio do Produto',
      description: 'Envie o produto para nossa assistência técnica com frete por nossa conta.'
    },
    {
      step: 4,
      title: 'Reparo ou Substituição',
      description: 'Realizamos o reparo ou substituição do produto conforme necessário.'
    },
    {
      step: 5,
      title: 'Devolução',
      description: 'Produto reparado é devolvido sem custo adicional em até 15 dias úteis.'
    }
  ];
}

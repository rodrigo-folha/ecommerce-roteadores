import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-seguranca',
  imports: [CommonModule],
  templateUrl: './seguranca.component.html',
  styleUrl: './seguranca.component.css'
})
export class SegurancaComponent {

  ngOnInit() {
    window.scroll(0, 0);
  }

  securityFeatures = [
    {
      icon: "🔒",
      title: "Criptografia SSL/TLS",
      description: "Todas as transações são protegidas com criptografia de 256 bits",
    },
    {
      icon: "🛡️",
      title: "Certificado Digital",
      description: "Site certificado por autoridades reconhecidas mundialmente",
    },
    {
      icon: "💳",
      title: "PCI DSS Compliance",
      description: "Padrão de segurança para processamento de cartões de crédito",
    },
    {
      icon: "🔐",
      title: "Autenticação 3D Secure",
      description: "Camada adicional de segurança para pagamentos online",
    },
  ]

  fraudPrevention = [
    "Verificação de identidade em compras suspeitas",
    "Monitoramento em tempo real de transações",
    "Análise de comportamento de compra",
    "Bloqueio automático de atividades fraudulentas",
    "Verificação de endereço e dados pessoais",
    "Sistema de alertas para atividades incomuns",
  ]

  dataProtection = [
    "Dados pessoais criptografados em nossos servidores",
    "Acesso restrito apenas a funcionários autorizados",
    "Backup seguro e redundante das informações",
    "Política rigorosa de retenção de dados",
    "Conformidade com a Lei Geral de Proteção de Dados (LGPD)",
    "Auditoria regular dos sistemas de segurança",
  ]
}

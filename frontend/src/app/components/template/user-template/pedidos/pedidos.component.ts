import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido.model';
import { SituacaoPedidoPipe } from '../../../../pipe/situacaoPedido.pipe';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, SituacaoPedidoPipe],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
  // pedido: any = null
  loading = true
  pedido: Pedido | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
  ) {

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.carregarPedido(id)
    } else {
      this.router.navigate(['minha-conta'])
    }
  }
  
  carregarPedido(idPedido: string) {
    this.pedidoService.findById(idPedido).subscribe((data) => {
      this.pedido = data;
    })
  }

  // loadOrderDetails(id: number) {
  //   // Simulando dados do pedido
  //   setTimeout(() => {
  //     this.pedido = {
  //       id: 1,
  //       // data: "2025-06-04T20:39:10.518635",
  //       valorTotal: 394.87,
  //       listaItemPedido: [
  //         {
  //           idProduto: 1,
  //           nome: "ROT WIFI GIGA AC1200MBPS 4ANT Tenda AC8",
  //           quantidade: 1,
  //           valor: 394.87,
  //         },
  //       ],
  //       statusPedidos: [
  //         {
  //           dataAtualizacao: "2025-06-04T20:39:10.544354",
  //           situacaoPedido: "AGUARDANDO_PAGAMENTO",
  //         },
  //         {
  //           dataAtualizacao: "2025-06-04T20:39:10.551069",
  //           situacaoPedido: "PAGAMENTO_AUTORIZADO",
  //         },
  //       ],
  //       enderecoEntrega: {
  //         id: 1,
  //         logradouro: "Z",
  //         bairro: "!",
  //         numero: "R",
  //         complemento: "string",
  //         cep: "B",
  //         cidade: {
  //           id: 1,
  //           nome: "Palmas",
  //           estado: {
  //             id: 1,
  //             nome: "Tocantins",
  //             sigla: "TO",
  //           },
  //         },
  //       },
  //       pagamento: {
  //         id: 1,
  //         titular: "w",
  //         cpfCartao: "*",
  //         numero: "&",
  //         dataValidade: "2028-03-10",
  //         cvc: "III",
  //         modalidade: "CREDITO",
  //       },
  //     }
  //     this.loading = false
  //   }, 1000)
  // }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      AGUARDANDO_PAGAMENTO: "Aguardando Pagamento",
      PAGAMENTO_AUTORIZADO: "Pagamento Autorizado",
      PROCESSANDO: "Processando",
      ENVIADO: "Enviado",
      ENTREGUE: "Entregue",
      CANCELADO: "Cancelado",
    }
    return statusTexts[status] || status
  }

  goBack() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/minha-conta'], { queryParams: { aba: 5 } });
    });
  }
}
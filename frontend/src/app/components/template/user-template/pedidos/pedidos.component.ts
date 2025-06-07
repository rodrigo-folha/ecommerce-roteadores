import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido.model';
import { SituacaoPedidoPipe } from '../../../../pipe/situacaoPedido.pipe';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';
registerLocaleData(localePt);

@Component({
  selector: 'app-pedidos',
  providers: [provideNativeDateAdapter(), {
              provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
              { provide: LOCALE_ID, useValue: 'pt-BR'}
            ],
  imports: [CommonModule, SituacaoPedidoPipe, RouterLink],
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
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
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
    const usuarioLocalStorage = localStorage.getItem('usuario_logado');

    if (!usuarioLocalStorage) {
      this.snackBar.open("Você não está autenticado.", 'Fechar', {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "center"
      });
      this.router.navigate(['/login']);
      return;
    }

    this.pedidoService.findById(idPedido).subscribe((data) => {
      this.pedido = data;
      const clienteConvertido = JSON.parse(usuarioLocalStorage);
      this.clienteService.findByUsuario(clienteConvertido.email).subscribe((cliente) => {
        if (cliente.id !== data.idCliente) {
            this.snackBar.open("Você não pode acessar este pedido.", 'Fechar', {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          this.router.navigate(['/minha-conta']);
          return;
        }
      })
    })
  }

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

  exibirBotaoPagamento(): boolean {
    const modalidade = this.pedido?.modalidadePagamento?.toLowerCase();
    const statusList = this.pedido?.statusPedidos;

    if (!statusList || statusList.length === 0) return false;

    // Pega o último status com base na data
    const ultimoStatus = statusList.reduce((maisRecente, atual) => {
      return new Date(atual.dataAtualizacao) > new Date(maisRecente.dataAtualizacao) ? atual : maisRecente;
    });

    const statusAtual = ultimoStatus?.situacaoPedido;

    return (
      (modalidade === 'pix' || modalidade === 'boleto') &&
      statusAtual === 'AGUARDANDO_PAGAMENTO'
    );
  }

  exibirBotaoCancelar(): boolean {
    const statusList = this.pedido?.statusPedidos;

    if (!statusList || statusList.length === 0) return false;

    const ultimoStatus = statusList.reduce((maisRecente, atual) => {
      return new Date(atual.dataAtualizacao) > new Date(maisRecente.dataAtualizacao) ? atual : maisRecente;
    });

    const statusAtual = ultimoStatus?.situacaoPedido;

    // Só permite cancelar se o pedido estiver aguardando pagamento
    return statusAtual === 'PAGAMENTO_AUTORIZADO';
  }

  exibirBotaoDevolver(): boolean {
    const statusList = this.pedido?.statusPedidos;

    if (!statusList || statusList.length === 0) return false;

    const ultimoStatus = statusList.reduce((maisRecente, atual) => {
      return new Date(atual.dataAtualizacao) > new Date(maisRecente.dataAtualizacao) ? atual : maisRecente;
    });

    const statusAtual = ultimoStatus?.situacaoPedido;

    // Só permite cancelar se o pedido estiver aguardando pagamento
    return statusAtual === 'ENTREGUE';
  }

  realizarPagamento() {
    if (!this.pedido) return;

    const idPedido = this.pedido.id;
    const modalidade = this.pedido.modalidadePagamento?.toLowerCase();

    if (modalidade === 'pix') {
      const idPix = this.pedido.id;
      if (idPix) {
        this.pedidoService.pagarPix(idPedido, idPix).subscribe({
          next: () => {
            this.showSnackbarTopPosition('Pagamento via PIX realizado com sucesso!')
            this.carregarPedido(String(idPedido)); // Atualiza os dados do pedido
          },
          error: (err) => {
            console.error('Erro ao pagar com PIX:', err);
            alert('Erro ao realizar pagamento via PIX.');
          }
        });
      } else {
        alert('ID do PIX não encontrado.');
      }
    } else if (modalidade === 'boleto') {
      const idBoleto = this.pedido.id;
      if (idBoleto) {
        this.pedidoService.pagarBoleto(idPedido, idBoleto).subscribe({
          next: () => {
            this.showSnackbarTopPosition('Pagamento via Boleto realizado com sucesso!')
            this.carregarPedido(String(idPedido));
          },
          error: (err) => {
            console.error('Erro ao pagar com boleto:', err);
            alert('Erro ao realizar pagamento via boleto.');
          }
        });
      } else {
        alert('ID do boleto não encontrado.');
      }
    } else {
      alert('Modalidade de pagamento inválida.');
    }
  }

  cancelarPedido() {
    if (!this.pedido) return;

    const confirmar = confirm('Tem certeza que deseja cancelar este pedido?');

    if (!confirmar) return;

    const idPedido = this.pedido.id;

    this.pedidoService.cancelarPedido(idPedido).subscribe({
      next: () => {
        this.showSnackbarTopPosition('Pedido cancelado com sucesso!');
        this.carregarPedido(String(idPedido));
      },
      error: (err) => {
        console.error('Erro ao cancelar o pedido:', err);
        alert(err.error?.detail || 'Erro ao cancelar o pedido.');
      }
    });
  }

  devolverPedido() {
    if (!this.pedido) return;

    const confirmar = confirm('Tem certeza que deseja devolver este pedido?');

    if (!confirmar) return;

    const idPedido = this.pedido.id;

    this.pedidoService.devolverPedido(idPedido).subscribe({
      next: () => {
        this.showSnackbarTopPosition('Pedido devolvido com sucesso!');
        this.carregarPedido(String(idPedido));
      },
      error: (err) => {
        console.error('Erro ao devolver o pedido:', err);
        alert(err.error?.detail || 'Erro ao devolver o pedido.');
      }
    });
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

}
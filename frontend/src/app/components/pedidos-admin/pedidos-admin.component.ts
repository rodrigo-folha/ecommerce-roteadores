import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Pedido } from '../../models/pedido.model';
import { PedidoResumido } from '../../models/pedido-resumido.model';
import { PedidoService } from '../../services/pedido.service';
import { SituacaoPedidoPipe } from '../../pipe/situacaoPedido.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pedidos-admin',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
    MatSelectModule,
    FormsModule,
    SituacaoPedidoPipe,
  ],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: './pedidos-admin.component.css'
})
export class PedidosAdminComponent {

  pedidos: Pedido[] = [];
  pedidosResumidos: PedidoResumido[] = [];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  displayedColumns: string[] = ['id', 'valorTotal', 'metodoPagamento', 'statusPedido', 'data', 'acao'];

  showSearch = false;
  filterValue = '';
  pedidosFiltrados: Pedido[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  statusPedidos = [
    { valor: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
    { valor: 'PAGAMENTO_AUTORIZADO', label: 'Pagamento Autorizado' },
    { valor: 'PAGAMENTO_EXPIRADO', label: 'Pagamento Expirado' },
    { valor: 'CANCELADO', label: 'Cancelado' },
    { valor: 'ENVIADO', label: 'Enviado' },
    { valor: 'ENTREGUE', label: 'Entregue' },
    { valor: 'DEVOLVIDO', label: 'Devolvido' },
  ];

  constructor(private pedidoService: PedidoService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.pedidoService.findAllResumido(this.page, this.pageSize).subscribe((data) => {
      this.pedidosResumidos = data.resultado;
      this.totalRecords = data.total
    });
  }
  
    applyFilter(event?: Event): void {
    }
  
    toggleSearch(): void {
      this.showSearch = !this.showSearch;
    }
  
    paginar(event: PageEvent): void {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
  
      if (this.filterValue) {
        this.applyFilter();
      } else {
        this.carregarPedidos();
      }
    }


  excluir(pedido: Pedido): void {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Vou não vai poder reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.delete(pedido).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Pedido deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/pedidos']);
            });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
            Swal.fire({
              title: "Erro!",
              text: "Não foi possível deletar, pois a propriedade está sendo utilizada por um roteador!",
              icon: "error"
            });
          }
        });
      }
    });


  }

  atualizarStatus(idPedido: number, novoStatus: string) {
  this.pedidoService.atualizarStatus(idPedido, novoStatus).subscribe({
    next: () => {
      this.snackBar.open('Status atualizado com sucesso!', 'Fechar', { duration: 3000 });
    },
    error: (err) => {
      console.error('Erro ao atualizar status:', err);
      this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 3000 });
    }
  });
}
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ProtocoloSeguranca } from '../../../models/protocolo-seguranca.model';
import { ProtocoloSegurancaService } from '../../../services/protocolo-seguranca.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-protocoloseguranca-list',
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
  ],
  templateUrl: './protocoloseguranca-list.component.html',
  styleUrl: './protocoloseguranca-list.component.css',
})
export class ProtocolosegurancaListComponent {
  protocolosSeguranca: ProtocoloSeguranca[] = [];
  displayedColumns: string[] = ['id', 'nome', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  protocolosSegurancaFiltrados: ProtocoloSeguranca[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  constructor(
    private protocoloSegurancaService: ProtocoloSegurancaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProtocolosSeguranca();
  }

  carregarProtocolosSeguranca(): void {
    this.protocoloSegurancaService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.protocolosSegurancaFiltrados = data.resultado;
      this.totalRecords = data.total;
    });
  }

  applyFilter(event?: Event): void {
    this.filterValue = this.filtro?.trim().toLowerCase() || '';
    this.page = 0;

    if (this.filterValue !== '' && this.tipoFiltro === 'nome') {
      this.protocoloSegurancaService.findByNome(this.filterValue, this.page, this.pageSize).subscribe({
        next: (item) => {
          this.protocolosSegurancaFiltrados = item.resultado;
          this.totalRecords = item.total;
        },
        error: (error) => {
          console.error('Erro ao buscar por nome' + JSON.stringify(error));
        }
      })
    } else {
      this.protocoloSegurancaService.findAll(this.page, this.pageSize).subscribe((item) => {
        this.protocolosSeguranca = item.resultado;
        this.totalRecords = item.total;
        this.carregarProtocolosSeguranca();
      })
    }
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
      this.carregarProtocolosSeguranca();
    }
  }

  excluir(protocoloSeguranca: ProtocoloSeguranca): void {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Vou não vai poder reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.protocoloSegurancaService.delete(protocoloSeguranca).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deletado!',
              text: 'Protocolo de Segurança deletado com sucesso!',
              icon: 'success',
            });
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/admin/protocolosseguranca']);
              });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
            Swal.fire({
              title: "Erro!",
              text: "Não foi possível deletar, pois a propriedade está sendo utilizada por um roteador!",
              icon: "error"
            });
          },
        });
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CnpjPipe } from '../../../pipe/cnpj.pipe';

@Component({
  selector: 'app-fornecedor-list',
  providers: [provideNativeDateAdapter(), {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
    ],
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
    CnpjPipe,
  ],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css',
})
export class FornecedorListComponent {
  fornecedores: Fornecedor[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'email', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  fornecedoresFiltrados: Fornecedor[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  constructor(private fornecedorService: FornecedorService, private router: Router) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.fornecedoresFiltrados = data.resultado;
      this.totalRecords = data.total;
    });
  }

    applyFilter(event?: Event): void {
      this.filterValue = this.filtro?.trim().toLowerCase() || '';
      this.page = 0;
      if (this.filterValue !== '' && this.tipoFiltro === 'nome') {
      this.fornecedorService.findByNome(this.filterValue, this.page, this.pageSize).subscribe({
        next: (item) => {
          this.fornecedoresFiltrados = item.resultado;
          this.totalRecords = item.total;
        },
        error: (error) => {
          console.error('Erro ao buscar por nome' + JSON.stringify(error));
        }
      })
    } else {
      this.fornecedorService.findAll(this.page, this.pageSize).subscribe((item) => {
        this.fornecedores = item.resultado;
        this.totalRecords = item.total;
        this.carregarFornecedores();
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
        this.carregarFornecedores();
      }
    }
  
  excluir(fornecedor: Fornecedor): void {
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
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Fornecedor deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/fornecedores']);
            });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
          }
        });
      }
    });
  }
}

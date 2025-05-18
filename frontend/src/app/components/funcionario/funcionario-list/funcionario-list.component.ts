import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../../../services/funcionario.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfPipe } from '../../../pipe/cpf.pipe';

@Component({
  selector: 'app-funcionario-list',
  providers: [provideNativeDateAdapter(), {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
    ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
    MatSelectModule,
    FormsModule,
    CpfPipe,
  ],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css',
})
export class FuncionarioListComponent {
  funcionarios: Funcionario[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'dataNascimento', 'email', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  funcionariosFiltrados: Funcionario[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  constructor(private funcionarioService: FuncionarioService, private router: Router) {}


  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.funcionarioService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.funcionariosFiltrados = data.resultado;
      this.totalRecords = data.total;
    });
  }

  applyFilter(event?: Event): void {
    this.filterValue = this.filtro?.trim().toLowerCase();
    this.page = 0;
    if (this.filterValue !== '' && this.tipoFiltro === 'nome') {
      this.funcionarioService.findByNome(this.filterValue, this.page, this.pageSize).subscribe({
        next: (item) => {
          this.funcionariosFiltrados = item.resultado;
          this.totalRecords = item.total;
        },
        error: (error) => {
          console.error('Erro ao buscar por nome' + JSON.stringify(error));
        }
      })
    } else {
      this.funcionarioService.findAll(this.page, this.pageSize).subscribe((item) => {
        this.funcionariosFiltrados = item.resultado;
        this.totalRecords = item.total;
        this.carregarFuncionarios();
      })
    }
  }

  toggleSearch():void {
    this.showSearch = !this.showSearch;
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.filterValue) {
      this.applyFilter();
    } else {
      this.carregarFuncionarios();
    }
  }
  
  excluir(funcionario: Funcionario): void {
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
        this.funcionarioService.delete(funcionario).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Funcionario deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/funcionarios']);
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

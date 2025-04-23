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

  constructor(private funcionarioService: FuncionarioService, private router: Router) {}


  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.funcionarioService.findAll().subscribe((data) => {
      this.funcionarios = data.resultado;
      this.applyCurrentFilter();
      this.totalRecords = data.total;
    });
  }

  applyCurrentFilter(): void {
    const normalizedFilter = this.filterValue.trim().toLowerCase();
    
    const filtered = this.funcionarios.filter(
      (data) => 
        data.usuario.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.usuario.cpf.toString().toLowerCase().includes(normalizedFilter) ||
        data.usuario.email.toString().toLowerCase().includes(normalizedFilter) ||
        data.usuario.dataNascimento.toString().toLowerCase().includes(normalizedFilter)
    );
  
    this.funcionariosFiltrados = filtered.slice(
      this.page * this.pageSize,
      (this.page + 1) * this.pageSize
    );
  
    this.totalRecords = filtered.length;  
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.page = 0;
  this.applyCurrentFilter();
  }

  toggleSearch():void {
    this.showSearch = !this.showSearch;
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.filterValue) {
      this.applyCurrentFilter();
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

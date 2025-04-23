import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cliente-list',
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
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',
})
export class ClienteListComponent {
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'dataNascimento', 'email', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  clientesFiltrados: Cliente[] = [];

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.findAll().subscribe((data) => {
      this.clientes = data.resultado;
      this.applyCurrentFilter();
      this.totalRecords = data.total;
    });
  }

  applyCurrentFilter(): void {
    const normalizedFilter = this.filterValue.trim().toLowerCase();
    
    const filtered = this.clientes.filter(
      (data) => 
        data.usuario.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.usuario.cpf.toString().toLowerCase().includes(normalizedFilter) ||
        data.usuario.email.toString().toLowerCase().includes(normalizedFilter) ||
        data.usuario.dataNascimento.toString().toLowerCase().includes(normalizedFilter)
    );
  
    this.clientesFiltrados = filtered.slice(
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
      this.carregarClientes();
    }
  }
  
  excluir(cliente: Cliente): void {
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
        this.clienteService.delete(cliente).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Cliente deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/clientes']);
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

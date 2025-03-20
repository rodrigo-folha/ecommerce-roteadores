import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../../../services/funcionario.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

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
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css',
})
export class FuncionarioListComponent {
  // controle de paginacao
  totalRegistros = 0;
  pageSize = 5;
  page = 0;
  funcionarios: Funcionario[] = [];

  constructor(private funcionarioService: FuncionarioService, private router: Router) {}

  displayedColumns: string[] = [
    'id',
    'nome',
    'cpf',
    'dataNascimento',
    'email',
    'acao'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.funcionarioService.findAll().subscribe((funcionarios) => {
      this.funcionarios = funcionarios;
      this.dataSource.data = this.funcionarios;
    });
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
        Swal.fire({
          title: "Deletado!",
          text: "Funcionario deletado com sucesso!",
          icon: "success"
        });

        this.funcionarioService.delete(funcionario).subscribe({
          next: () => {
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

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { FornecedorService } from '../../../services/fornecedor.service';

@Component({
  selector: 'app-fornecedor-list',
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
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css',
})
export class FornecedorListComponent {
  // controle de paginacao
  totalRegistros = 0;
  pageSize = 5;
  page = 0;
  fornecedores: Fornecedor[] = [];

  constructor(private fornecedorService: FornecedorService, private router: Router) {}

  displayedColumns: string[] = [
    'id',
    'nome',
    'cnpj',
    'email',
    'acao'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.findAll().subscribe((fornecedores) => {
      this.fornecedores = fornecedores;
      this.dataSource.data = this.fornecedores;
    });
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
        Swal.fire({
          title: "Deletado!",
          text: "Fornecedor deletado com sucesso!",
          icon: "success"
        });

        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
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

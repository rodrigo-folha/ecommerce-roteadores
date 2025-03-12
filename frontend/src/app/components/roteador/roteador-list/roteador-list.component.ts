import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Roteador } from '../../../models/roteador.model';
import { RoteadorService } from '../../../services/roteador.service';

@Component({
  selector: 'app-roteador-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './roteador-list.component.html',
  styleUrl: './roteador-list.component.css',
})
export class RoteadorListComponent {
  // controle de paginacao
  totalRegistros = 0;
  pageSize = 5;
  page = 0;
  roteadores: Roteador[] = [];

  constructor(private roteadorservice: RoteadorService, private router: Router) {}

  displayedColumns: string[] = [
    'id',
    'nome',
    'preco',
    'sistemaOperacional',
    'bandaFrequencia',
    'protocoloSeguranca',
    'quantidadeAntena',
    'sinalWireless',
    'acao'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarRoteadores();
  }

  carregarRoteadores(): void {
    this.roteadorservice.findAll().subscribe((roteadores) => {
      this.roteadores = roteadores;
      this.dataSource.data = this.roteadores;
    });
  }
  
  excluir(roteador: Roteador): void {
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
          text: "Roteador deletado com sucesso!",
          icon: "success"
        });

        this.roteadorservice.delete(roteador).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/roteadores']);
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

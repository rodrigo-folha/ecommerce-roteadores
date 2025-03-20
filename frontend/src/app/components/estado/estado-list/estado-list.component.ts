import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css',
})
export class EstadoListComponent {
  estados: Estado[] = [];

  constructor(private estadoService: EstadoService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarEstados();
  }

  carregarEstados(): void {
    this.estadoService.findAll().subscribe((estados) => {
      this.estados = estados;
      this.dataSource.data = this.estados;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(estado: Estado): void {
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
          text: "Estado deletado com sucesso!",
          icon: "success"
        });

        this.estadoService.delete(estado).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/estados']);
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

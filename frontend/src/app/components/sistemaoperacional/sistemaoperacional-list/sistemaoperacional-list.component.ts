import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SistemaOperacional } from '../../../models/sistema-operacional.model';
import { SistemaOperacionalService } from '../../../services/sistema-operacional.service';

@Component({
  selector: 'app-sistemaoperacional-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './sistemaoperacional-list.component.html',
  styleUrl: './sistemaoperacional-list.component.css',
})
export class SistemaoperacionalListComponent {
  sistemasOperacionais: SistemaOperacional[] = [];

  constructor(private sistemaOperacionalService: SistemaOperacionalService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarSistemasoperacionais();
  }

  carregarSistemasoperacionais(): void {
    this.sistemaOperacionalService.findAll().subscribe((sistemasoperacionais) => {
      this.sistemasOperacionais = sistemasoperacionais;
      this.dataSource.data = this.sistemasOperacionais;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(sistemaOperacional: SistemaOperacional): void {
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
          text: "Sistema Operacional deletado com sucesso!",
          icon: "success"
        });

        this.sistemaOperacionalService.delete(sistemaOperacional).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/sistemasoperacionais']);
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

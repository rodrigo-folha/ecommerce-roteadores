import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Lote } from '../../../models/lote.model';
import { LoteService } from '../../../services/lote.service';

@Component({
  selector: 'app-lote-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './lote-list.component.html',
  styleUrl: './lote-list.component.css',
})
export class LoteListComponent {
  lotes: Lote[] = [];

  constructor(private loteService: LoteService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarlotes();
  }

  carregarlotes(): void {
    this.loteService.findAll().subscribe((lotes) => {
      this.lotes = lotes;
      this.dataSource.data = this.lotes;
    });
  }

  displayedColumns: string[] = ['id', 'codigo', 'estoque', 'data', 'roteador', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(lote: Lote): void {
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
          text: "Lote deletado com sucesso!",
          icon: "success"
        });

        this.loteService.delete(lote).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/lotes']);
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

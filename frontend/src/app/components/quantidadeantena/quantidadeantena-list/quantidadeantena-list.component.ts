import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';

@Component({
  selector: 'app-quantidadeantena-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './quantidadeantena-list.component.html',
  styleUrl: './quantidadeantena-list.component.css',
})
export class QuantidadeantenaListComponent {
  quantidadeAntenas: QuantidadeAntena[] = [];

  constructor(private quantidadeAntenaService: QuantidadeAntenaService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarQuantidadeAntenas();
  }

  carregarQuantidadeAntenas(): void {
    this.quantidadeAntenaService.findAll().subscribe((quantidadeantenas) => {
      this.quantidadeAntenas = quantidadeantenas;
      this.dataSource.data = this.quantidadeAntenas;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(quantidadeAntena: QuantidadeAntena): void {
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
          text: "Quantidade de Antena deletado com sucesso!",
          icon: "success"
        });

        this.quantidadeAntenaService.delete(quantidadeAntena).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/quantidadeantenas']);
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

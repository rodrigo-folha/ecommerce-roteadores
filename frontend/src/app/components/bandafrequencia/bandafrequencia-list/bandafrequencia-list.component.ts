import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BandaFrequencia } from '../../../models/banda-frequencia.model';
import { BandaFrequenciaService } from '../../../services/banda-frequencia.service';

@Component({
  selector: 'app-bandafrequencia-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './bandafrequencia-list.component.html',
  styleUrl: './bandafrequencia-list.component.css',
})
export class BandafrequenciaListComponent {
  bandaFrequencias: BandaFrequencia[] = [];

  constructor(
    private bandaFrequenciaService: BandaFrequenciaService,
    private router: Router
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarBandafrequencias();
  }

  carregarBandafrequencias(): void {
    this.bandaFrequenciaService.findAll().subscribe((bandaFrequencias) => {
      this.bandaFrequencias = bandaFrequencias;
      this.dataSource.data = this.bandaFrequencias;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(bandaFrequencia: BandaFrequencia): void {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Vou não vai poder reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deletado!',
          text: 'Sistema Operacional deletado com sucesso!',
          icon: 'success',
        });

        this.bandaFrequenciaService.delete(bandaFrequencia).subscribe({
          next: () => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/bandafrequencias']);
              });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
          },
        });
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
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
    MatInputModule,
    MatFormFieldModule,
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
  displayedColumns: string[] = ['id', 'nome', 'acao'];
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  showSearch = false;
  filterValue = '';
  bandaFrequenciasFiltrado: BandaFrequencia[] = [];

  constructor(
    private bandaFrequenciaService: BandaFrequenciaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarBandafrequencias();
  }

  carregarBandafrequencias(): void {
      this.bandaFrequenciaService.findAll().subscribe((data) => {
        this.bandaFrequencias = data.resultado;
        this.applyCurrentFilter();
        this.totalRecords = data.total;
      });
    }
  
    applyCurrentFilter(): void {
      const normalizedFilter = this.filterValue.trim().toLowerCase();
  
      const filtered = this.bandaFrequencias.filter((data) =>
        data.nome.toString().toLowerCase().includes(normalizedFilter)
      );
  
      this.bandaFrequenciasFiltrado = filtered.slice(
        this.page * this.pageSize,
        (this.page + 1) * this.pageSize
      );
  
      this.totalRecords = filtered.length;
    }
  
    applyFilter(event: Event): void {
      this.filterValue = (event.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
      this.page = 0;
      this.applyCurrentFilter();
    }
  
    toggleSearch(): void {
      this.showSearch = !this.showSearch;
    }
  
    paginar(event: PageEvent): void {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
  
      if (this.filterValue) {
        this.applyCurrentFilter();
      } else {
        this.carregarBandafrequencias();
      }
    }

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
        this.bandaFrequenciaService.delete(bandaFrequencia).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deletado!',
              text: 'Banda de Frequência deletada com sucesso!',
              icon: 'success',
            });
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/admin/bandafrequencias']);
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

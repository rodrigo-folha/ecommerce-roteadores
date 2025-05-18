import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Roteador } from '../../../models/roteador.model';
import { RoteadorService } from '../../../services/roteador.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
registerLocaleData(localePt);


@Component({
  selector: 'app-roteador-list',
  providers: [provideNativeDateAdapter(), {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
      { provide: LOCALE_ID, useValue: 'pt-BR'}
    ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
    MatSelectModule,
  ],
  templateUrl: './roteador-list.component.html',
  styleUrl: './roteador-list.component.css',
})
export class RoteadorListComponent {
  roteadores: Roteador[] = [];
  displayedColumns: string[] = [
    'id',
    'nome',
    'preco',
    'sistemaOperacional',
    'bandaFrequencia',
    'protocoloSeguranca',
    'quantidadeAntena',
    'sinalWireless',
    'fornecedor',
    'estoque',
    'acao'
  ];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  roteadoresFiltrados: Roteador[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  constructor(private roteadorService: RoteadorService, private router: Router) {}

  ngOnInit(): void {
    this.carregarRoteadores();
  }

  carregarRoteadores(): void {
    this.roteadorService.findAll(this.page, this.pageSize).subscribe((roteadores) => {
      this.roteadoresFiltrados = roteadores.resultado;

      this.roteadoresFiltrados.forEach((roteador) => {
        this.roteadorService.countQuantidadeTotalById(roteador.id).subscribe((estoque) => {
          roteador.quantidadeEstoque = estoque;
        });
      });

      this.totalRecords = roteadores.total;
    })
  }
    
  applyFilter(event?: Event): void {
    this.filterValue = this.filtro?.trim().toLowerCase() || '';
    this.page = 0;
    if (this.filterValue !== '' && this.tipoFiltro === 'nome') {
      this.roteadorService.findByNome(this.filterValue, this.page, this.pageSize).subscribe({
        next: (roteadores) => {
          this.roteadoresFiltrados = roteadores.resultado;
          this.totalRecords = roteadores.total;
          this.roteadoresFiltrados.forEach((roteador) => {
            this.roteadorService.countQuantidadeTotalById(roteador.id).subscribe((estoque) => {
              roteador.quantidadeEstoque = estoque;
            });
          });
        },
        error: (error) => {
          console.error('Erro ao buscar por nome' + JSON.stringify(error));

        }
      }
    ); 
    } else {
      this.roteadorService.findAll(this.page, this.pageSize).subscribe((roteadores) => {
        this.roteadoresFiltrados = roteadores.resultado;
        this.totalRecords = roteadores.total;
        this.roteadoresFiltrados.forEach((roteador) => {
          this.roteadorService.countQuantidadeTotalById(roteador.id).subscribe((estoque) => {
            roteador.quantidadeEstoque = estoque;
          });
        });
        this.carregarRoteadores();
      });
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }
    
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.filterValue) {
      this.applyFilter();
    } else {
      this.carregarRoteadores();
    }
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
        this.roteadorService.delete(roteador).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Roteador deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/roteadores']);
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

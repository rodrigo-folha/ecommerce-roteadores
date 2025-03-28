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
    MatInputModule,
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
    'acao'
  ];
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  showSearch = false;
  filterValue = '';
  roteadoresFiltrados: Roteador[] = [];

  constructor(private roteadorservice: RoteadorService, private router: Router) {}

  ngOnInit(): void {
    this.carregarRoteadores();
  }

  carregarRoteadores(): void {
    this.roteadorservice.findAll().subscribe((roteadores) => {
      this.roteadores = roteadores.resultado;
      this.applyCurrentFilter();
      this.totalRecords = roteadores.total;
    });
  }

  applyCurrentFilter(): void {
    const normalizedFilter = this.filterValue.trim().toLowerCase();

    const filtered = this.roteadores.filter(
      (data) => 
        data.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.descricao.toString().toLowerCase().includes(normalizedFilter) ||
        data.fornecedor.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.sistemaOperacional.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.bandaFrequencia.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.protocoloSeguranca.nome.toString().toLowerCase().includes(normalizedFilter) ||
        data.quantidadeAntena.quantidade.toString().toLowerCase().includes(normalizedFilter) ||
        data.sinalWireless.toString().toLowerCase().includes(normalizedFilter) ||
        data.preco.toString().toLowerCase().includes(normalizedFilter)
    );

    this.roteadoresFiltrados = filtered.slice(
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
        Swal.fire({
          title: "Deletado!",
          text: "Roteador deletado com sucesso!",
          icon: "success"
        });

        this.roteadorservice.delete(roteador).subscribe({
          next: () => {
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

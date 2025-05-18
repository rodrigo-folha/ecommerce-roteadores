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
import { Lote } from '../../../models/lote.model';
import { Roteador } from '../../../models/roteador.model';
import { LoteService } from '../../../services/lote.service';
import { RoteadorService } from '../../../services/roteador.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-lote-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './lote-list.component.html',
  styleUrl: './lote-list.component.css',
})
export class LoteListComponent {
  lotes: Lote[] = [];
  roteadores: Roteador[] = [];
  displayedColumns: string[] = ['id', 'codigo', 'estoque', 'data', 'roteador', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  lotesFiltrados: Lote[] = [];
  tipoFiltro: string = 'codigo';
  filtro: string = '';

  constructor(
    private loteService: LoteService, 
    private router: Router,
    private roteadorService: RoteadorService
  ) {}

  ngOnInit(): void {
    this.carregarLotes();
    this.carregarRoteadores();
  }

  carregarLotes(): void {
    this.loteService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.lotes = data.resultado;
      this.applyCurrentFilter();
      this.totalRecords = data.total;
    });
  }

  applyCurrentFilter(): void {
      const normalizedFilter = this.filterValue.trim().toLowerCase();
      
      const filtered = this.lotes.filter(
        (data) => 
          data.codigo.toString().toLowerCase().includes(normalizedFilter) ||
          data.idRoteador.toString().toLowerCase().includes(normalizedFilter) ||
          data.data.toString().toLowerCase().includes(normalizedFilter) ||
          data.estoque.toString().toLowerCase().includes(normalizedFilter)
      );
    
      this.lotesFiltrados = filtered.slice(
        this.page * this.pageSize,
        (this.page + 1) * this.pageSize
      );
    
      this.totalRecords = filtered.length;  
    }
  
    applyFilter(event?: Event): void {
      this.filterValue = this.filtro?.trim().toLowerCase() || '';
    this.page = 0;
    this.applyCurrentFilter();
    }
  
    toggleSearch():void {
      this.showSearch = !this.showSearch;
    }
  
    paginar(event: PageEvent): void {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
  
      if (this.filterValue) {
        this.applyCurrentFilter();
      } else {
        this.carregarLotes();
      }
    }

  carregarRoteadores(): void {
    this.roteadorService.findAll().subscribe((roteadores) => {
      this.roteadores = roteadores.resultado;
    });
  }

  carregarNomeRoteador(idRoteador: number): string {
    const roteador = this.roteadores.find( (nome) => nome.id === idRoteador);
    return roteador?.nome || '';
  }


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
        this.loteService.delete(lote).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Lote deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/lotes']);
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

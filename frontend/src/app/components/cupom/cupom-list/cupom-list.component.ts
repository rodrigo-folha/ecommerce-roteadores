import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Cupom } from '../../../models/cupom.model';
import { CupomService } from '../../../services/cupom.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cupom-list',
  providers: [provideNativeDateAdapter(), {
    provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
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
  templateUrl: './cupom-list.component.html',
  styleUrl: './cupom-list.component.css',
})
export class CupomListComponent {
  cupons: Cupom[] = [];
  displayedColumns: string[] = ['id', 'codigo', 'percentualDesconto', 'validade', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  cuponsFiltrados: Cupom[] = [];
  tipoFiltro: string = 'codigo';
  filtro: string = '';

  constructor(private cupomService: CupomService, private router: Router) {}

  ngOnInit(): void {
    this.carregarCupons();
  }

  carregarCupons(): void {
    this.cupomService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.cupons = data.resultado;
      this.applyCurrentFilter();
      this.totalRecords = data.total;
    });
  }

  applyCurrentFilter(): void {
    const normalizedFilter = this.filterValue.trim().toLowerCase();
    
    const filtered = this.cupons.filter(
      (data) => 
        data.codigo.toString().toLowerCase().includes(normalizedFilter) ||
        data.validade.toString().toLowerCase().includes(normalizedFilter) ||
        data.percentualDesconto.toString().toLowerCase().includes(normalizedFilter)
    );
  
    this.cuponsFiltrados = filtered.slice(
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
      this.carregarCupons();
    }
  }


  excluir(cupom: Cupom): void {
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
        this.cupomService.delete(cupom).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Cupom deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/cupons']);
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

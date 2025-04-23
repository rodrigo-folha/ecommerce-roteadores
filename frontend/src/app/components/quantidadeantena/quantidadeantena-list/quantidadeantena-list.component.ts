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
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';

@Component({
  selector: 'app-quantidadeantena-list',
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
  ],
  templateUrl: './quantidadeantena-list.component.html',
  styleUrl: './quantidadeantena-list.component.css',
})
export class QuantidadeantenaListComponent {
  quantidadeAntenas: QuantidadeAntena[] = [];
  displayedColumns: string[] = ['id', 'quantidade', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  quantidadeAntenasFiltrados: QuantidadeAntena[] = [];

  constructor(private quantidadeAntenaService: QuantidadeAntenaService, private router: Router) {}

  ngOnInit(): void {
    this.carregarQuantidadeAntenas();
  }

  carregarQuantidadeAntenas(): void {
    this.quantidadeAntenaService.findAll().subscribe((data) => {
      this.quantidadeAntenas = data.resultado;
      this.applyCurrentFilter();
      this.totalRecords = data.total
    });
  }

  applyCurrentFilter(): void {
      const normalizedFilter = this.filterValue.trim().toLowerCase();
  
      const filtered = this.quantidadeAntenas.filter((data) =>
        data.quantidade.toString().toLowerCase().includes(normalizedFilter)
      );
  
      this.quantidadeAntenasFiltrados = filtered.slice(
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
        this.carregarQuantidadeAntenas();
      }
    }


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
        this.quantidadeAntenaService.delete(quantidadeAntena).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Quantidade de Antena deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/quantidadeantenas']);
            });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
            Swal.fire({
              title: "Erro!",
              text: "Não foi possível deletar, pois a propriedade está sendo utilizada por um roteador!",
              icon: "error"
            });
          }
        });
      }
    });


  }
}

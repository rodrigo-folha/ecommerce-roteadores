import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cidade-list',
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
  templateUrl: './cidade-list.component.html',
  styleUrl: './cidade-list.component.css',
})
export class CidadeListComponent {
  cidades: Cidade[] = [];
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  cidadesFiltradas: Cidade[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  constructor(private cidadeService: CidadeService, private router: Router) {}


  ngOnInit(): void {
    this.carregarcidades();
  }

  carregarcidades(): void {
    this.cidadeService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.cidadesFiltradas = data.resultado;
      this.totalRecords = data.total;
    });
  }

  applyFilter(event?: Event): void {
    this.filterValue = this.filtro?.trim().toLowerCase() || '';
    this.page = 0;

    if (this.filterValue !== '' && this.tipoFiltro === 'nome') {
      this.cidadeService.findByNome(this.filterValue, this.page, this.pageSize).subscribe({
        next: (item) => {
          this.cidadesFiltradas = item.resultado;
          this.totalRecords = item.total;
        },
        error: (error) => {
          console.error('Erro ao buscar por nome' + JSON.stringify(error));
        }
      })
    } else {
      this.cidadeService.findAll(this.page, this.pageSize).subscribe((item) => {
        this.cidades = item.resultado;
        this.totalRecords = item.total;
        this.carregarcidades();
      })
    }
  }

  toggleSearch():void {
    this.showSearch = !this.showSearch;
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.filterValue) {
      this.applyFilter();
    } else {
      this.carregarcidades();
    }
  }

  excluir(cidade: Cidade): void {
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
        this.cidadeService.delete(cidade).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Cidade deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/cidades']);
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

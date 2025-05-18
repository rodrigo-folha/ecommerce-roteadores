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
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-estado-list',
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
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css',
})
export class EstadoListComponent {
  estados: Estado[] = [];
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  showSearch = false;
  filterValue = '';
  estadosFiltrados: Estado[] = [];
  tipoFiltro: string = 'nome';
  filtro: string = '';

  constructor(private estadoService: EstadoService, private router: Router) {}

  ngOnInit(): void {
    this.carregarEstados();
  }

  carregarEstados(): void {
    this.estadoService.findAll(this.page, this.pageSize).subscribe(data => {
      this.estadosFiltrados = data.resultado;
      this.totalRecords = data.total;
    });
    
  }

  applyFilter(event?: Event): void {
    this.filterValue = this.filtro?.trim().toLowerCase() || '';
    this.page = 0;
    if (this.filterValue !== '' && this.tipoFiltro === 'nome') {
      this.estadoService.findByNome(this.filterValue, this.page, this.pageSize).subscribe({
        next: (item) => {
          this.estadosFiltrados = item.resultado;
          this.totalRecords = item.total;
        },
        error: (error) => {
          console.error('Erro ao buscar por nome' + JSON.stringify(error));
        }
      })
    } else {
      this.estadoService.findAll(this.page, this.pageSize).subscribe((item) => {
        this.estados = item.resultado;
        this.totalRecords = item.total;
        this.carregarEstados();
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
      this.carregarEstados();
    }
  }

  excluir(estado: Estado): void {
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
        this.estadoService.delete(estado).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Estado deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/estados']);
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

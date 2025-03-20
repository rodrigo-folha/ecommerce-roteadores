import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Cupom } from '../../../models/cupom.model';
import { CupomService } from '../../../services/cupom.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-cupom-list',
  providers: [provideNativeDateAdapter(), {
    provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './cupom-list.component.html',
  styleUrl: './cupom-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CupomListComponent {
  cupons: Cupom[] = [];

  constructor(private cupomService: CupomService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarCupons();
  }

  carregarCupons(): void {
    this.cupomService.findAll().subscribe((cupons) => {
      this.cupons = cupons;
      this.dataSource.data = this.cupons;
    });
  }

  displayedColumns: string[] = ['id', 'codigo', 'percentualDesconto', 'validade', 'acao'];
  dataSource = new MatTableDataSource<any>();

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
        Swal.fire({
          title: "Deletado!",
          text: "Cupom deletado com sucesso!",
          icon: "success"
        });

        this.cupomService.delete(cupom).subscribe({
          next: () => {
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

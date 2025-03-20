import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SinalWireless } from '../../../models/sinal-wireless.model';
import { SinalWirelessService } from '../../../services/sinal-wireless.service';

@Component({
  selector: 'app-sinalwireless-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './sinalwireless-list.component.html',
  styleUrl: './sinalwireless-list.component.css',
})
export class SinalwirelessListComponent {
  sinalWireless: SinalWireless[] = [];

  constructor(private sinalWirelessService: SinalWirelessService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarSinalwireless();
  }

  carregarSinalwireless(): void {
    this.sinalWirelessService.findAll().subscribe((sinalWireless) => {
      this.sinalWireless = sinalWireless;
      this.dataSource.data = this.sinalWireless;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(sinalWireless: SinalWireless): void {
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
          text: "Sinal Wireless deletado com sucesso!",
          icon: "success"
        });

        this.sinalWirelessService.delete(sinalWireless).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/sinalwireless']);
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

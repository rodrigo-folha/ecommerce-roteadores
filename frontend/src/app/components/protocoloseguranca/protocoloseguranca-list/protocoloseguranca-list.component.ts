import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ProtocoloSegurancaService } from '../../../services/protocolo-seguranca.service';
import { ProtocoloSeguranca } from '../../../models/protocolo-seguranca.model';

@Component({
  selector: 'app-protocoloseguranca-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './protocoloseguranca-list.component.html',
  styleUrl: './protocoloseguranca-list.component.css',
})
export class ProtocolosegurancaListComponent {
  protocolosSeguranca: ProtocoloSeguranca[] = [];

  constructor(private protocoloSegurancaService: ProtocoloSegurancaService, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarProtocolosSeguranca();
  }

  carregarProtocolosSeguranca(): void {
    this.protocoloSegurancaService.findAll().subscribe((protocolosSeguranca) => {
      this.protocolosSeguranca = protocolosSeguranca;
      this.dataSource.data = this.protocolosSeguranca;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource = new MatTableDataSource<any>();

  excluir(protocolosSeguranca: ProtocoloSeguranca): void {
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
          text: "Protocolo de Segurança deletado com sucesso!",
          icon: "success"
        });

        this.protocoloSegurancaService.delete(protocolosSeguranca).subscribe({
          next: () => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/protocolosseguranca']);
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

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Roteador } from '../../../models/roteador.model';
import { RoteadorService } from '../../../services/roteador.service';

@Component({
  selector: 'app-roteador-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './roteador-list.component.html',
  styleUrl: './roteador-list.component.css'
})
export class RoteadorListComponent {
  // controle de paginacao
  totalRegistros = 0;
  pageSize = 5;
  page = 0;
  roteadores: Roteador[] = [];

  constructor(private roteadorService: RoteadorService) {}

  displayedColumns: string[] = [
    'id',
    'nome',
    'preco',
    'sistemaOperacional',
    'bandaFrequencia',
    'protocoloSeguranca',
    'quantidadeAntenas',
    'sinalWireless',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarRoteadores();
  }

  carregarRoteadores(): void {
    this.roteadorService.findAll().subscribe((roteadores) => {
      this.roteadores = roteadores;
      this.dataSource.data = this.roteadores;
    });
  }
}

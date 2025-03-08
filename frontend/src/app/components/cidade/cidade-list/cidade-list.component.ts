import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';

@Component({
  selector: 'app-cidade-list',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './cidade-list.component.html',
  styleUrl: './cidade-list.component.css',
})
export class CidadeListComponent {
  cidades: Cidade[] = [];

  constructor(private cidadeService: CidadeService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarCidades();
  }

  carregarCidades(): void {
    this.cidadeService.getCidades().subscribe((cidades) => {
      this.cidades = cidades;
      this.dataSource.data = this.cidades;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'estado'];
  dataSource = new MatTableDataSource<any>();
}

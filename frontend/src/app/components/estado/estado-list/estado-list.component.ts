import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-estado-list',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTableModule, CommonModule],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css'
})
export class EstadoListComponent {
  estados: Estado[] = [];

  constructor(private estadoService: EstadoService) {}

  ngOnInit(): void {
    this.estadoService.getEstados().subscribe((estados) => {    
      this.estados = estados;
    });
  }

  displayedColumns: string[] = ['id', 'nome', 'sigla'];
  dataSource = this.estados;
}

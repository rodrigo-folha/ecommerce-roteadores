import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Lote } from '../../../models/lote.model';
import { Roteador } from '../../../models/roteador.model';
import { LoteService } from '../../../services/lote.service';
import { RoteadorService } from '../../../services/roteador.service';

@Component({
  selector: 'app-lote-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './lote-form.component.html',
  styleUrl: './lote-form.component.css',
})
export class LoteFormComponent {
  formGroup: FormGroup;

  lotes: Lote[] = [];
  roteadores: Roteador[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loteService: LoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roteadorService: RoteadorService,
  ) {
    this.formGroup = this.formBuilder.group({
      codigo: ['', Validators.required],
      estoque: ['', Validators.required],
      data: ['', Validators.required],
      roteador: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    forkJoin({
      roteadores: this.roteadorService.findAll(),
    }).subscribe((response) => {
      this.roteadores = response.roteadores;
      this.initializeForm();
    });

  }
  
  initializeForm(): void {
    const lote: Lote = this.activatedRoute.snapshot.data['lote'];
    
    const roteador = this.roteadores.find(
      (item) => item.id === (lote?.roteador?.id || null)
    );
    console.log('lista de roteadores:', this.roteadores);

    this.formGroup = this.formBuilder.group({
      id: [lote && lote.id ? lote.id : null],
      codigo: [lote && lote.codigo ? lote.codigo : null, Validators.required],
      estoque: [lote && lote.estoque ? lote.estoque : null, Validators.required],
      data: [lote && lote.data ? lote.data : null, Validators.required],
      roteador: [roteador, Validators.required],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const lote = this.formGroup.value;
      if (lote.id == null) {
        this.cadastrar(lote);
      } else {
        this.atualizar(lote);
      }
    }
  }

  cadastrar(lote: any) {
    this.loteService.insert(lote).subscribe({
      next: (loteCadastrado) => {
        console.log(
          'Lote cadastrado com sucesso',
          JSON.stringify(loteCadastrado)
        );
        this.router.navigateByUrl('/lotes');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(lote: any) {
    this.loteService.update(lote).subscribe({
      next: (loteAtualizado) => {
        console.log(
          'Lote atualizado com sucesso',
          JSON.stringify(loteAtualizado)
        );
        this.router.navigateByUrl('/lotes');
      },
    });
  }

  excluir() {
    const lote = this.formGroup.value;
    this.loteService.delete(lote).subscribe({
      next: (loteExcluido) => {
        console.log(
          'Lote excluído com sucesso',
          JSON.stringify(loteExcluido)
        );
        this.router.navigateByUrl('/lotes');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }
}

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
import { Cidade } from '../../../models/cidade.model';
import { Estado } from '../../../models/estado.model';
import { CidadeService } from '../../../services/cidade.service';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-cidade-form',
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
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css',
})
export class CidadeFormComponent {
  formGroup: FormGroup;

  cidades: Cidade[] = [];
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private estadoService: EstadoService
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      estado: [''],
    });
  }

  ngOnInit(): void {
    this.estadoService.findAll().subscribe((data) => {
      this.estados = data.resultado;
      this.initializeForm();
    });
  }
  
  initializeForm(): void {
    const cidade: Cidade = this.activatedRoute.snapshot.data['cidade'];
    
    const estado = this.estados.find(
      (estado) => estado.id === (cidade?.estado?.id || null)
    );

    this.formGroup = this.formBuilder.group({
      id: [cidade && cidade.id ? cidade.id : null],
      nome: [cidade && cidade.nome ? cidade.nome : '', Validators.required],
      estado: [estado],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const cidade = this.formGroup.value;
      if (cidade.id == null) {
        this.cadastrar(cidade);
      } else {
        this.atualizar(cidade);
      }
    }
  }

  cadastrar(cidade: any) {
    this.cidadeService.insert(cidade).subscribe({
      next: (cidadeCadastrado) => {
        this.router.navigateByUrl('/admin/cidades');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(cidade: any) {
    this.cidadeService.update(cidade).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/cidades');
      },
    });
  }

  excluir() {
    const cidade = this.formGroup.value;
    this.cidadeService.delete(cidade).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/cidades');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }
}

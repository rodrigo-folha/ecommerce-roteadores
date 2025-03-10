import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EstadoService } from '../../../services/estado.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Estado } from '../../../models/estado.model';

@Component({
  selector: 'app-estado-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent {
  formGroup: FormGroup;

  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      sigla: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const estado: Estado = this.activatedRoute.snapshot.data['estado'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (estado && estado.id) ? estado.id : null],
      nome: [
        (estado && estado.nome) ? estado.nome : null, 
        Validators.required],
      sigla: [
        (estado && estado.sigla) ? estado.sigla : null,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      if(estado.id == null) {
        this.cadastrar(estado);
      } else {
        this.atualizar(estado);
      }
    }
  }

  cadastrar(estado: any) {
    this.estadoService.insert(estado).subscribe({
      next: (estadoCadastrado) => {
        console.log(
          'Estado cadastrado com sucesso',
          JSON.stringify(estadoCadastrado)
        );
        this.router.navigateByUrl('/estados');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(estado: any) {
    this.estadoService.update(estado).subscribe({
      next: (estadoAtualizado) => {
        console.log(
          'Estado atualizado com sucesso',
          JSON.stringify(estadoAtualizado)
        );
        this.router.navigateByUrl('/estados');
      }
    });
  }

  excluir() {
    const estado = this.formGroup.value;
    this.estadoService.delete(estado).subscribe({
      next: (estadoExcluido) => {
        console.log(
          'Estado excluído com sucesso',
          JSON.stringify(estadoExcluido)
        );
        this.router.navigateByUrl('/estados');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }
}

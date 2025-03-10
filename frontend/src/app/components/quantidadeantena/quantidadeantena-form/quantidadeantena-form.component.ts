import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';

@Component({
  selector: 'app-quantidadeantena-form',
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
  templateUrl: './quantidadeantena-form.component.html',
  styleUrl: './quantidadeantena-form.component.css'
})
export class QuantidadeantenaFormComponent {
  formGroup: FormGroup;

  quantidadeAntenas: QuantidadeAntena[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private quantidadeAntenasService: QuantidadeAntenaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      quantidade: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const quantidadeAntena: QuantidadeAntena = this.activatedRoute.snapshot.data['quantidadeantena'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (quantidadeAntena && quantidadeAntena.id) ? quantidadeAntena.id : null],
      quantidade: [
        (quantidadeAntena && quantidadeAntena.quantidade) ? quantidadeAntena.quantidade : null, 
        Validators.required],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const quantidadeAntena = this.formGroup.value;
      if(quantidadeAntena.id == null) {
        this.cadastrar(quantidadeAntena);
      } else {
        this.atualizar(quantidadeAntena);
      }
    }
  }

  cadastrar(quantidadeAntena: any) {
    this.quantidadeAntenasService.insert(quantidadeAntena).subscribe({
      next: (quantidadeAntenaCadastrado) => {
        console.log(
          'QuantidadeAntena cadastrado com sucesso',
          JSON.stringify(quantidadeAntenaCadastrado)
        );
        this.router.navigateByUrl('/quantidadeantenas');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(quantidadeAntena: any) {
    this.quantidadeAntenasService.update(quantidadeAntena).subscribe({
      next: (quantidadeAntenaAtualizado) => {
        console.log(
          'QuantidadeAntena atualizado com sucesso',
          JSON.stringify(quantidadeAntenaAtualizado)
        );
        this.router.navigateByUrl('/quantidadeantenas');
      }
    });
  }

  excluir() {
    const quantidadeAntena = this.formGroup.value;
    this.quantidadeAntenasService.delete(quantidadeAntena).subscribe({
      next: (quantidadeAntenaExcluido) => {
        console.log(
          'QuantidadeAntena excluído com sucesso',
          JSON.stringify(quantidadeAntenaExcluido)
        );
        this.router.navigateByUrl('/quantidadeantenas');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }

}

import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BandaFrequencia } from '../../../models/banda-frequencia.model';
import { BandaFrequenciaService } from '../../../services/banda-frequencia.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bandafrequencia-form',
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
  templateUrl: './bandafrequencia-form.component.html',
  styleUrl: './bandafrequencia-form.component.css'
})
export class BandafrequenciaFormComponent {
  formGroup: FormGroup;

  bandaFrequencias: BandaFrequencia[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bandaFrequenciaService: BandaFrequenciaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const bandaFrequencia: BandaFrequencia = this.activatedRoute.snapshot.data['bandafrequencia'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (bandaFrequencia && bandaFrequencia.id) ? bandaFrequencia.id : null],
      nome: [
        (bandaFrequencia && bandaFrequencia.nome) ? bandaFrequencia.nome : null, 
        Validators.required],
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const bandaFrequencia = this.formGroup.value;

      const operacao = bandaFrequencia.id == null
      ? this.bandaFrequenciaService.insert(bandaFrequencia)
      : this.bandaFrequenciaService.update(bandaFrequencia)

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('admin/bandafrequencias');
          this.showNotification('Banda de Frequência salva com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  excluir() {
    const bandaFrequencia = this.formGroup.value;
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Vou não vai poder reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandaFrequenciaService.delete(bandaFrequencia).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deletado!',
              text: 'Banda de Frequência deletada com sucesso!',
              icon: 'success',
            });
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/admin/bandafrequencias']);
              });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
          },
        });
      }
    });
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if(httpError.error?.errors){
        httpError.error.errors.forEach((validationError: any)  => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({apiError: validationError.message})
          }
        });
      }
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }

  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined) : string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for(const errorName in errors) {
      // console.log(errorName);
      if (this.errorMessages[controlName][errorName]){
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  // é proximno ao Map do java
  errorMessages: {[controlName: string] : {[errorName: string] : string}} = {
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' '
    },

    sigla: {
      required: 'A sigla deve ser informada.',
      apiError: ' '
    },
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

}

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
import { SistemaOperacionalService } from '../../../services/sistema-operacional.service';
import { SistemaOperacional } from '../../../models/sistema-operacional.model';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sistemaoperacional-form',
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
  templateUrl: './sistemaoperacional-form.component.html',
  styleUrl: './sistemaoperacional-form.component.css'
})
export class SistemaoperacionalFormComponent {
  formGroup: FormGroup;

  sistemasOperacionais: SistemaOperacional[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sistemaOperacionalService: SistemaOperacionalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const sistemaoperacional: SistemaOperacional = this.activatedRoute.snapshot.data['sistemaoperacional'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (sistemaoperacional && sistemaoperacional.id) ? sistemaoperacional.id : null],
      nome: [
        (sistemaoperacional && sistemaoperacional.nome) ? sistemaoperacional.nome : null, 
        Validators.required],
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const sistemaOperacional = this.formGroup.value;

      const operacao = sistemaOperacional.id == null
      ? this.sistemaOperacionalService.insert(sistemaOperacional)
      : this.sistemaOperacionalService.update(sistemaOperacional)

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('admin/sistemasoperacionais');
          this.showNotification('Sistema Operacional salvo com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  excluir() {
    const sistemaOperacional = this.formGroup.value;
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
        this.sistemaOperacionalService.delete(sistemaOperacional).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deletado!',
              text: 'Sistema Operacional deletado com sucesso!',
              icon: 'success',
            });
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/admin/sistemasoperacionais']);
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

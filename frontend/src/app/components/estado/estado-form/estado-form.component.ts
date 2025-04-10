import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
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
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const estado = this.formGroup.value;

      const operacao = estado.id == null
      ? this.estadoService.insert(estado)
      : this.estadoService.update(estado)

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('admin/estados');
          this.showNotification('Estado salvo com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  excluir() {
    const estado = this.formGroup.value;
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
        this.estadoService.delete(estado).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Estado deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/estados']);
            });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
          }
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
      minlength: 'O nome deve ter no mínimo 2 caracteres. ',
      maxlength: 'O nome deve ter no máximo 60 caracteres. ',
      apiError: ' '
    },

    sigla: {
      required: 'A sigla deve ser informada.',
      minlength: 'A sigla deve ter no mínimo 2 caracteres. ',
      maxlength: 'A sigla deve ter no máximo 2 caracteres. ',
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

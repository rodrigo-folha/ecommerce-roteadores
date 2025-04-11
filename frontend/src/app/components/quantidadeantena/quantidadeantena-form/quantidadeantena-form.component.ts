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
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

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
    private quantidadeAntenaService: QuantidadeAntenaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
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
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const quantidadeAntena = this.formGroup.value;

      const operacao = quantidadeAntena.id == null
      ? this.quantidadeAntenaService.insert(quantidadeAntena)
      : this.quantidadeAntenaService.update(quantidadeAntena)

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('admin/quantidadeantenas');
          this.showNotification('Quantidade de Antena salvo com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  excluir() {
    const quantidadeAntena = this.formGroup.value;
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
        this.quantidadeAntenaService.delete(quantidadeAntena).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Quantidade de Antena deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/quantidadeantenas']);
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
    quantidade: {
      required: 'A quantidade deve ser informada.',
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

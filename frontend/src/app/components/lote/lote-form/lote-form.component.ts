import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Lote } from '../../../models/lote.model';
import { Roteador } from '../../../models/roteador.model';
import { LoteService } from '../../../services/lote.service';
import { RoteadorService } from '../../../services/roteador.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lote-form',
  providers: [provideNativeDateAdapter(), {
    provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
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
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group({
      codigo: ['', Validators.required],
      estoque: ['', Validators.required],
      data: ['', Validators.required],
      idRoteador: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    forkJoin({
      roteadores: this.roteadorService.findAll(),
    }).subscribe((response) => {
      this.roteadores = response.roteadores.resultado;
      this.initializeForm();
    });
  }

  initializeForm(): void {
    const lote: Lote = this.activatedRoute.snapshot.data['lote'];

    const idRoteador = lote?.idRoteador
    const roteador = this.roteadores.find((r) => r.id === idRoteador);

    this.formGroup = this.formBuilder.group({
      id: [lote && lote.id ? lote.id : null],
      codigo: [lote && lote.codigo ? lote.codigo : null, Validators.required],
      estoque: [
        lote && lote.estoque ? lote.estoque : null,
        Validators.required,
      ],
      data: [lote && lote.data ? lote.data : null, Validators.required],
      idRoteador: [roteador?.id || null, Validators.required],
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const lote = this.formGroup.value;

      const operacao = lote.id == null
      ? this.loteService.insert(lote)
      : this.loteService.update(lote)

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('admin/lotes');
          this.showNotification('Lote salvo com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  excluir() {
    const lote = this.formGroup.value;
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
        this.loteService.delete(lote).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Lote deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/lotes']);
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
    codigo: {
      required: 'O codigo deve ser informado.',
      apiError: ' '
    },

    estoque: {
      required: 'A quantidade do estoque deve ser informada.',
      apiError: ' '
    },

    data: {
      required: 'A data deve ser informada.',
      apiError: ' '
    },

    idRoteador: {
      required: 'O roteador deve ser informado.',
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

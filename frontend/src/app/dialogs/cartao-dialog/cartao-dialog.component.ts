import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cartao-dialog',
  providers: [provideNativeDateAdapter(), {
        provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
      ],
  imports: [CommonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule,
      MatToolbarModule,
      MatDatepickerModule
    ],
  templateUrl: './cartao-dialog.component.html',
  styleUrl: './cartao-dialog.component.css'
})
export class CartaoDialogComponent {
  cartaoForm: FormGroup;
  minDate: Date;

  ngOnInit(): void {
    this.initializeForm();
  }

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CartaoDialogComponent>,
      private activatedRoute: ActivatedRoute,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.cartaoForm = this.fb.group({
        id: [data?.id || '', Validators.required],
        titular: [data?.titular || '', Validators.required],
        cpfCartao: [data?.cpfCartao || '', Validators.required],
        numero: [data?.numero || '', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
        dataValidade: [data?.dataValidade || '', [Validators.required]],
        cvc: [data?.cvc || '', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        modalidade: [data?.modalidade || '', Validators.required]
      });
      this.minDate = new Date();
    }

  initializeForm(): void {
    this.cartaoForm = this.fb.group({
      id: [(this.data && this.data.id) ? this.data.id : null],
      titular: [(this.data && this.data.titular) ? this.data.titular : null, [Validators.required]],
      cpfCartao: [(this.data && this.data.cpfCartao) ? this.data.cpfCartao : null, [Validators.required]],
      numero: [(this.data && this.data.numero) ? this.data.numero : null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      dataValidade: [(this.data && this.data.dataValidade) ? this.data.dataValidade : null],
      cvc: [(this.data && this.data.cvc) ? this.data.cvc : null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      modalidade: [(this.data && this.data.modalidade) ? this.data.modalidade : null, [Validators.required]],
    });
  }

  salvar() {
    this.cartaoForm.markAllAsTouched();

    if (this.cartaoForm.valid) {
      this.dialogRef.close(this.cartaoForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
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

  // TODO: Falta colocar as validações daqui pra baixo...
  errorMessages: {[controlName: string] : {[errorName: string] : string}} = {
    titular: {
      required: 'O titular deve ser informado.',
      apiError: ' '
    },

    numero: {
      required: 'O número deve ser informado.',
      minlength: 'O número deve ter 16 digitos',
      maxlength: "O número deve ter 16 dígitos",
      apiError: ' '
    },

    cpfCartao: {
      required: 'O cpf deve ser informado.',
      apiError: ' '
    },

    dataValidade: {
      required: 'A data de validade deve ser informada.',
      apiError: ' '
    },

    cvc: {
      required: 'O cvc deve ser informado.',
      minlength: 'O cvc deve possuir 3 dígitos',
      maxlength: 'O cvc deve possuir 3 dígitos',
      apiError: ' '
    },
  }


}

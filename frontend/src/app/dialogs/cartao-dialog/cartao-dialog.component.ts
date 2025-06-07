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
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cartao-dialog',
  providers: [provideNativeDateAdapter(), {
        provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
        provideNgxMask(),
      ],
  imports: [CommonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule,
      MatToolbarModule,
      MatDatepickerModule,
      NgxMaskDirective,
    ],
  templateUrl: './cartao-dialog.component.html',
  styleUrl: './cartao-dialog.component.css'
})
export class CartaoDialogComponent {
  cartaoForm: FormGroup;
  minDate: Date;

  meses = [
    { nome: 'Janeiro', valor: 1 },
    { nome: 'Fevereiro', valor: 2 },
    { nome: 'Março', valor: 3 },
    { nome: 'Abril', valor: 4 },
    { nome: 'Maio', valor: 5 },
    { nome: 'Junho', valor: 6 },
    { nome: 'Julho', valor: 7 },
    { nome: 'Agosto', valor: 8 },
    { nome: 'Setembro', valor: 9 },
    { nome: 'Outubro', valor: 10 },
    { nome: 'Novembro', valor: 11 },
    { nome: 'Dezembro', valor: 12 },
  ];

  anos: number[] = [];

  ngOnInit(): void {
    const anoAtual = new Date().getFullYear();
    const primeiroAnoValido = anoAtual + 1;

    for (let i = 0; i <= 15; i++) {
      this.anos.push(primeiroAnoValido + i);
    }
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
        cvc: [data?.cvc || '', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        mesValidade: [null, Validators.required],
        anoValidade: [null, Validators.required],
        modalidade: [data?.modalidade || '', Validators.required]
      });
      this.minDate = new Date();
    }

  initializeForm(): void {
    const data = this.data?.dataValidade ? new Date(this.data.dataValidade) : null;

    this.cartaoForm = this.fb.group({
      id: [this.data?.id ?? null],
      titular: [this.data?.titular ?? null, [Validators.required]],
      cpfCartao: [this.data?.cpfCartao ?? null, [Validators.required]],
      numero: [this.data?.numero ?? null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cvc: [this.data?.cvc ?? null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      modalidade: [this.data?.modalidade ?? null, [Validators.required]],
      
      mesValidade: [data ? data.getMonth() +2 : null, [Validators.required]],
      anoValidade: [data ? data.getFullYear() : null, [Validators.required]],
    });
  }

  salvar() {
    this.cartaoForm.markAllAsTouched();

    if (this.cartaoForm.valid) {
      const formValue = this.cartaoForm.value;

      const mes = formValue.mesValidade;
      const ano = formValue.anoValidade;

      // Gera a data com dia fixo 1
      const dataValidade = new Date(ano, mes - 1, 1);

      const payload = {
        ...formValue,
        dataValidade
      };

      // Remove os campos temporários do payload
      delete payload.mesValidade;
      delete payload.anoValidade;

      this.dialogRef.close(payload);
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

    cvc: {
      required: 'O cvc deve ser informado.',
      minlength: 'O cvc deve possuir 3 dígitos',
      maxlength: 'O cvc deve possuir 3 dígitos',
      apiError: ' '
    },

    mesValidade: {
      required: 'O mês deve ser informado.'
    },
    anoValidade: {
      required: 'O ano deve ser informado.'
    },
  }

  selecionarMesAno(data: Date, datepicker: any) {
    const controle = this.cartaoForm.get('dataValidade');
    if (controle) {
      controle.setValue(new Date(data.getFullYear(), data.getMonth(), 1)); // seta dia 1 como fixo
      datepicker.close();
    }
  }

  formatarDataValidade(event: any) {
    // Isso impede que o usuário digite algo no campo manualmente (se for necessário)
    event.preventDefault();
  }


}

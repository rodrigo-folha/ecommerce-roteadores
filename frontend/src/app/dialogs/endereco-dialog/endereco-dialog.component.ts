import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Cidade } from '../../models/cidade.model';
import { CidadeService } from '../../services/cidade.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Endereco } from '../../models/endereco.model';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-endereco-dialog',
  providers: [provideNativeDateAdapter(), {
          provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
          provideNgxMask(),
        ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    NgxMaskDirective,
  ],
  templateUrl: './endereco-dialog.component.html',
  styleUrl: './endereco-dialog.component.css'
})
export class EnderecoDialogComponent {
  enderecoForm: FormGroup;
  cidades: Cidade[] = [];

  ngOnInit(): void {
    this.cidadeService.findAll().subscribe((data) => {
      this.cidades = data.resultado;
    });
    this.initializeForm();
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnderecoDialogComponent>,
    private activatedRoute: ActivatedRoute,
    private cidadeService: CidadeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.enderecoForm = this.fb.group({
      id: [data?.id || '', Validators.required],
      logradouro: [data?.logradouro || '', Validators.required],
      bairro: [data?.bairro || '', Validators.required],
      numero: [data?.numero || '', Validators.required],
      complemento: [data?.complemento || ''],
      cep: [data?.cep || '', Validators.required],
      cidade: [data?.cidade || '', Validators.required]
    });
  }

  initializeForm(): void {
    
      this.enderecoForm = this.fb.group({
        id: [(this.data && this.data.id) ? this.data.id : null],
        logradouro: [(this.data && this.data.logradouro) ? this.data.logradouro : null, [Validators.required]],
        bairro: [(this.data && this.data.bairro) ? this.data.bairro : null, [Validators.required]],
        numero: [(this.data && this.data.numero) ? this.data.numero : null, [Validators.required]],
        complemento: [(this.data && this.data.complemento) ? this.data.complemento : null],
        cep: [(this.data && this.data.cep) ? this.data.cep : null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        cidade: [(this.data && this.data.cidade) ? this.data.cidade : null, [Validators.required]],
      });
    }

  compareCidades(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  salvar() {
    this.enderecoForm.markAllAsTouched();

    if (this.enderecoForm.valid) {
      this.dialogRef.close(this.enderecoForm.value);
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
    logradouro: {
      required: 'O logradouro deve ser informado.',
      apiError: ' '
    },

    numero: {
      required: 'O número deve ser informado.',
      apiError: ' '
    },

    bairro: {
      required: 'O bairro deve ser informado.',
      apiError: ' '
    },

    cep: {
      required: 'O cep deve ser informado.',
      minlength: 'O Cep deve possuir 8 dígitos',
      maxlength: 'O Cep deve possuir 8 dígitos',
      apiError: ' '
    },

    cidade: {
      required: 'A cidade deve ser informada.',
      apiError: ' '
    }
  }
}
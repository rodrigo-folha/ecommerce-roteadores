import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-telefone-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './telefone-dialog.component.html',
  styleUrl: './telefone-dialog.component.css'
})
export class TelefoneDialogComponent {

  telefoneForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TelefoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.telefoneForm = this.fb.group({
      codigoArea: [data?.codigoArea || '', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      numero: [data?.numero || '', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]]
    });
  }

  salvar() {
    this.telefoneForm.markAllAsTouched();

    if (this.telefoneForm.valid) {
      this.dialogRef.close(this.telefoneForm.value);
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
      codigoArea: {
        required: 'O código de área deve ser informado.',
        minlength: 'O código deve ter no mínimo 2 números',
        maxlength: 'O código deve ter no máximo 2 números',
        apiError: ' '
      },
  
      numero: {
        required: 'O número deve ser informado.',
        minlength: 'O número deve ter no mínimo 8 números',
        maxlength: 'O número deve ter no máximo 9 números',
        apiError: ' '
      },
    }
}
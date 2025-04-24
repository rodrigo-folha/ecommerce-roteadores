import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      codigoArea: [data?.codigoArea || '', Validators.required],
      numero: [data?.numero || '', Validators.required]
    });
  }

  salvar() {
    if (this.telefoneForm.valid) {
      this.dialogRef.close(this.telefoneForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }

  // TODO: Falta colocar as validações daqui pra baixo...
}
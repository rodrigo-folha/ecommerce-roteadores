import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Cidade } from '../../models/cidade.model';
import { CidadeService } from '../../services/cidade.service';

@Component({
  selector: 'app-endereco-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
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
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnderecoDialogComponent>,
    private cidadeService: CidadeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.enderecoForm = this.fb.group({
      logradouro: [data?.logradouro || '', Validators.required],
      bairro: [data?.bairro || '', Validators.required],
      numero: [data?.numero || '', Validators.required],
      complemento: [data?.complemento || ''],
      cep: [data?.cep || '', Validators.required],
      cidade: [data?.cidades || '', Validators.required]
    });
  }

  compareCidades(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  salvar() {
    if (this.enderecoForm.valid) {
      this.dialogRef.close(this.enderecoForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }

  // TODO: Falta colocar as validações daqui pra baixo...
}
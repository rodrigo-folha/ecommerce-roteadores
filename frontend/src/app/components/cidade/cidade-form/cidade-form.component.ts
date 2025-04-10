import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cidade } from '../../../models/cidade.model';
import { Estado } from '../../../models/estado.model';
import { CidadeService } from '../../../services/cidade.service';
import { EstadoService } from '../../../services/estado.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cidade-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css',
})
export class CidadeFormComponent {
  formGroup: FormGroup;

  cidades: Cidade[] = [];
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private estadoService: EstadoService
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.estadoService.findAll().subscribe((data) => {
      this.estados = data.resultado;
      this.initializeForm();
    });
  }
  
  initializeForm(): void {
    const cidade: Cidade = this.activatedRoute.snapshot.data['cidade'];
    
    const estado = this.estados.find(
      (estado) => estado.id === (cidade?.estado?.id || null)
    );

    this.formGroup = this.formBuilder.group({
      id: [cidade && cidade.id ? cidade.id : null],
      nome: [cidade && cidade.nome ? cidade.nome : '', Validators.required],
      estado: [estado, Validators.required],
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const cidade = this.formGroup.value;

      const operacao = cidade.id == null
        ? this.cidadeService.insert(cidade)
        : this.cidadeService.update(cidade);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/cidades');
        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      });
    }
  }

  excluir() {
    const cidade = this.formGroup.value;
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
        this.cidadeService.delete(cidade).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Cidade deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/cidades']);
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
        apiError: ' '
      },
  
      estado: {
        required: 'O estado deve ser informado.',
        apiError: ' '
      },
    }
}

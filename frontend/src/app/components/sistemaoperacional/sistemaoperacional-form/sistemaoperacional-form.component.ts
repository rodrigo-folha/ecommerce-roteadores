import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SistemaOperacionalService } from '../../../services/sistema-operacional.service';
import { SistemaOperacional } from '../../../models/sistema-operacional.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sistemaoperacional-form',
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
  templateUrl: './sistemaoperacional-form.component.html',
  styleUrl: './sistemaoperacional-form.component.css'
})
export class SistemaoperacionalFormComponent {
  formGroup: FormGroup;

  sistemasOperacionais: SistemaOperacional[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sistemaOperacionalService: SistemaOperacionalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const sistemaoperacional: SistemaOperacional = this.activatedRoute.snapshot.data['sistemaoperacional'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (sistemaoperacional && sistemaoperacional.id) ? sistemaoperacional.id : null],
      nome: [
        (sistemaoperacional && sistemaoperacional.nome) ? sistemaoperacional.nome : null, 
        Validators.required],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const sistemaoperacional = this.formGroup.value;
      if(sistemaoperacional.id == null) {
        this.cadastrar(sistemaoperacional);
      } else {
        this.atualizar(sistemaoperacional);
      }
    }
  }

  cadastrar(sistemaoperacional: any) {
    this.sistemaOperacionalService.insert(sistemaoperacional).subscribe({
      next: (sistemaoperacionalCadastrado) => {
        this.router.navigateByUrl('/admin/sistemasoperacionais');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(sistemaoperacional: any) {
    this.sistemaOperacionalService.update(sistemaoperacional).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/sistemasoperacionais');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const sistemaOperacional = this.formGroup.value;
    Swal.fire({
          title: 'Você tem certeza?',
          text: 'Vou não vai poder reverter isso!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, deletar!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.sistemaOperacionalService.delete(sistemaOperacional).subscribe({
              next: () => {
                Swal.fire({
                  title: 'Deletado!',
                  text: 'Sistema Operacional deletado com sucesso!',
                  icon: 'success',
                });
                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => {
                    this.router.navigate(['/admin/sistemasoperacionais']);
                  });
              },
              error: (e) => {
                console.log('Erro ao excluir', JSON.stringify(e));
              },
            });
          }
        });
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EstadoService } from '../../../services/estado.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Estado } from '../../../models/estado.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-form',
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
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent {
  formGroup: FormGroup;

  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      sigla: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const estado: Estado = this.activatedRoute.snapshot.data['estado'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (estado && estado.id) ? estado.id : null],
      nome: [
        (estado && estado.nome) ? estado.nome : null, 
        Validators.required],
      sigla: [
        (estado && estado.sigla) ? estado.sigla : null,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      if(estado.id == null) {
        this.cadastrar(estado);
      } else {
        this.atualizar(estado);
      }
    }
  }

  cadastrar(estado: any) {
    this.estadoService.insert(estado).subscribe({
      next: (estadoCadastrado) => {
        this.router.navigateByUrl('/admin/estados');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(estado: any) {
    this.estadoService.update(estado).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/estados');
      }
    });
  }

  excluir() {
    const estado = this.formGroup.value;
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
            this.estadoService.delete(estado).subscribe({
              next: () => {
                Swal.fire({
                  title: "Deletado!",
                  text: "Estado deletado com sucesso!",
                  icon: "success"
                });
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/admin/estados']);
                });
              },
              error: (e) => {
                console.log('Erro ao excluir', JSON.stringify(e));
              }
            });
          }
        });
  }
}

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
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quantidadeantena-form',
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
  templateUrl: './quantidadeantena-form.component.html',
  styleUrl: './quantidadeantena-form.component.css'
})
export class QuantidadeantenaFormComponent {
  formGroup: FormGroup;

  quantidadeAntenas: QuantidadeAntena[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private quantidadeAntenaService: QuantidadeAntenaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      quantidade: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const quantidadeAntena: QuantidadeAntena = this.activatedRoute.snapshot.data['quantidadeantena'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (quantidadeAntena && quantidadeAntena.id) ? quantidadeAntena.id : null],
      quantidade: [
        (quantidadeAntena && quantidadeAntena.quantidade) ? quantidadeAntena.quantidade : null, 
        Validators.required],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const quantidadeAntena = this.formGroup.value;
      if(quantidadeAntena.id == null) {
        this.cadastrar(quantidadeAntena);
      } else {
        this.atualizar(quantidadeAntena);
      }
    }
  }

  cadastrar(quantidadeAntena: any) {
    this.quantidadeAntenaService.insert(quantidadeAntena).subscribe({
      next: (quantidadeAntenaCadastrado) => {
        this.router.navigateByUrl('/admin/quantidadeantenas');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(quantidadeAntena: any) {
    this.quantidadeAntenaService.update(quantidadeAntena).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/quantidadeantenas');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const quantidadeAntena = this.formGroup.value;
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
          this.quantidadeAntenaService.delete(quantidadeAntena).subscribe({
            next: () => {
              Swal.fire({
                title: "Deletado!",
                text: "Quantidade de Antena deletado com sucesso!",
                icon: "success"
              });
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin/quantidadeantenas']);
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

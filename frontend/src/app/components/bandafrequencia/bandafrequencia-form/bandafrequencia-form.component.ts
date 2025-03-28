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
import { BandaFrequencia } from '../../../models/banda-frequencia.model';
import { BandaFrequenciaService } from '../../../services/banda-frequencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bandafrequencia-form',
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
  templateUrl: './bandafrequencia-form.component.html',
  styleUrl: './bandafrequencia-form.component.css'
})
export class BandafrequenciaFormComponent {
  formGroup: FormGroup;

  bandaFrequencias: BandaFrequencia[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bandaFrequenciaService: BandaFrequenciaService,
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
    const bandaFrequencia: BandaFrequencia = this.activatedRoute.snapshot.data['bandafrequencia'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (bandaFrequencia && bandaFrequencia.id) ? bandaFrequencia.id : null],
      nome: [
        (bandaFrequencia && bandaFrequencia.nome) ? bandaFrequencia.nome : null, 
        Validators.required],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const bandaFrequencia = this.formGroup.value;
      if(bandaFrequencia.id == null) {
        this.cadastrar(bandaFrequencia);
      } else {
        this.atualizar(bandaFrequencia);
      }
    }
  }

  cadastrar(bandaFrequencia: any) {
    this.bandaFrequenciaService.insert(bandaFrequencia).subscribe({
      next: (bandaFrequenciaCadastrado) => {
        this.router.navigateByUrl('/admin/bandafrequencias');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(bandaFrequencia: any) {
    this.bandaFrequenciaService.update(bandaFrequencia).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/bandafrequencias');
      }
    });
  }

  excluir() {
    const bandaFrequencia = this.formGroup.value;
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
        Swal.fire({
          title: 'Deletado!',
          text: 'Banda de Frequência deletada com sucesso!',
          icon: 'success',
        });
        
        this.bandaFrequenciaService.delete(bandaFrequencia).subscribe({
          next: () => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/admin/bandafrequencias']);
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

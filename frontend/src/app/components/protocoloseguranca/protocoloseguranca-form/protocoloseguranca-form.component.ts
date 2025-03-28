import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProtocoloSegurancaService } from '../../../services/protocolo-seguranca.service';
import { ProtocoloSeguranca } from '../../../models/protocolo-seguranca.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-protocoloseguranca-form',
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
  templateUrl: './protocoloseguranca-form.component.html',
  styleUrl: './protocoloseguranca-form.component.css',
})
export class ProtocolosegurancaFormComponent {
  formGroup: FormGroup;

  protocolosSeguranca: ProtocoloSeguranca[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private protocoloSegurancaService: ProtocoloSegurancaService,
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
    const protocoloSeguranca: ProtocoloSeguranca =
      this.activatedRoute.snapshot.data['protocoloseguranca'];

    this.formGroup = this.formBuilder.group({
      id: [
        protocoloSeguranca && protocoloSeguranca.id
          ? protocoloSeguranca.id
          : null,
      ],
      nome: [
        protocoloSeguranca && protocoloSeguranca.nome
          ? protocoloSeguranca.nome
          : null,
        Validators.required,
      ],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const protocoloSeguranca = this.formGroup.value;
      if (protocoloSeguranca.id == null) {
        this.cadastrar(protocoloSeguranca);
      } else {
        this.atualizar(protocoloSeguranca);
      }
    }
  }

  cadastrar(protocoloSeguranca: any) {
    this.protocoloSegurancaService.insert(protocoloSeguranca).subscribe({
      next: (protocoloSegurancaCadastrado) => {
        this.router.navigateByUrl('/admin/protocolosseguranca');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(protocoloSeguranca: any) {
    this.protocoloSegurancaService.update(protocoloSeguranca).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/protocolosseguranca');
      },
    });
  }

  excluir() {
    const protocoloSeguranca = this.formGroup.value;
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
        this.protocoloSegurancaService.delete(protocoloSeguranca).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deletado!',
              text: 'Protocolo de Segurança deletado com sucesso!',
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

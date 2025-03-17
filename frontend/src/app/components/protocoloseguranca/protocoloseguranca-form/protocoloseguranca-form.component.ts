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
    private protocolosSegurancaService: ProtocoloSegurancaService,
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
    this.protocolosSegurancaService.insert(protocoloSeguranca).subscribe({
      next: (protocoloSegurancaCadastrado) => {
        this.router.navigateByUrl('/protocolosseguranca');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(protocoloSeguranca: any) {
    this.protocolosSegurancaService.update(protocoloSeguranca).subscribe({
      next: () => {
        this.router.navigateByUrl('/protocolosseguranca');
      },
    });
  }

  excluir() {
    const protocoloSeguranca = this.formGroup.value;
    this.protocolosSegurancaService.delete(protocoloSeguranca).subscribe({
      next: () => {
        this.router.navigateByUrl('/protocolosseguranca');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }
}

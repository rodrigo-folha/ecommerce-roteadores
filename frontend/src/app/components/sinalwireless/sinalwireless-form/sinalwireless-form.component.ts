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
import { SinalWirelessService } from '../../../services/sinal-wireless.service';
import { SinalWireless } from '../../../models/sinal-wireless.model';

@Component({
  selector: 'app-sinalwireless-form',
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
  templateUrl: './sinalwireless-form.component.html',
  styleUrl: './sinalwireless-form.component.css'
})
export class SinalwirelessFormComponent {
  formGroup: FormGroup;

  sinalWireless: SinalWireless[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sinalWirelessService: SinalWirelessService,
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
    const sinalWireless: SinalWireless = this.activatedRoute.snapshot.data['sinalwireless'];

    this.formGroup = this.formBuilder.group({
      id: [ 
        (sinalWireless && sinalWireless.id) ? sinalWireless.id : null],
      nome: [
        (sinalWireless && sinalWireless.nome) ? sinalWireless.nome : null, 
        Validators.required],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const sinalWireless = this.formGroup.value;
      if(sinalWireless.id == null) {
        this.cadastrar(sinalWireless);
      } else {
        this.atualizar(sinalWireless);
      }
    }
  }

  cadastrar(sinalWireless: any) {
    this.sinalWirelessService.insert(sinalWireless).subscribe({
      next: (sinalWirelessCadastrado) => {
        this.router.navigateByUrl('/admin/sinalwireless');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(sinalWireless: any) {
    this.sinalWirelessService.update(sinalWireless).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/sinalwireless');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const sinalWireless = this.formGroup.value;
    this.sinalWirelessService.delete(sinalWireless).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/sinalwireless');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }

}

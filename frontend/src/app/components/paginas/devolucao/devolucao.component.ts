import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-devolucao',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './devolucao.component.html',
  styleUrl: './devolucao.component.css'
})
export class DevolucaoComponent {
  returnForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.returnForm = this.fb.group({
      orderNumber: ['', Validators.required],
      reason: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.returnForm.valid) {
      console.log('Solicitação de devolução:', this.returnForm.value);
      alert('Solicitação enviada com sucesso! Entraremos em contato em até 24 horas.');
      this.returnForm.reset();
    }
  }
}

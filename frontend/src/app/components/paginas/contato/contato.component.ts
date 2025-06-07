import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contato',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
})
export class ContatoComponent {
  contactForm: FormGroup
  submitted = false

  ngOnInit() {
    window.scroll(0, 0);
  }

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    })
  }

  onSubmit() {
    this.submitted = true
    if (this.contactForm.valid) {
      console.log("Formulário enviado:", this.contactForm.value)
      // Aqui você implementaria o envio do email
      alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
      this.contactForm.reset()
      this.submitted = false
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted))
  }
}

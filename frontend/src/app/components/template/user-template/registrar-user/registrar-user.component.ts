import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registrar-user',
  providers: [provideNativeDateAdapter(), {
          provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
          provideNgxMask(),
        ],
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './registrar-user.component.html',
  styleUrl: './registrar-user.component.css'
})
export class RegistrarUserComponent {
  registerForm: FormGroup
  isSubmitting = false
  showPassword = false
  showconfirmarSenha = false
  registerError: string | null = null
  registerSuccess = false

  constructor(private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group(
      {
        nome: ["", [Validators.required]],
        cpf: ["", [Validators.required, this.cpfValidator]],
        email: ["", [Validators.required, Validators.email]],
        senha: ["", [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ["", [Validators.required]],
        termsAccepted: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  get nome() {
    return this.registerForm.get("nome")
  }

  get cpf() {
    return this.registerForm.get("cpf")
  }

  get email() {
    return this.registerForm.get("email")
  }

  get senha() {
    return this.registerForm.get("senha")
  }

  get confirmarSenha() {
    return this.registerForm.get("confirmarSenha")
  }

  get termsAccepted() {
    return this.registerForm.get("termsAccepted")
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  toggleconfirmarSenhaVisibility() {
    this.showconfirmarSenha = !this.showconfirmarSenha
  }

  // Validador personalizado para CPF
  cpfValidator(control: any) {
    const cpf = control.value?.replace(/[^\d]/g, "") || ""

    if (cpf.length !== 11) {
      return { invalidCpf: true }
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return { invalidCpf: true }
    }

    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(9))) {
      return { invalidCpf: true }
    }

    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(10))) {
      return { invalidCpf: true }
    }

    return null
  }

  // Validador para verificar se as senhas coincidem
  passwordMatchValidator(form: FormGroup) {
    const senha = form.get("senha")?.value
    const confirmarSenha = form.get("confirmarSenha")?.value

    if (senha !== confirmarSenha) {
      form.get("confirmarSenha")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  // Formatar CPF enquanto o usuário digita
  formatCpf(event: any) {
    let value = event.target.value.replace(/\D/g, "")

    if (value.length > 11) {
      value = value.substring(0, 11)
    }

    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3")
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})$/, "$1.$2")
    }

    event.target.value = value
    this.registerForm.get("cpf")?.setValue(value)
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    this.registerError = null

    console.log("Enviando dados: ", this.registerForm.value)

    if (this.registerForm.valid) {
      const cliente = this.registerForm.value;

      this.clienteService.insertBasico(cliente).subscribe({
        next: () => {
          this.showSnackbarTopPosition("Cadastro realizado com sucesso", 'Fechar', 2000);
          this.registerSuccess = true
          this.isSubmitting = false
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.errors) {
            err.error.errors.forEach((error: any) => {
              const field = error.fieldName;
              const message = error.message;

              const control = this.registerForm.get(field);
              if (control) {
                control.setErrors({ backend: message });
              }
              this.registerSuccess = false
              this.isSubmitting = false
            });
          }
        }
      })
    }
  }

  showSnackbarTopPosition(content: any, action: any, duration: any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

}

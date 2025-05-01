import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registrar-user',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './registrar-user.component.html',
  styleUrl: './registrar-user.component.css'
})
export class RegistrarUserComponent {
  registerForm: FormGroup
  isSubmitting = false
  showPassword = false
  showConfirmPassword = false
  registerError: string | null = null
  registerSuccess = false

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required]],
        cpf: ["", [Validators.required, this.cpfValidator]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
        termsAccepted: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  get name() {
    return this.registerForm.get("name")
  }

  get cpf() {
    return this.registerForm.get("cpf")
  }

  get email() {
    return this.registerForm.get("email")
  }

  get password() {
    return this.registerForm.get("password")
  }

  get confirmPassword() {
    return this.registerForm.get("confirmPassword")
  }

  get termsAccepted() {
    return this.registerForm.get("termsAccepted")
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword
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
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (password !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
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

    // Simulação de registro - em um app real, você chamaria um serviço de autenticação
    setTimeout(() => {
      console.log("Registro com:", this.registerForm.value)

      // Simulação de erro para demonstração
      // Em um app real, isso seria baseado na resposta do serviço de autenticação
      const simulateError = false

      if (simulateError) {
        this.registerError = "Este e-mail já está em uso. Por favor, tente outro ou faça login."
        this.isSubmitting = false
      } else {
        // Mostrar mensagem de sucesso
        this.registerSuccess = true
        this.isSubmitting = false

        // Em um app real, você redirecionaria para a página de login ou para a página inicial
        // this.router.navigate(['/login'])
      }
    }, 1500)
  }
}

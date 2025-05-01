import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-user',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {

  loginForm: FormGroup
  isSubmitting = false
  showPassword = false
  loginError: string | null = null

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    })
  }

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    this.loginError = null

    // Simulação de login - em um app real, você chamaria um serviço de autenticação
    setTimeout(() => {
      console.log("Login com:", this.loginForm.value)

      // Simulação de erro para demonstração
      // Em um app real, isso seria baseado na resposta do serviço de autenticação
      const simulateError = false

      if (simulateError) {
        this.loginError = "E-mail ou senha incorretos. Por favor, tente novamente."
        this.isSubmitting = false
      } else {
        // Redirecionar para a página inicial após login bem-sucedido
        // Em um app real, você usaria o Router para navegar
        console.log("Login bem-sucedido, redirecionando...")
        // this.router.navigate(['/'])
      }
    }, 1500)
  }

}

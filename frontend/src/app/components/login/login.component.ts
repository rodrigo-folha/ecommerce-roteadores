import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup
  isSubmitting = false
  showPassword = false
  loginError: string | null = null

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      senha: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    })
  }

  get email() {
    return this.loginForm.get("email")
  }

  get senha() {
    return this.loginForm.get("senha")
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    // this.isSubmitting = true
    // this.loginError = null

    const email = this.loginForm.get('email')!.value;
    const senha = this.loginForm.get('senha')!.value;

      this.authService.loginUserKeycloak(email, senha).subscribe({
        next: (resp) => {
          this.router.navigateByUrl('/admin')
        },
        error: (err) => {
          console.log(err);
          this.showSnackbarTopPosition("Dados inválidos", 'Fechar', 2000);
        }
      });
  }

  showSnackbarTopPosition(content: any, action: any, duration: any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMessage: string = '';
  hide = signal(true);
  clickEvent(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.hide.set(!this.hide());
  }

  loginClienteForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    // private sessionTokenService: SessionTokenService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private snackBar: MatSnackBar
  ) {
    this.loginClienteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }
  
  onSubmit() {
    const email = this.loginClienteForm.get('email')?.value;
    const senha = this.loginClienteForm.get('senha')?.value;

    if (!email || !senha) {
      return;
    }

    this.authService.login(email, senha, 'cliente')
      .subscribe({
        next: (response) => {
          const token = response.token;
          this.authService.setToken(token);
          this.loginClienteForm.reset();
          this.errorMessage = '';
          this.showNotification('Login realizado com sucesso!', 'success');
          this.navigationService.navigateTo('');
        },
        error: (error) => {
          console.log(email + ' ' + senha);
          this.showNotification('Usuário ou senha inválidos.', 'error');
          this.errorMessage = 'Usuário ou senha inválidos.';
        }
      });

    // this.sessionTokenService.authenticateCliente(email, senha)
    //   .subscribe({
    //     next: (response) => {
    //       const token = response.token;
    //       this.sessionTokenService.saveSessionToken(token);
    //       this.loginClienteForm.reset();
    //       this.errorMessage = '';
    //       this.showNotification('Login realizado com sucesso!', 'success');
    //       this.navigationService.navigateTo('');
    //     },
    //     error: (error) => {
    //       console.log(email + ' ' + senha);
    //       this.showNotification('Usuário ou senha inválidos.', 'error');
    //       this.errorMessage = 'Usuário ou senha inválidos.';
    //     }
    //   });
  }

  cadastrarCliente(): void {
    this.navigationService.navigateTo('cadastrar');
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

}

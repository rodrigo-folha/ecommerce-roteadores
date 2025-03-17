import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
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
import { ClienteService } from '../../services/cliente.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-cadastro',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatCheckboxModule,
      MatSnackBarModule,
    ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  errorMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  loginClienteForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {
    this.loginClienteForm = this.formBuilder.group(
      {
        nome: [''],
        cpf: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        confirmarSenha: ['', Validators.required],
      }, { validators: this.matchPasswords('senha', 'confirmarSenha') }
  );
  }

  matchPasswords(senhaKey: string, confirmarSenhaKey: string) {
    return (formGroup: AbstractControl) => {
      const senha = formGroup.get(senhaKey);
      const confirmarSenha = formGroup.get(confirmarSenhaKey);

      if (confirmarSenha?.errors && !confirmarSenha.errors['passwordMismatch']) {
        return null;
      }

      if (senha?.value !== confirmarSenha?.value) {
        confirmarSenha?.setErrors({ passwordMismatch: true });
      } else {
        confirmarSenha?.setErrors(null);
      }
      return null;
    };
  }
  
  onSubmit() {

    // const nome = this.loginClienteForm.get('nome')?.value;
    // const cpf = this.loginClienteForm.get('cpf')?.value;
    // const email = this.loginClienteForm.get('email')?.value;
    // const senha = this.loginClienteForm.get('senha')?.value;

    if (this.loginClienteForm.valid) {
      const cliente = this.loginClienteForm.value;

      this.clienteService.create(cliente).subscribe({
        next: () => {
          this.showNotification('Cliente cadastrado com sucesso!', 'success');
          this.navigationService.navigateTo('login');
        },
        error: (err) => this.showNotification('Erro ao cadastrar cliente!', 'error')
        }
      );
    }
    // TODO CRIAR CONTA

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
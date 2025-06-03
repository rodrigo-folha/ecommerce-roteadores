import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenExpired()) {
    console.log("Token inválido!");
    authService.removeToken();
    authService.removeUsuarioLogado();
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};

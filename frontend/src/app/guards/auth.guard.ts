import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenExpired()) {
    authService.removeToken();
    authService.removeUsuarioLogado();
    router.navigate(['/login']);
    return false;
  }

  const roles = authService.getRolesFromToken();
  if (!roles.includes('User')) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

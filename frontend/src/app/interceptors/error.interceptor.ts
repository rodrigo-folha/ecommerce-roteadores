import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        const isAdmin = router.url.includes('/admin');
        if (isAdmin) {
          router.navigate(['/admin/login']);
        } else {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};

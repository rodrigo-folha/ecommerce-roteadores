import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const listOfErrors = new Array(401, 403);
        if (listOfErrors.indexOf(error.status) > -1) {
          this.authService.removeToken();
          this.authService.removeUsuarioLogado;

          this.router.navigate(['/']);
        }

        return throwError(() => error);
      })
    )
  }
}

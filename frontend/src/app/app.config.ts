import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { CustomPaginatorIntlService } from './services/custom-paginator-intl.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // provideHttpClient(),
    JwtHelperService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ],
};

import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional para añadir el token de autorización a las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);

  // URLs que no requieren token
  const excludedUrls = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/public'
  ];

  // Verificar si la URL está excluida
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    return next(req);
  }

  // Obtener el token actual
  const currentUser = authService.currentUser();
  const token = currentUser?.token;

  if (token) {
    // Clonar la request y añadir el header de autorización
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq).pipe(
      catchError(error => {
        // Si el token ha expirado (401), intentar renovarlo
        if (error.status === 401 && authService.isAuthenticated()) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Retry la request original con el nuevo token
              const newUser = authService.currentUser();
              const newToken = newUser?.token;

              if (newToken) {
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                });
                return next(retryReq);
              }

              // Si no hay nuevo token, logout
              authService.logout();
              return throwError(() => error);
            }),
            catchError(() => {
              // Si falla la renovación, logout
              authService.logout();
              return throwError(() => error);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  // Si no hay token, enviar la request sin modificar
  return next(req);
};
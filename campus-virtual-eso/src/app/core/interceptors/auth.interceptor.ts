import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Verificar si la petición necesita autenticación
  const isAuthRequired = !req.url.includes('/auth/') && !req.url.includes('/public/');

  if (isAuthRequired) {
    const currentUser = authService.currentUser();

    if (currentUser) {
      // Simular token (en producción vendría del AuthService)
      const token = localStorage.getItem('auth_token') || 'mock-jwt-token';

      // Clonar la petición y añadir el header de autorización
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(authReq).pipe(
        catchError(error => {
          // Si el token ha expirado (401), hacer logout automáticamente
          if (error.status === 401) {
            console.warn('Token expirado, cerrando sesión...');
            authService.logout();
          }
          return throwError(() => error);
        })
      );
    } else if (isAuthRequired) {
      // Si no hay usuario autenticado y la ruta requiere auth, redirigir al login
      console.warn('Petición requiere autenticación pero no hay usuario logueado');
      authService.logout();
      return throwError(() => new Error('Authentication required'));
    }
  }

  // Para peticiones que no requieren autenticación, continuar normalmente
  return next(req);
};
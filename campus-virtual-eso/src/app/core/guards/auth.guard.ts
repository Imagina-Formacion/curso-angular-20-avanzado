import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn, CanMatchFn } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guard funcional para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  // Guardar la URL intentada para redireccionar después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

/**
 * Guard funcional para rutas que NO deben ser accesibles cuando el usuario está autenticado
 * (como login, register)
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return true;
  }

  // Si está autenticado, redireccionar al dashboard
  router.navigate(['/dashboard']);
  return false;
};

/**
 * Guard funcional para verificar roles específicos
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.userRole();

    if (!isAuthenticated) {
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Usuario autenticado pero sin permisos
    router.navigate(['/unauthorized']);
    return false;
  };
};

/**
 * Guard específico para estudiantes
 */
export const studentGuard: CanActivateFn = roleGuard(['student']);

/**
 * Guard específico para profesores
 */
export const teacherGuard: CanActivateFn = roleGuard(['teacher']);

/**
 * Guard específico para administradores
 */
export const adminGuard: CanActivateFn = roleGuard(['admin']);

/**
 * Guard para profesores y administradores
 */
export const teacherOrAdminGuard: CanActivateFn = roleGuard(['teacher', 'admin']);

/**
 * Guard para verificar si el token es válido
 */
export const tokenValidGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const isTokenValid = authService.isTokenValid();

  if (isAuthenticated && isTokenValid) {
    return true;
  }

  if (isAuthenticated && !isTokenValid) {
    // Token expirado, cerrar sesión
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url, reason: 'token_expired' }
    });
    return false;
  }

  // No autenticado
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard que combina autenticación y validación de token
 */
export const secureGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const isTokenValid = authService.isTokenValid();

  if (!isTokenValid) {
    // Token expirado, cerrar sesión
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url, reason: 'token_expired' }
    });
    return false;
  }

  return true;
};

/**
 * Guard para rutas que pueden ser lazy-loaded
 */
export const authCanMatch: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
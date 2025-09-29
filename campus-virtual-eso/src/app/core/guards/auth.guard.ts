import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CanActivateFn } from "@angular/router";

import { AuthService } from "../services/auth.service";

/**
 * Guard simple para rutas protegidas
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir a login si no está autenticado
  router.navigate(["/login"]);
  return false;
};

/**
 * Guard para evitar acceso al login si ya está autenticado
 */
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirigir a dashboard si ya está autenticado
  router.navigate(["/dashboard"]);
  return false;
};
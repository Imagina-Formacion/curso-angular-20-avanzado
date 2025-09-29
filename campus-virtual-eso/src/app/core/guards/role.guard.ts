import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  // Obtener los roles requeridos desde la data de la ruta
  const requiredRoles = route.data['roles'] as UserRole[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // Si no se especifican roles, permitir acceso
  }

  const hasRequiredRole = requiredRoles.includes(currentUser.role);

  if (!hasRequiredRole) {
    // Redireccionar según el rol del usuario
    switch (currentUser.role) {
      case UserRole.STUDENT:
        router.navigate(['/dashboard']);
        break;
      case UserRole.TEACHER:
        router.navigate(['/dashboard']);
        break;
      case UserRole.ADMIN:
        router.navigate(['/dashboard']);
        break;
      default:
        router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};
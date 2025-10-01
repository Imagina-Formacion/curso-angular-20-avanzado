import { Router } from "@angular/router";
import { CanActivateFn } from "@angular/router";

import { AuthService } from "../services/auth.service";

/**
 * Guard funcional para rutas protegidas
 * Verifica si el usuario está autenticado antes de permitir acceso
 */
export const authGuard: CanActivateFn = () => {
  // TODO: Inyectar AuthService usando inject()
  // Hint: const authService = inject(AuthService);

  // TODO: Inyectar Router usando inject()
  // Hint: const router = inject(Router);

  // TODO: Verificar si el usuario está autenticado
  // Hint: if (authService.isAuthenticated()) { return true; }

  // TODO: Si no está autenticado, redirigir a login
  // Hint: router.navigate(['/login']);
  // Hint: return false;

  return true; // Reemplazar con la lógica correcta
};

/**
 * Guard funcional para prevenir acceso al login si ya está autenticado
 */
export const loginGuard: CanActivateFn = () => {
  // TODO: Inyectar AuthService usando inject()

  // TODO: Inyectar Router usando inject()

  // TODO: Verificar si el usuario NO está autenticado
  // Hint: if (!authService.isAuthenticated()) { return true; }

  // TODO: Si ya está autenticado, redirigir a dashboard
  // Hint: router.navigate(['/dashboard']);
  // Hint: return false;

  return true; // Reemplazar con la lógica correcta
};

/**
 * 💡 Conceptos Clave de Guards Funcionales:
 *
 * 1. CanActivateFn: Tipo de función para guards modernos
 *    - Reemplaza la interfaz CanActivate de clase
 *    - Más simple y directo
 *    - Mejor para tree-shaking
 *
 * 2. inject(): Función para inyección de dependencias
 *    - Funciona fuera de constructores
 *    - Debe usarse en injection context
 *    - Más flexible que constructor injection
 *
 * 3. Return boolean: El guard debe retornar:
 *    - true: Permite navegación
 *    - false: Bloquea navegación
 *    - UrlTree: Redirige a otra ruta
 *
 * 4. Composabilidad: Los guards funcionales son más fáciles de componer
 *    - Se pueden combinar con lógica adicional
 *    - Se pueden testear más fácilmente
 *    - Se pueden reutilizar como funciones normales
 *
 * 5. Sin this: No hay contexto de clase
 *    - Todo se pasa como parámetros o se inyecta
 *    - Más predecible y funcional
 */

import { Routes } from "@angular/router";

import { authGuard, loginGuard } from "./core/guards/auth.guard";

// TODO: Configurar rutas con lazy loading usando loadComponent
// Este es el routing moderno de Angular 20 sin NgModules

export const routes: Routes = [
  // Ruta raíz - redirige al dashboard
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },

  // TODO: Implementar ruta de login con lazy loading
  // Hint: Usar loadComponent con import() dinámico
  // Hint: loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent)
  // Hint: Agregar canActivate: [loginGuard] para prevenir acceso si ya está autenticado
  {
    path: "login",
    // TODO: Agregar loadComponent aquí

    // TODO: Agregar guard loginGuard
    // Hint: canActivate: [loginGuard]
  },

  // TODO: Implementar ruta de dashboard con lazy loading
  // Hint: Usar loadComponent con import() dinámico al archivo dashboard.component.ts
  // Hint: Agregar canActivate: [authGuard] para proteger la ruta
  {
    path: "dashboard",
    // TODO: Agregar loadComponent aquí

    // TODO: Agregar guard authGuard
    // Hint: canActivate: [authGuard]
  },

  // Ruta wildcard - captura cualquier ruta no definida
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];

/**
 * 💡 Conceptos Clave de Routing Moderno:
 *
 * 1. loadComponent: Permite lazy loading a nivel de componente (no módulo)
 *    - Más granular que loadChildren
 *    - Reduce el bundle size inicial
 *    - Carga componentes bajo demanda
 *
 * 2. Guards Funcionales: canActivate acepta funciones, no clases
 *    - Más simples que guards de clase
 *    - Usan inject() para dependencias
 *    - Mejor tree-shaking
 *
 * 3. Sin RouterModule: Ya no necesitas RouterModule.forRoot()
 *    - Configuración más simple
 *    - Se usa provideRouter() en main.ts
 *
 * 4. Type Safety: Routes está completamente tipado
 *    - Autocompletado en el IDE
 *    - Errores en tiempo de compilación
 */

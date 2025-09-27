import { Routes } from '@angular/router';
import {
  guestGuard,
  secureGuard
} from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta por defecto
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Rutas públicas (solo para usuarios no autenticados)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Iniciar Sesión - Campus Virtual ESO'
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [secureGuard],
    title: 'Dashboard - Campus Virtual ESO'
  },

  // Rutas futuras (implementar en sesiones posteriores)
  // Las rutas específicas se implementarán progresivamente

  // Ruta wildcard (debe ir al final) - redirigir al login por ahora
  {
    path: '**',
    redirectTo: '/login'
  }
];

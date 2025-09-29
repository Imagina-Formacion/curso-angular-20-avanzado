# Ejercicio 4: Routing y Guards Modernos

## 🎯 Objetivo
Implementar guards funcionais y estrategias avanzadas de routing con resolvers y lazy loading.

## 📋 Descripción
Crear un sistema de routing completo con autenticación, autorización, resolvers de datos y lazy loading inteligente.

## 🔧 Pasos del Ejercicio

### Paso 1: Guards de Autenticación
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar autenticación
  // Redirigir si no autenticado
  // Manejar rutas protegidas
};
```

### Paso 2: Guards de Autorización
- Verificar roles y permisos
- Guards por feature
- Guards condicionales
- Jerarquía de permisos

### Paso 3: Resolvers con Signals
- Pre-carga de datos
- Resolvers con signals
- Manejo de errores en resolvers
- Cache de datos resueltos

### Paso 4: Lazy Loading Inteligente
- Preload strategies personalizadas
- Conditional lazy loading
- Bundle optimization
- Progressive loading

## 🎨 Código Base

```typescript
// Guards funcionais
export const canActivateAdmin: CanActivateFn = (route, state) => {
  // Implementación
};

// Resolver con signals
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  return userService.getUser(route.params['id']);
};

// Configuración de rutas
export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, canActivateAdmin],
    loadComponent: () => import('./admin/admin.component'),
    children: [
      {
        path: 'users/:id',
        resolve: { user: userResolver },
        loadComponent: () => import('./user-detail/user-detail.component')
      }
    ]
  }
];
```

## ✅ Criterios de Aceptación

- [ ] Los guards son funcionais (no clases)
- [ ] La autenticación funciona correctamente
- [ ] Los permisos se verifican apropiadamente
- [ ] Los resolvers pre-cargan datos necesarios
- [ ] El lazy loading optimiza la carga
- [ ] Las rutas son type-safe
- [ ] Los tests cubren todos los guards

## 💡 Consejos

1. Usa inject() para dependencias en guards
2. Implementa guards composables
3. Considera UX en guards que fallan
4. Usa resolvers para datos críticos
5. Optimiza bundle size con lazy loading

## 🔗 Recursos

- [Route Guards](https://angular.dev/guide/routing/guards)
- [Resolvers](https://angular.dev/guide/routing/resolvers)
- [Lazy Loading](https://angular.dev/guide/routing/lazy-loading)
- [Preloading Strategies](https://angular.dev/guide/routing/preloading)
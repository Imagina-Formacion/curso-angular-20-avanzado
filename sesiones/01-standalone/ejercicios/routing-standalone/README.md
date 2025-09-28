# 🗺️ Ejercicio: Routing con Standalone Components

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Configurar routing moderno con standalone components
- Implementar lazy loading optimizado sin módulos
- Crear guards funcionales para protección de rutas
- Usar el nuevo sistema de providers para routing

## ⏱️ Duración: 50 minutos

---

## 📚 Parte 1: Routing Moderno (10 min)

### 🤔 ¿Qué ha cambiado en el routing?
El routing con standalone components introduce:
- **`loadComponent`** en lugar de `loadChildren`
- **Guards funcionales** más simples
- **Providers de routing** centralizados
- **Tree-shaking automático** más efectivo

### 🎯 ¿Por qué es importante?
- **Bundles más pequeños**: Solo carga lo necesario
- **Mejor DX**: Menos boilerplate
- **Performance mejorada**: Lazy loading optimizado
- **Código más limpio**: Menos abstracciones

---

## 🛠️ Parte 2: Implementación Completa (35 min)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular con routing
ng new routing-standalone-demo --standalone --style=scss --routing=true
cd routing-standalone-demo

# 3. Copiar snippets del curso
# Descargar: https://github.com/tu-repo/curso-angular-20-avanzado
# Copiar: .vscode/snippets/ al proyecto
```

#### **Opción B: Local dentro del ejercicio**
```bash
# Desde la carpeta del ejercicio: sesiones/01-standalone/ejercicios/routing-standalone/
ng new routing-standalone-demo --standalone --style=scss --routing=true
cd routing-standalone-demo
# Los snippets del curso ya están disponibles automáticamente
```

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-route-config`**: Configuración de rutas
- **`ng20-lazy-route`**: Ruta con lazy loading
- **`ng20-guard`**: Guard funcional
- **`ng20-standalone-page`**: Página standalone
- **`ng20-layout`**: Layout component

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 🗺️ Paso 2: Configuración de Rutas Modernas

**Archivo:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // 🏠 Ruta principal
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // 🏠 Páginas principales (carga inmediata)
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
    title: 'Inicio'
  },

  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(c => c.AboutComponent),
    title: 'Acerca de'
  },

  // 🔐 Área protegida con layout
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(c => c.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
        title: 'Dashboard'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent),
        title: 'Mi Perfil'
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(c => c.SettingsComponent),
        title: 'Configuración'
      }
    ]
  },

  // 👑 Área de administración
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/admin.component').then(c => c.AdminComponent),
        title: 'Administración'
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/users.component').then(c => c.UsersComponent),
        title: 'Gestión de Usuarios'
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/admin/reports/reports.component').then(c => c.ReportsComponent),
        title: 'Reportes'
      }
    ]
  },

  // 🔐 Autenticación
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(c => c.LoginComponent),
        title: 'Iniciar Sesión'
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(c => c.RegisterComponent),
        title: 'Registrarse'
      }
    ]
  },

  // 🚫 Página de error 404
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: 'Página no encontrada'
  }
];
```

### 🛡️ Paso 3: Guards Funcionales

**Archivo:** `src/app/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🎯 Guard funcional - más simple que las clases
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir a login con returnUrl
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

**Archivo:** `src/app/guards/admin.guard.ts`

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Redirigir al dashboard si no es admin
  router.navigate(['/dashboard']);
  return false;
};
```

### 🏗️ Paso 4: Layout Components

**Archivo:** `src/app/layouts/dashboard-layout/dashboard-layout.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-layout">
      <nav class="sidebar">
        <div class="sidebar-header">
          <h3>🏠 Mi Dashboard</h3>
        </div>

        <ul class="nav-menu">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              📊 Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/profile" routerLinkActive="active">
              👤 Mi Perfil
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/settings" routerLinkActive="active">
              ⚙️ Configuración
            </a>
          </li>

          @if (authService.isAdmin()) {
            <li class="nav-section">
              <span class="section-title">Administración</span>
            </li>
            <li>
              <a routerLink="/admin" routerLinkActive="active">
                👑 Panel Admin
              </a>
            </li>
          }
        </ul>

        <div class="sidebar-footer">
          <button (click)="logout()" class="logout-btn">
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      <main class="content">
        <header class="content-header">
          <h2>Bienvenido, {{ authService.currentUser()?.name || 'Usuario' }}</h2>
          <div class="user-info">
            <span class="user-role">{{ authService.getUserRole() }}</span>
          </div>
        </header>

        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #34495e;
    }

    .sidebar-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .nav-menu {
      flex: 1;
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .nav-menu li {
      margin: 0;
    }

    .nav-menu a {
      display: block;
      padding: 0.75rem 1.5rem;
      color: #bdc3c7;
      text-decoration: none;
      transition: all 0.3s;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      background: #34495e;
      color: white;
    }

    .nav-section {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      border-top: 1px solid #34495e;
    }

    .section-title {
      font-size: 0.85rem;
      color: #95a5a6;
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #34495e;
    }

    .logout-btn {
      width: 100%;
      padding: 0.75rem;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: #c0392b;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .content-header {
      background: white;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .content-header h2 {
      margin: 0;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-role {
      background: #007bff;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .content-body {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class DashboardLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
```

### 📄 Paso 5: Páginas Standalone

**Archivo:** `src/app/pages/home/home.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <header class="hero">
        <h1>🚀 Bienvenido a Routing Standalone</h1>
        <p>Demostración de routing moderno con componentes standalone</p>
      </header>

      <section class="features">
        <div class="feature-grid">
          <div class="feature-card">
            <h3>⚡ Lazy Loading</h3>
            <p>Componentes que se cargan solo cuando se necesitan</p>
          </div>

          <div class="feature-card">
            <h3>🛡️ Guards Funcionales</h3>
            <p>Protección de rutas con funciones simples</p>
          </div>

          <div class="feature-card">
            <h3>🗺️ Rutas Anidadas</h3>
            <p>Layouts complejos con router-outlet anidados</p>
          </div>

          <div class="feature-card">
            <h3>📦 Tree Shaking</h3>
            <p>Bundles optimizados automáticamente</p>
          </div>
        </div>
      </section>

      <section class="actions">
        <h2>Explorar la Aplicación</h2>
        <div class="action-buttons">
          <a routerLink="/auth/login" class="btn btn-primary">
            🔐 Iniciar Sesión
          </a>
          <a routerLink="/about" class="btn btn-secondary">
            ℹ️ Acerca de
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 3rem;
      margin: 0 0 1rem 0;
    }

    .hero p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }

    .features {
      margin-bottom: 3rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .feature-card h3 {
      color: #333;
      margin: 0 0 1rem 0;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .actions {
      text-align: center;
    }

    .actions h2 {
      color: #333;
      margin-bottom: 2rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-block;
      padding: 1rem 2rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }
  `]
})
export class HomeComponent { }
```

**Archivo:** `src/app/pages/auth/login/login.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>🔐 Iniciar Sesión</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">

            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="error-message">Email es requerido</div>
            }
          </div>

          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">

            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="error-message">Contraseña es requerida</div>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="login-btn">
            @if (isLoading) {
              ⏳ Iniciando sesión...
            } @else {
              🚀 Iniciar Sesión
            }
          </button>
        </form>

        <div class="demo-credentials">
          <h4>👤 Credenciales de Demo:</h4>
          <div class="credentials">
            <div>
              <strong>Usuario:</strong> user@demo.com / password123
            </div>
            <div>
              <strong>Admin:</strong> admin@demo.com / admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .login-btn {
      width: 100%;
      padding: 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .login-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .login-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .demo-credentials {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      text-align: center;
    }

    .demo-credentials h4 {
      color: #333;
      margin: 0 0 1rem 0;
    }

    .credentials div {
      margin: 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    try {
      const { email, password } = this.loginForm.value;
      const success = await this.authService.login(email!, password!);

      if (success) {
        // Redirigir a la URL original o al dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
```

### 🔧 Paso 6: Servicio de Autenticación

**Archivo:** `src/app/services/auth.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal(false);

  // Signals públicos
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    // Restaurar sesión si existe
    this.restoreSession();
  }

  async login(email: string, password: string): Promise<boolean> {
    this._isLoading.set(true);

    try {
      // Simular llamada a API
      await this.delay(1000);

      // Demo users
      const users: Record<string, User> = {
        'user@demo.com': {
          id: '1',
          name: 'Usuario Demo',
          email: 'user@demo.com',
          role: 'user'
        },
        'admin@demo.com': {
          id: '2',
          name: 'Admin Demo',
          email: 'admin@demo.com',
          role: 'admin'
        }
      };

      const user = users[email];
      if (user && (password === 'password123' || password === 'admin123')) {
        this._currentUser.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }

      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getUserRole(): string {
    const role = this._currentUser()?.role;
    return role === 'admin' ? 'Administrador' : 'Usuario';
  }

  private restoreSession(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this._currentUser.set(user);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 🎯 Paso 7: Configuración de la App

**Archivo:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🗺️ Configuración de routing con features modernas
    provideRouter(
      routes,
      withComponentInputBinding(), // Permite pasar route params como inputs
      withViewTransitions() // Animaciones de transición entre páginas
    ),

    // 🎨 Animaciones
    provideAnimations(),

    // 📦 Aquí agregarías más providers según necesites
  ]
};
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Lazy Loading
1. **Abre DevTools** → Network
2. **Navega entre páginas** y observa qué chunks se cargan
3. **Compara** con una app tradicional

### 🔬 Experimento 2: Guards en Acción
1. **Intenta acceder** a `/dashboard` sin estar logueado
2. **Prueba** acceder a `/admin` como usuario normal
3. **Observa** las redirecciones automáticas

### 🔬 Experimento 3: View Transitions
1. **Navega** entre páginas y observa las transiciones
2. **Habilita/deshabilita** `withViewTransitions()` en la config
3. **Nota** la diferencia visual

---

## 📊 Comparación: Routing Tradicional vs Standalone

| Aspecto | Routing Tradicional | Routing Standalone |
|---------|-------------------|------------------|
| **Lazy Loading** | `loadChildren: () => import('./module')` | `loadComponent: () => import('./component')` |
| **Guards** | Clases con interfaces | Funciones simples |
| **Configuración** | En módulos + routing | Solo en app.config.ts |
| **Bundle Size** | Incluye módulo completo | Solo el componente |
| **DX** | Más boilerplate | Más directo |

---

## ❓ Preguntas de Comprensión

1. **¿Cuál es la diferencia entre `loadChildren` y `loadComponent`?**

2. **¿Por qué los guards funcionales son mejores que las clases?**

3. **¿Cómo afecta `withComponentInputBinding()` al desarrollo?**

4. **¿Qué ventajas ofrece el tree-shaking en routing?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Breadcrumbs Dinámicos
Implementa breadcrumbs que:
- Se actualicen automáticamente según la ruta
- Muestren títulos personalizados
- Permitan navegación hacia atrás

### Desafío 2: Preloading Estratégico
Configura preloading que:
- Precargue rutas importantes
- Use diferentes estrategias según el contexto
- Monitoree el performance

### Desafío 3: Rutas Dinámicas
Crea rutas que:
- Acepten parámetros dinámicos
- Validen parámetros con resolvers
- Manejen errores elegantemente

---

## ✅ Checklist de Aprendizaje

- [ ] Comprendo el nuevo sistema de routing standalone
- [ ] Sé configurar lazy loading optimizado
- [ ] Domino los guards funcionales
- [ ] Puedo crear layouts complejos con router-outlet
- [ ] Entiendo las ventajas del tree-shaking en routing

---

## 🏁 Conclusión

**Recuerda:**
- `loadComponent` es más eficiente que `loadChildren`
- Guards funcionales simplifican la lógica de protección
- Los layouts con router-outlet permiten UIs complejas
- View transitions mejoran la UX sin esfuerzo adicional

**Próximo paso:** Integrar todo en una aplicación completa con todas las técnicas aprendidas
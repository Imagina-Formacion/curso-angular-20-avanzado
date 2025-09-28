# 🛣️ Ejercicio: Routing Standalone

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Configurar routing moderno sin NgModules
- Implementar lazy loading con `loadComponent`
- Crear guards funcionales con `inject()`
- Usar providers a nivel de ruta

## ⏱️ Duración: 50 minutos

---

## 📚 Parte 1: Conceptos Previos (15 min)

### 🤔 ¿Qué es el Routing Standalone?
El routing standalone en Angular 20 permite:
- **Configuración sin NgModules** usando `provideRouter()`
- **Lazy loading granular** con `loadComponent` vs `loadChildren`
- **Guards funcionales** más simples que las clases
- **Providers por ruta** para inyección específica

### 🎯 Ventajas del Routing Moderno
- **Setup más simple**: Una sola función de configuración
- **Bundle optimization**: Lazy loading automático mejorado
- **Type safety**: Guards con TypeScript perfecto
- **Performance**: Carga más rápida y eficiente

### 📖 Configuración Básica

```typescript
// 🚀 Bootstrap con routing
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});

// 🛣️ Rutas con lazy loading
const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent)
  }
];

// 🔒 Guard funcional
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

---

## 🛠️ Parte 2: Hands-On - Multi-Page Application (30 min)

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-routing`**: Configuración de routing completa
- **`ng20-guard`**: Guard funcional
- **`ng20-lazy-route`**: Ruta con lazy loading

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone con routing
ng new dashboard-app --standalone --style=scss --routing=true
cd dashboard-app

# 3. Instalar dependencias
npm install
```

### 🔐 Paso 2: Auth Service

**Archivo:** `src/app/services/auth.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 📊 Estado privado con signals
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal(false);

  // 🔗 Signals públicos readonly
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // 🧮 Computed signals
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userRole = computed(() => this._currentUser()?.role || 'guest');
  readonly isAdmin = computed(() => this.userRole() === 'admin');
  readonly userName = computed(() => this._currentUser()?.username || 'Guest');

  constructor() {
    // 🔄 Verificar si hay sesión guardada
    this.checkSavedSession();
  }

  // 🔐 Métodos de autenticación
  async login(username: string, password: string): Promise<boolean> {
    this._isLoading.set(true);

    try {
      // Simular llamada API
      await this.delay(1500);

      // Credenciales demo
      const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' as const },
        { username: 'user', password: 'user123', role: 'user' as const },
        { username: 'guest', password: 'guest123', role: 'guest' as const }
      ];

      const credential = validCredentials.find(
        c => c.username === username && c.password === password
      );

      if (credential) {
        const user: User = {
          id: Math.floor(Math.random() * 1000),
          username: credential.username,
          email: `${credential.username}@example.com`,
          role: credential.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credential.username}`
        };

        this._currentUser.set(user);
        this.saveSession(user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user-session');
  }

  // 💾 Persistencia de sesión
  private saveSession(user: User): void {
    localStorage.setItem('user-session', JSON.stringify(user));
  }

  private checkSavedSession(): void {
    const savedSession = localStorage.getItem('user-session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        this._currentUser.set(user);
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem('user-session');
      }
    }
  }

  // 🔧 Helper
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 🛡️ Paso 3: Guards Funcionales

**Archivo:** `src/app/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirigir a login guardando la URL destino
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};

export const guestOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  } else {
    // Si ya está autenticado, redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
  }
};
```

### 🏠 Paso 4: Layout Component

**Archivo:** `src/app/components/layout/dashboard-layout.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-layout">
      <!-- 📱 Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <!-- 🏠 Logo y título -->
          <div class="header-brand">
            <h1>🚀 Dashboard App</h1>
          </div>

          <!-- 👤 Info del usuario -->
          <div class="header-user">
            @if (authService.currentUser(); as user) {
              <div class="user-info">
                <img [src]="user.avatar" [alt]="user.username" class="user-avatar">
                <div class="user-details">
                  <span class="user-name">{{ user.username }}</span>
                  <span class="user-role">{{ getRoleDisplay(user.role) }}</span>
                </div>
              </div>
            }
            <button (click)="logout()" class="logout-btn" title="Cerrar sesión">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <!-- 📐 Contenido principal -->
      <div class="dashboard-content">
        <!-- 🧭 Sidebar de navegación -->
        <nav class="dashboard-sidebar">
          <div class="nav-section">
            <h3>📊 Principal</h3>
            <a
              routerLink="/dashboard"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-link"
            >
              🏠 Dashboard
            </a>
            <a
              routerLink="/dashboard/profile"
              routerLinkActive="active"
              class="nav-link"
            >
              👤 Perfil
            </a>
            <a
              routerLink="/dashboard/settings"
              routerLinkActive="active"
              class="nav-link"
            >
              ⚙️ Configuración
            </a>
          </div>

          <div class="nav-section">
            <h3>📈 Datos</h3>
            <a
              routerLink="/dashboard/analytics"
              routerLinkActive="active"
              class="nav-link"
            >
              📊 Analytics
            </a>
            <a
              routerLink="/dashboard/reports"
              routerLinkActive="active"
              class="nav-link"
            >
              📋 Reportes
            </a>
          </div>

          @if (authService.isAdmin()) {
            <div class="nav-section">
              <h3>👑 Admin</h3>
              <a
                routerLink="/admin"
                routerLinkActive="active"
                class="nav-link admin-link"
              >
                🔐 Panel Admin
              </a>
            </div>
          }

          <!-- 📊 Estadísticas rápidas -->
          <div class="sidebar-stats">
            <h3>📈 Estadísticas</h3>
            <div class="stat-item">
              <span class="stat-label">Sesión activa</span>
              <span class="stat-value">{{ getSessionDuration() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Rol actual</span>
              <span class="stat-value">{{ getRoleDisplay(authService.userRole()) }}</span>
            </div>
          </div>
        </nav>

        <!-- 📄 Área de contenido -->
        <main class="dashboard-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }

    .header-brand h1 {
      margin: 0;
      color: #343a40;
      font-size: 1.5rem;
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      color: #343a40;
    }

    .user-role {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .dashboard-content {
      display: flex;
      flex: 1;
    }

    .dashboard-sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid #e9ecef;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 2rem;
    }

    .nav-section h3 {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      text-transform: uppercase;
      color: #6c757d;
      font-weight: 600;
    }

    .nav-link {
      display: block;
      padding: 0.75rem 1rem;
      color: #495057;
      text-decoration: none;
      border-radius: 6px;
      margin-bottom: 0.25rem;
      transition: all 0.3s;
    }

    .nav-link:hover {
      background: #f8f9fa;
      color: #007bff;
    }

    .nav-link.active {
      background: #007bff;
      color: white;
    }

    .nav-link.admin-link {
      background: linear-gradient(135deg, #6f42c1, #e83e8c);
      color: white;
    }

    .nav-link.admin-link:hover {
      background: linear-gradient(135deg, #5a2d91, #d91a72);
    }

    .sidebar-stats {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .sidebar-stats h3 {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      text-transform: uppercase;
      color: #6c757d;
      font-weight: 600;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f8f9fa;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #6c757d;
    }

    .stat-value {
      font-size: 0.85rem;
      font-weight: 500;
      color: #495057;
    }

    .dashboard-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
      }

      .user-details {
        display: none;
      }

      .dashboard-sidebar {
        width: 200px;
      }

      .dashboard-main {
        padding: 1rem;
      }
    }

    @media (max-width: 640px) {
      .dashboard-content {
        flex-direction: column;
      }

      .dashboard-sidebar {
        width: 100%;
        max-height: none;
        padding: 1rem;
        border-right: none;
        border-bottom: 1px solid #e9ecef;
      }

      .nav-section {
        margin-bottom: 1rem;
      }

      .sidebar-stats {
        display: none;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  private sessionStart = new Date();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleDisplay(role: string): string {
    switch (role) {
      case 'admin': return '👑 Administrador';
      case 'user': return '👤 Usuario';
      case 'guest': return '👥 Invitado';
      default: return '❓ Desconocido';
    }
  }

  getSessionDuration(): string {
    const now = new Date();
    const diff = now.getTime() - this.sessionStart.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Menos de 1 min';
    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}
```

### 🔐 Paso 5: Login Component

**Archivo:** `src/app/components/login/login.component.ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🚀 Dashboard App</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <!-- 👤 Usuario -->
          <div class="form-group">
            <label for="username">Usuario</label>
            <input
              id="username"
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Ingresa tu usuario"
              class="form-input"
              required
              [disabled]="authService.isLoading()"
            >
          </div>

          <!-- 🔐 Contraseña -->
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                class="form-input"
                required
                [disabled]="authService.isLoading()"
              >
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="password-toggle"
                [disabled]="authService.isLoading()"
              >
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- ❌ Error message -->
          @if (errorMessage()) {
            <div class="error-message">
              <span class="error-icon">⚠️</span>
              {{ errorMessage() }}
            </div>
          }

          <!-- 🔄 Loading state -->
          @if (authService.isLoading()) {
            <div class="loading-message">
              <span class="loading-spinner">⟳</span>
              Iniciando sesión...
            </div>
          }

          <!-- 🚀 Submit button -->
          <button
            type="submit"
            class="login-btn"
            [disabled]="!isFormValid() || authService.isLoading()"
          >
            @if (authService.isLoading()) {
              <span class="loading-spinner">⟳</span>
              Iniciando...
            } @else {
              🚀 Iniciar Sesión
            }
          </button>
        </form>

        <!-- 💡 Demo credentials -->
        <div class="demo-credentials">
          <h3>💡 Credenciales de Demo</h3>
          <div class="credentials-grid">
            <div class="credential-item">
              <strong>👑 Admin:</strong>
              <button (click)="fillCredentials('admin', 'admin123')" class="fill-btn">
                admin / admin123
              </button>
            </div>
            <div class="credential-item">
              <strong>👤 User:</strong>
              <button (click)="fillCredentials('user', 'user123')" class="fill-btn">
                user / user123
              </button>
            </div>
            <div class="credential-item">
              <strong>👥 Guest:</strong>
              <button (click)="fillCredentials('guest', 'guest123')" class="fill-btn">
                guest / guest123
              </button>
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
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      padding: 3rem;
      width: 100%;
      max-width: 450px;
      backdrop-filter: blur(10px);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      margin: 0 0 0.5rem 0;
      color: #343a40;
      font-size: 2rem;
    }

    .login-header p {
      margin: 0;
      color: #6c757d;
      font-size: 1.1rem;
    }

    .login-form {
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    .form-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-input:disabled {
      background: #f8f9fa;
      cursor: not-allowed;
    }

    .password-input-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .password-toggle:hover:not(:disabled) {
      opacity: 1;
    }

    .password-toggle:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .error-icon {
      font-size: 1.2rem;
    }

    .loading-message {
      background: #d1ecf1;
      color: #0c5460;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
      font-size: 1.2rem;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .login-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #0056b3, #004085);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,123,255,0.3);
    }

    .login-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .demo-credentials {
      border-top: 1px solid #e9ecef;
      padding-top: 2rem;
    }

    .demo-credentials h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      color: #495057;
      text-align: center;
    }

    .credentials-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .credential-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .credential-item strong {
      color: #495057;
      font-size: 0.9rem;
    }

    .fill-btn {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .fill-btn:hover {
      background: #138496;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        padding: 2rem 1.5rem;
      }

      .login-header h1 {
        font-size: 1.5rem;
      }

      .credentials-grid {
        gap: 0.5rem;
      }

      .credential-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 📊 Formulario signals
  username = '';
  password = '';
  private _showPassword = signal(false);
  private _errorMessage = signal('');

  // 🔗 Readonly signals
  readonly showPassword = this._showPassword.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) return;

    this._errorMessage.set('');

    const success = await this.authService.login(this.username, this.password);

    if (success) {
      // Obtener URL de retorno o redirigir al dashboard
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigate([returnUrl]);
    } else {
      this._errorMessage.set('Usuario o contraseña incorrectos');
    }
  }

  togglePasswordVisibility(): void {
    this._showPassword.update(show => !show);
  }

  fillCredentials(username: string, password: string): void {
    this.username = username;
    this.password = password;
    this._errorMessage.set('');
  }

  isFormValid(): boolean {
    return this.username.trim().length > 0 && this.password.trim().length > 0;
  }
}
```

### 📊 Paso 6: Dashboard Components

**Archivo:** `src/app/components/dashboard/dashboard.component.ts`

```typescript
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <h1>👋 ¡Bienvenido, {{ authService.userName() }}!</h1>
        <p>{{ getWelcomeMessage() }}</p>
      </div>

      <!-- 📊 Cards de estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>Ventas</h3>
            <p class="stat-number">$24,567</p>
            <span class="stat-change positive">+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Usuarios</h3>
            <p class="stat-number">1,234</p>
            <span class="stat-change positive">+5%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>Pedidos</h3>
            <p class="stat-number">456</p>
            <span class="stat-change negative">-2%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Ingresos</h3>
            <p class="stat-number">$89,123</p>
            <span class="stat-change positive">+8%</span>
          </div>
        </div>
      </div>

      <!-- 📋 Sección de actividades recientes -->
      <div class="recent-activities">
        <h2>📋 Actividades Recientes</h2>
        <div class="activities-list">
          @for (activity of recentActivities; track activity.id) {
            <div class="activity-item">
              <span class="activity-icon">{{ activity.icon }}</span>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- 🎯 Quick actions basadas en rol -->
      <div class="quick-actions">
        <h2>🎯 Acciones Rápidas</h2>
        <div class="actions-grid">
          @for (action of quickActions(); track action.id) {
            <button class="action-btn" [style.background]="action.color">
              <span class="action-icon">{{ action.icon }}</span>
              <span class="action-text">{{ action.text }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .welcome-section h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .welcome-section p {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-content h3 {
      margin: 0 0 0.5rem 0;
      color: #6c757d;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .stat-number {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: #343a40;
    }

    .stat-change {
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
    }

    .stat-change.positive {
      background: #d4edda;
      color: #155724;
    }

    .stat-change.negative {
      background: #f8d7da;
      color: #721c24;
    }

    .recent-activities {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .recent-activities h2 {
      margin: 0 0 1.5rem 0;
      color: #343a40;
    }

    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .activity-icon {
      font-size: 1.5rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 0.25rem 0;
      color: #495057;
    }

    .activity-time {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .quick-actions {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .quick-actions h2 {
      margin: 0 0 1.5rem 0;
      color: #343a40;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .welcome-section h1 {
        font-size: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);

  recentActivities = [
    {
      id: 1,
      icon: '👤',
      text: 'Nuevo usuario registrado: María García',
      time: 'Hace 5 minutos'
    },
    {
      id: 2,
      icon: '💰',
      text: 'Venta completada: $1,234.56',
      time: 'Hace 15 minutos'
    },
    {
      id: 3,
      icon: '📦',
      text: 'Pedido #12345 enviado',
      time: 'Hace 1 hora'
    },
    {
      id: 4,
      icon: '📊',
      text: 'Reporte mensual generado',
      time: 'Hace 2 horas'
    }
  ];

  // 🧮 Computed para acciones rápidas según rol
  quickActions = computed(() => {
    const role = this.authService.userRole();
    const baseActions = [
      {
        id: 1,
        icon: '📊',
        text: 'Ver Analytics',
        color: '#007bff'
      },
      {
        id: 2,
        icon: '📋',
        text: 'Generar Reporte',
        color: '#28a745'
      }
    ];

    if (role === 'admin') {
      return [
        ...baseActions,
        {
          id: 3,
          icon: '👥',
          text: 'Gestionar Usuarios',
          color: '#dc3545'
        },
        {
          id: 4,
          icon: '⚙️',
          text: 'Configuración Sistema',
          color: '#6c757d'
        }
      ];
    }

    if (role === 'user') {
      return [
        ...baseActions,
        {
          id: 3,
          icon: '👤',
          text: 'Mi Perfil',
          color: '#17a2b8'
        }
      ];
    }

    return baseActions;
  });

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    const role = this.authService.userRole();

    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Buenos días';
    else if (hour < 18) timeGreeting = 'Buenas tardes';
    else timeGreeting = 'Buenas noches';

    let roleMessage = '';
    if (role === 'admin') roleMessage = 'Tienes acceso completo al sistema.';
    else if (role === 'user') roleMessage = 'Aquí tienes tu panel personalizado.';
    else roleMessage = 'Explora las funciones disponibles.';

    return `${timeGreeting}! ${roleMessage}`;
  }
}
```

### 🛣️ Paso 7: Configuración de Rutas

**Archivo:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestOnlyGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 🏠 Ruta raíz - redirigir al dashboard si está autenticado, sino al login
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // 🔐 Login (solo para usuarios no autenticados)
  {
    path: 'login',
    canActivate: [guestOnlyGuard],
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },

  // 📊 Dashboard Layout (requiere autenticación)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/layout/dashboard-layout.component')
      .then(m => m.DashboardLayoutComponent),
    children: [
      // 🏠 Dashboard home (exacta)
      {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },

      // 👤 Perfil de usuario
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component')
          .then(m => m.ProfileComponent)
      },

      // ⚙️ Configuración
      {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component')
          .then(m => m.SettingsComponent)
      },

      // 📊 Analytics
      {
        path: 'analytics',
        loadComponent: () => import('./components/analytics/analytics.component')
          .then(m => m.AnalyticsComponent)
      },

      // 📋 Reportes
      {
        path: 'reports',
        loadComponent: () => import('./components/reports/reports.component')
          .then(m => m.ReportsComponent)
      }
    ]
  },

  // 👑 Panel de administración (solo admins)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/admin.component')
      .then(m => m.AdminComponent)
  },

  // 🚫 Sin autorización
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },

  // ❓ 404 - Página no encontrada
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
```

### 🔧 Paso 8: Actualizar main.ts

**Archivo:** `src/main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// 🚀 Bootstrap con routing standalone
bootstrapApplication(AppComponent, {
  providers: [
    // 🛣️ Configuración de routing
    provideRouter(routes)

    // 🔧 Aquí puedes agregar más providers según necesites:
    // provideHttpClient(),
    // provideAnimations(),
    // etc.
  ]
}).catch(err => console.error(err));
```

### 🏠 Paso 9: App Component Final

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'dashboard-app';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Guards en Acción
1. **Intenta acceder a `/admin`** sin loguearte - deberías ir a login
2. **Loguéate como 'user'** e intenta ir a `/admin` - deberías ver "unauthorized"
3. **Loguéate como 'admin'** - ahora sí puedes acceder a admin

### 🔬 Experimento 2: Lazy Loading
1. **Abre DevTools** y ve a Network tab
2. **Navega entre rutas** y observa cómo se cargan los chunks dinámicamente
3. **Nota** que solo se carga el código necesario para cada ruta

### 🔬 Experimento 3: State Management
1. **Loguéate** y navega entre rutas - el estado se mantiene
2. **Recarga la página** - la sesión se restaura automáticamente
3. **Observa** cómo los guards funcionan en cada navegación

---

## ❓ Preguntas de Comprensión

1. **¿Cuál es la diferencia entre `loadComponent` y `loadChildren`?**

2. **¿Por qué los guards funcionales son mejores que las clases?**

3. **¿Cómo maneja Angular la inyección de dependencias en guards?**

4. **¿Qué ventajas tiene usar `provideRouter` vs RouterModule?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Breadcrumbs
Implementa breadcrumbs dinámicos:
- Muestra la ruta actual
- Permite navegación hacia atrás
- Personaliza títulos por ruta

### Desafío 2: Route Data
Usa data en rutas para:
- Títulos de página dinámicos
- Metadatos para SEO
- Configuración específica por ruta

### Desafío 3: Route Resolvers
Crea resolvers funcionales para:
- Pre-cargar datos antes de mostrar componente
- Manejar estados de loading
- Error handling elegante

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la configuración de routing standalone
- [ ] Puedo implementar lazy loading con loadComponent
- [ ] Domino los guards funcionales y su inyección
- [ ] Comprendo el manejo de rutas hijas y layouts
- [ ] Sé estructurar aplicaciones multi-página modernas

---

## 🏁 Conclusión

**Recuerda:**
- provideRouter = Configuración simple sin NgModules
- loadComponent = Lazy loading granular y eficiente
- Guards funcionales = Type safety + inject() moderno
- Layout components = Estructura escalable para SPAs

**Has completado:** ¡La base completa de Angular 20 standalone!
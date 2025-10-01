# 🎯 Ejercicios Prácticos - Sesión 1: Fundamentos Modernos de Angular 20

## 📋 Instrucciones Generales

En esta sesión aplicarás los fundamentos modernos de Angular 20 completando el código del Campus Virtual ESO. Los archivos con extensión `.TODO.ts` contienen TODOs que debes completar.

### 🔄 Flujo de Trabajo

1. **Revisa los archivos originales** (sin extensión `.TODO`) como referencia y solución completa
2. **Renombra manualmente** los archivos `.TODO` para activar el modo práctica:
   - `login.component.TODO.ts` → `login.component.ts` (reemplaza el original)
   - `auth.service.TODO.ts` → `auth.service.ts` (reemplaza el original)
   - `dashboard.component.SESION1.TODO.ts` → `dashboard.component.ts` (reemplaza el original)
   - `app.routes.TODO.ts` → `app.routes.ts` (reemplaza el original)
   - `auth.guard.TODO.ts` → `auth.guard.ts` (reemplaza el original)
3. **Completa los TODOs** en los archivos renombrados siguiendo las instrucciones
4. **Verifica** que la aplicación compila y funciona correctamente

💡 **Tip:** Guarda una copia de los archivos originales en otra carpeta antes de renombrar si quieres mantener la referencia.

### 🔧 Archivos de Trabajo

Los siguientes archivos contienen TODOs para completar:

1. **login.component.TODO.ts** - Componente standalone y control flow
2. **auth.service.TODO.ts** - Signals básicos para estado
3. **dashboard.component.SESION1.TODO.ts** - Componente standalone con @if
4. **app.routes.TODO.ts** - Routing moderno con loadComponent
5. **auth.guard.TODO.ts** - Guards funcionales con inject()

---

## 🚀 Ejercicio 1: Componente Standalone de Login

**Archivo:** `src/app/features/auth/login.component.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Convertir componentes a arquitectura standalone
- Usar control flow moderno (@if/@else)
- Implementar inject() para inyección de dependencias
- Crear computed signals

### 📝 TODOs a Completar

#### 1.1 Configurar Componente Standalone (Línea 9)

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  // ...
})
```

**Concepto:** `standalone: true` elimina la necesidad de NgModules. Los imports se declaran directamente en el componente.

#### 1.2 Migrar @if en Validación de Email (Línea 28)

**Antes:**
```html
<span class="error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
  Email es requerido
</span>
```

**Después:**
```html
@if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
  <span class="error">Email es requerido</span>
}
```

#### 1.3 Migrar @if en Validación de Password (Línea 43)

```html
@if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
  <span class="error">Contraseña es requerida</span>
}
```

#### 1.4 Migrar @if/@else en Botón Submit (Línea 53)

**Antes:**
```html
<span *ngIf="authService.isLoading(); else notLoading">
  Iniciando sesión...
</span>
<ng-template #notLoading>
  Iniciar Sesión
</ng-template>
```

**Después:**
```html
@if (authService.isLoading()) {
  Iniciando sesión...
} @else {
  Iniciar Sesión
}
```

**Ventaja:** Sintaxis más limpia, sin necesidad de ng-template.

#### 1.5 Usar inject() para Dependencias (Línea 197)

**Antes (constructor injection):**
```typescript
constructor(public authService: AuthService, private fb: FormBuilder) {
  this.loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });
}
```

**Después (inject function):**
```typescript
private authService = inject(AuthService);
private fb = inject(FormBuilder);

loginForm = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required]],
});
```

**Ventaja:** Menos boilerplate, no necesita constructor.

#### 1.6 Implementar Computed Signal (Línea 209)

```typescript
canSubmit = computed(() =>
  this.loginForm.valid && !this.authService.isLoading()
);
```

**Concepto:** `computed()` crea un signal derivado que se recalcula automáticamente cuando cambian sus dependencias.

### ✅ Resultado Esperado

- Componente standalone funcional sin NgModules
- Control flow moderno (@if/@else)
- Inyección de dependencias con inject()
- Computed signal para lógica del botón

---

## 📊 Ejercicio 2: AuthService con Signals Básicos

**Archivo:** `src/app/core/services/auth.service.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Crear signals privados para estado
- Exponer computed signals readonly
- Usar set() para actualizar signals
- Entender reactividad básica

### 📝 TODOs a Completar

#### 2.1 Crear Signal para currentUser (Línea 13)

```typescript
import { signal, computed } from '@angular/core';

private _currentUser = signal<User | null>(null);
```

**Concepto:** Signals son contenedores reactivos de valores que notifican cambios automáticamente.

#### 2.2 Crear Signal para isLoading (Línea 17)

```typescript
private _isLoading = signal<boolean>(false);
```

#### 2.3 Exponer currentUser como Computed (Línea 21)

```typescript
readonly currentUser = computed(() => this._currentUser());
```

**Concepto:** Exponer como computed readonly previene modificaciones externas.

#### 2.4 Exponer isAuthenticated como Computed (Línea 26)

```typescript
readonly isAuthenticated = computed(() => !!this._currentUser());
```

#### 2.5 Exponer isLoading como Computed (Línea 31)

```typescript
readonly isLoading = computed(() => this._isLoading());
```

#### 2.6 Actualizar Signals en login() (Líneas 60, 70, 76)

```typescript
login(credentials: LoginCredentials): boolean {
  this._isLoading.set(true);

  setTimeout(() => {
    const user = this.mockUsers.find(u => u.email === credentials.email);

    if (user && credentials.password === 'password123') {
      this._currentUser.set(user);
      localStorage.setItem('campus_user', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
    }

    this._isLoading.set(false);
  }, 1000);

  return true;
}
```

**Concepto:** `set()` actualiza el valor del signal y notifica a todos los dependientes.

#### 2.7 Actualizar Signal en logout() (Línea 89)

```typescript
logout(): void {
  this._currentUser.set(null);
  localStorage.removeItem('campus_user');
  this.router.navigate(['/login']);
}
```

#### 2.8 Actualizar Signal en loadUserFromStorage() (Línea 102)

```typescript
private loadUserFromStorage(): void {
  const userData = localStorage.getItem('campus_user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      this._currentUser.set(user);
    } catch {
      localStorage.removeItem('campus_user');
    }
  }
}
```

### ✅ Resultado Esperado

- Servicio completamente reactivo con signals
- Estado inmutable y predecible
- Computed signals para valores derivados
- Actualizaciones con set()

---

## 🎨 Ejercicio 3: Dashboard con Control Flow Moderno

**Archivo:** `src/app/features/dashboard/dashboard.component.SESION1.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Configurar componentes standalone
- Migrar *ngIf a @if
- Usar signals en templates
- Implementar computed signals

### 📝 TODOs a Completar

#### 3.1 Configurar Standalone (Línea 7)

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  // ...
})
```

#### 3.2 Migrar Vista de Estudiante a @if (Línea 27)

**Antes:**
```html
<div class="role-section" *ngIf="currentUser()?.role === UserRole.STUDENT">
  <!-- contenido -->
</div>
```

**Después:**
```html
@if (currentUser()?.role === UserRole.STUDENT) {
  <div class="role-section">
    <h2>📚 Panel del Estudiante</h2>
    <div class="cards">
      <!-- cards -->
    </div>
  </div>
}
```

#### 3.3 Migrar Vista de Profesor a @if (Línea 41)

```html
@if (currentUser()?.role === UserRole.TEACHER) {
  <div class="role-section">
    <h2>👨‍🏫 Panel del Profesor</h2>
    <!-- contenido -->
  </div>
}
```

#### 3.4 Migrar Vista de Admin a @if (Línea 55)

```html
@if (currentUser()?.role === UserRole.ADMIN) {
  <div class="role-section">
    <h2>👨‍💼 Panel Administrativo</h2>
    <!-- contenido -->
  </div>
}
```

#### 3.5 Usar inject() o Exponer AuthService (Línea 242)

**Opción A (inject):**
```typescript
private authService = inject(AuthService);
currentUser = this.authService.currentUser;
```

**Opción B (constructor público):**
```typescript
constructor(public authService: AuthService) {}
```

#### 3.6 Implementar roleDisplayName como Computed (Línea 251)

```typescript
roleDisplayName = computed(() => {
  const user = this.currentUser();
  if (!user?.role) return 'Usuario';

  const roleNames: Record<UserRole, string> = {
    [UserRole.STUDENT]: 'Estudiante',
    [UserRole.TEACHER]: 'Profesor',
    [UserRole.ADMIN]: 'Administrador'
  };

  return roleNames[user.role as UserRole] || 'Usuario';
});
```

### ✅ Resultado Esperado

- Dashboard standalone funcional
- Control flow moderno con @if
- Vistas dinámicas según rol de usuario
- Computed signal para nombre de rol

---

## 🛣️ Ejercicio 4: Routing Moderno con loadComponent

**Archivo:** `src/app/app.routes.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Configurar lazy loading con loadComponent
- Usar guards funcionales en rutas
- Entender routing sin RouterModule

### 📝 TODOs a Completar

#### 4.1 Ruta de Login con Lazy Loading (Línea 21)

```typescript
{
  path: "login",
  loadComponent: () =>
    import("./features/auth/login.component").then((c) => c.LoginComponent),
  canActivate: [loginGuard],
}
```

**Concepto:** `loadComponent` carga el componente bajo demanda, reduciendo el bundle inicial.

#### 4.2 Ruta de Dashboard con Lazy Loading (Línea 31)

```typescript
{
  path: "dashboard",
  loadComponent: () =>
    import("./features/dashboard/dashboard.component").then(
      (c) => c.DashboardComponent
    ),
  canActivate: [authGuard],
}
```

### 💡 Ventajas del Routing Moderno

1. **loadComponent vs loadChildren**
   - Más granular (nivel de componente)
   - Sin necesidad de NgModules
   - Bundles más pequeños

2. **Guards Funcionales**
   - Más simples que guards de clase
   - Usan inject() directamente
   - Mejor tree-shaking

3. **Sin RouterModule**
   - No necesitas RouterModule.forRoot()
   - Configuración en main.ts con provideRouter()

### ✅ Resultado Esperado

- Routing configurado con lazy loading
- Guards aplicados correctamente
- Navegación funcional entre rutas

---

## 🔒 Ejercicio 5: Guards Funcionales

**Archivo:** `src/app/core/guards/auth.guard.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Crear guards funcionales con CanActivateFn
- Usar inject() para obtener servicios
- Implementar lógica de redirección

### 📝 TODOs a Completar

#### 5.1 Implementar authGuard (Línea 12)

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(["/login"]);
  return false;
};
```

**Concepto:** Guards funcionales son más simples que guards de clase. Usan `inject()` para obtener dependencias.

#### 5.2 Implementar loginGuard (Línea 29)

```typescript
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(["/dashboard"]);
  return false;
};
```

**Lógica:** Previene acceso al login si ya está autenticado, redirigiendo al dashboard.

### 💡 Ventajas de Guards Funcionales

1. **Simplicidad**: No necesitan clases ni implements
2. **inject()**: Inyección de dependencias fuera de constructores
3. **Composabilidad**: Fáciles de combinar y testear
4. **Tree-shaking**: Mejor eliminación de código no usado

### ✅ Resultado Esperado

- authGuard protege rutas privadas
- loginGuard previene acceso a login si ya está autenticado
- Navegación fluida con redirecciones automáticas

---

## 📊 Conceptos Clave de la Sesión 1

### 🏗️ Standalone Components

| Aspecto | NgModules | Standalone |
|---------|-----------|------------|
| Setup | Requiere NgModule | `standalone: true` |
| Imports | En NgModule | En componente |
| Boilerplate | Alto | Mínimo |
| Tree-shaking | Limitado | Optimizado |

### 🔄 Control Flow Moderno

| Directiva Tradicional | Nuevo Control Flow |
|----------------------|-------------------|
| *ngIf | @if { } |
| *ngIf; else | @if { } @else { } |
| *ngFor | @for (item of items; track item.id) { } |
| *ngSwitch | @switch (value) { @case ('a') { } } |

### 📡 Signals Básicos

```typescript
// Crear signal
const count = signal(0);

// Leer signal
console.log(count());  // 0

// Actualizar signal
count.set(5);

// Computed signal
const double = computed(() => count() * 2);
console.log(double());  // 10
```

### 💉 Inyección Moderna

**Antes:**
```typescript
constructor(private service: MyService) {}
```

**Ahora:**
```typescript
private service = inject(MyService);
```

---

## 🧪 Verificación de Resultados

### ✅ Checklist de Funcionalidad

- [ ] La aplicación compila sin errores
- [ ] Login muestra validaciones correctamente
- [ ] Botones demo funcionan (estudiante, profesor, admin)
- [ ] Dashboard muestra contenido según rol
- [ ] Logout redirige a login
- [ ] Guards protegen rutas correctamente
- [ ] Lazy loading funciona (verificar en DevTools Network)

### 🔍 Comprobaciones Técnicas

1. **Standalone Components**
   - Verificar `standalone: true` en todos los componentes
   - Imports declarados en cada componente

2. **Control Flow Moderno**
   - No quedan *ngIf, *ngFor en templates
   - Se usa @if, @for correctamente

3. **Signals**
   - Estado reactivo con signals
   - Computed signals para valores derivados
   - UI se actualiza automáticamente

4. **Routing**
   - loadComponent en rutas
   - Guards funcionales aplicados
   - Navegación fluida

---

## 🎓 Comandos Útiles

```bash
# Compilar y servir
ng serve

# Verificar compilación
ng build

# Ver tamaño de bundles
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Verificar lazy loading en DevTools
# Network tab -> filtrar por "component"
```

---

## 📚 Recursos Adicionales

### 📖 Documentación Oficial
- [Standalone Components](https://angular.dev/guide/standalone-components)
- [New Control Flow](https://angular.dev/guide/templates/control-flow)
- [Signals Guide](https://angular.dev/guide/signals)
- [Functional Guards](https://angular.dev/guide/router#functional-guards)

### 🎯 Próxima Sesión

En la Sesión 2 profundizaremos en:
- **Reactividad Avanzada** con Signals
- **Change Detection** con OnPush
- **Computed Signals** complejos
- **Effects** para side effects

---

## ✅ Checklist de Entrega

- [ ] login.component.TODO.ts completado
- [ ] auth.service.TODO.ts completado
- [ ] dashboard.component.SESION1.TODO.ts completado
- [ ] app.routes.TODO.ts completado
- [ ] auth.guard.TODO.ts completado
- [ ] Aplicación compila sin errores
- [ ] Login funciona correctamente
- [ ] Dashboard muestra contenido según rol
- [ ] Guards protegen rutas correctamente

---

**🎯 Tiempo estimado:** 2-3 horas
**🏆 Nivel:** Principiante-Intermedio
**📚 Sesión:** 1 - Fundamentos Modernos de Angular 20

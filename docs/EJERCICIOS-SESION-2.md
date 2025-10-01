# 🎯 Ejercicios Prácticos - Sesión 2: Reactividad Avanzada

## 📋 Instrucciones Generales

En esta sesión aplicarás los conceptos aprendidos completando el código del Campus Virtual ESO. Los archivos con extensión `.TODO.ts` y `.TODO.html` contienen TODOs que debes completar.

### 🔄 Flujo de Trabajo

1. **Revisa los archivos originales** (sin extensión `.TODO`) como referencia y solución completa
2. **Renombra manualmente** los archivos `.TODO` para activar el modo práctica:
   - `dashboard.component.TODO.ts` → `dashboard.component.ts` (reemplaza el original)
   - `dashboard.component.TODO.html` → `dashboard.component.html` (reemplaza el original)
   - `notification.service.TODO.ts` → `notification.service.ts` (reemplaza el original)
   - `has-role.directive.TODO.ts` → `has-role.directive.ts` (reemplaza el original)
3. **Completa los TODOs** en los archivos renombrados siguiendo las instrucciones
4. **Verifica** que la aplicación compila y funciona correctamente

💡 **Tip:** Guarda una copia de los archivos originales en otra carpeta antes de renombrar si quieres mantener la referencia.

### 🔧 Archivos de Trabajo

Los siguientes archivos contienen TODOs para completar:

1. **dashboard.component.TODO.ts** - Optimización con OnPush y Signals
2. **notification.service.TODO.ts** - Servicio reactivo de notificaciones
3. **has-role.directive.TODO.ts** - Directiva estructural reactiva
4. **dashboard.component.TODO.html** - Migración a control flow moderno

---

## 🚀 Ejercicio 1: Dashboard con OnPush y Computed Signals

**Archivo:** `src/app/features/dashboard/dashboard.component.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Implementar estrategia OnPush para optimizar rendimiento
- Convertir estado a Signals
- Crear Computed Signals reactivos
- Exponer readonly signals al template

### 📝 TODOs a Completar

#### 1.1 Configurar OnPush (Línea 34)
```typescript
// TODO: Implementar estrategia OnPush para optimizar el rendimiento
changeDetection: ChangeDetectionStrategy.OnPush
```

**Concepto:** OnPush reduce los ciclos de detección de cambios. El componente solo se re-renderiza cuando:
- Cambian los inputs
- Se disparan eventos del template
- Cambian signals utilizados en el template

#### 1.2 Convertir _recentActivities a Signal (Línea 42)
```typescript
// TODO: Convertir _recentActivities a signal
private readonly _recentActivities = signal<RecentActivity[]>([]);
```

**Concepto:** Los signals son la nueva forma reactiva de manejar estado en Angular 20.

#### 1.3 Convertir _currentTime a Signal (Línea 46)
```typescript
// TODO: Convertir _currentTime a signal para reactividad
private readonly _currentTime = signal(new Date());
```

#### 1.4 Exponer Signals como Readonly (Líneas 50-58)
```typescript
// TODO: Exponer recentActivities como readonly signal
readonly recentActivities = this._recentActivities.asReadonly();

// TODO: Exponer currentTime como readonly signal
readonly currentTime = this._currentTime.asReadonly();
```

**Concepto:** `asReadonly()` previene modificaciones accidentales desde fuera del servicio/componente.

#### 1.5 Implementar dashboardCards Computed (Línea 61)
```typescript
readonly dashboardCards = computed(() => {
  const role = this.userRole();

  switch (role) {
    case UserRole.STUDENT:
      return [
        {
          title: 'Mis Asignaturas',
          description: 'Ver todas mis asignaturas',
          icon: '📚',
          route: '/subjects',
          color: 'blue',
          count: 6
        },
        // ... más cards
      ];

    case UserRole.TEACHER:
      return [
        {
          title: 'Mis Clases',
          description: 'Gestionar mis clases',
          icon: '🏫',
          route: '/classes',
          color: 'blue',
          count: 4
        },
        // ... más cards
      ];

    case UserRole.ADMIN:
      return [
        {
          title: 'Usuarios',
          description: 'Gestionar usuarios',
          icon: '👤',
          route: '/admin/users',
          color: 'blue',
          count: 450
        },
        // ... más cards
      ];

    default:
      return [];
  }
});
```

**Concepto:** Los computed signals se recalculan automáticamente cuando cambian sus dependencias (en este caso `userRole()`).

#### 1.6 Implementar welcomeMessage Computed (Línea 72)
```typescript
readonly welcomeMessage = computed(() => {
  const user = this.currentUser();
  const time = this.currentTime();
  const hour = time.getHours();

  let greeting = '';
  if (hour < 12) greeting = 'Buenos días';
  else if (hour < 18) greeting = 'Buenas tardes';
  else greeting = 'Buenas noches';

  return `${greeting}, ${user?.name || 'Usuario'}`;
});
```

#### 1.7 Implementar roleDisplayName Computed (Línea 79)
```typescript
readonly roleDisplayName = computed(() => {
  const role = this.userRole();
  switch (role) {
    case UserRole.STUDENT: return 'Estudiante';
    case UserRole.TEACHER: return 'Profesor/a';
    case UserRole.ADMIN: return 'Administrador/a';
    default: return 'Usuario';
  }
});
```

#### 1.8 Actualizar Reloj con Signal (Línea 90)
```typescript
// TODO: Actualizar el reloj usando signals
this._currentTime.set(new Date());
setInterval(() => {
  this._currentTime.set(new Date());
}, 60000);
```

#### 1.9 Actualizar loadRecentActivities (Línea 154)
```typescript
// TODO: Actualizar usando signal en lugar de asignación directa
this._recentActivities.set(mockActivities);
```

### ✅ Resultado Esperado

- Dashboard con OnPush funcional
- Estado reactivo con Signals
- Computed signals optimizados
- Reducción significativa en renders

---

## 🔔 Ejercicio 2: Servicio de Notificaciones Reactivo

**Archivo:** `src/app/core/services/notification.service.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Crear signals privados para estado
- Implementar computed signals para métricas
- Usar update() para modificaciones inmutables
- Exponer API pública con readonly signals

### 📝 TODOs a Completar

#### 2.1 Crear Signal de Notificaciones (Línea 20)
```typescript
// TODO: Crear signal privado para almacenar notificaciones
private readonly _notifications = signal<Notification[]>([]);
```

#### 2.2 Exponer Readonly Signal (Línea 24)
```typescript
// TODO: Exponer notifications como readonly signal
readonly notifications = this._notifications.asReadonly();
```

#### 2.3 Implementar unreadCount Computed (Línea 28)
```typescript
// TODO: Implementar unreadCount como computed signal
readonly unreadCount = computed(() =>
  this._notifications().filter(n => !n.read).length
);
```

#### 2.4 Implementar hasUnread Computed (Línea 34)
```typescript
// TODO: Implementar hasUnread como computed signal
readonly hasUnread = computed(() => this.unreadCount() > 0);
```

#### 2.5 Implementar recentNotifications Computed (Línea 39)
```typescript
// TODO: Implementar recentNotifications como computed signal
readonly recentNotifications = computed(() =>
  this._notifications().slice(0, 5)
);
```

#### 2.6 Implementar notificationsByType Computed (Línea 44)
```typescript
// TODO: Implementar notificationsByType como computed signal
readonly notificationsByType = computed(() => {
  const notifications = this._notifications();
  return {
    info: notifications.filter(n => n.type === 'info').length,
    success: notifications.filter(n => n.type === 'success').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    error: notifications.filter(n => n.type === 'error').length
  };
});
```

#### 2.7 Usar update() en add() (Línea 73)
```typescript
// TODO: Usar update() para agregar la notificación de forma inmutable
this._notifications.update(notifications =>
  [newNotification, ...notifications].slice(0, 50)
);
```

**Concepto:** `update()` es la forma recomendada para modificaciones basadas en el valor anterior.

#### 2.8 Usar update() en markAsRead() (Línea 125)
```typescript
// TODO: Usar update() con map para marcar como leída de forma inmutable
this._notifications.update(notifications =>
  notifications.map(n => n.id === id ? { ...n, read: true } : n)
);
```

#### 2.9 Usar update() en markAllAsRead() (Línea 136)
```typescript
// TODO: Usar update() con map para marcar todas como leídas
this._notifications.update(notifications =>
  notifications.map(n => ({ ...n, read: true }))
);
```

#### 2.10 Usar update() en remove() (Línea 145)
```typescript
// TODO: Usar update() con filter para remover de forma inmutable
this._notifications.update(notifications =>
  notifications.filter(n => n.id !== id)
);
```

#### 2.11 Usar set() en clear() (Línea 154)
```typescript
// TODO: Usar set() para limpiar el array
this._notifications.set([]);
```

**Concepto:** `set()` se usa para reemplazar completamente el valor del signal.

#### 2.12 Usar update() en clearRead() (Línea 162)
```typescript
// TODO: Usar update() con filter para mantener solo las no leídas
this._notifications.update(notifications =>
  notifications.filter(n => !n.read)
);
```

#### 2.13 Acceder al Signal en getById() (Línea 171)
```typescript
// TODO: Acceder al signal usando ()
return this._notifications().find(n => n.id === id);
```

**Concepto:** Para leer el valor de un signal, se usa la sintaxis de función: `signal()`.

### ✅ Resultado Esperado

- Servicio completamente reactivo
- Métricas automáticas con computed signals
- Actualizaciones inmutables
- API pública type-safe

---

## 🎨 Ejercicio 3: Directiva HasRole Reactiva

**Archivo:** `src/app/shared/directives/has-role.directive.TODO.ts`

### 🎯 Objetivos de Aprendizaje

- Crear directivas estructurales personalizadas
- Usar effect() para reactividad
- Manipular ViewContainer dinámicamente
- Implementar injection en constructor

### 📝 TODOs a Completar

#### 3.1 Inyectar Dependencias (Líneas 33-40)
```typescript
// TODO: Inyectar AuthService
private readonly authService = inject(AuthService);

// TODO: Inyectar TemplateRef para acceder al template
private readonly templateRef = inject(TemplateRef);

// TODO: Inyectar ViewContainerRef para manipular la vista
private readonly viewContainer = inject(ViewContainerRef);
```

**Concepto:** `inject()` es la forma moderna de inyección de dependencias en Angular.

#### 3.2 Implementar Effect en Constructor (Línea 45)
```typescript
constructor() {
  // TODO: Implementar effect reactivo que llame a updateView()
  effect(() => {
    this.updateView();
  });
}
```

**Concepto:** Los effects se ejecutan automáticamente cuando cambian los signals de los que dependen. Deben crearse en un injection context (constructor, campo de clase, etc.).

#### 3.3 Normalizar Input (Línea 51)
```typescript
@Input()
set appHasRole(roles: UserRole | UserRole[]) {
  // TODO: Normalizar entrada a array
  this.allowedRoles = Array.isArray(roles) ? roles : [roles];

  // TODO: Actualizar vista inmediatamente
  this.updateView();
}
```

#### 3.4 Implementar updateView() (Línea 60)
```typescript
private updateView(): void {
  // TODO: Obtener el rol actual del usuario desde el signal
  const currentUserRole = this.authService.userRole();

  // TODO: Verificar si el usuario tiene alguno de los roles permitidos
  const hasPermission = currentUserRole !== null &&
                       this.allowedRoles.includes(currentUserRole);

  if (hasPermission) {
    // Mostrar el elemento si tiene permisos
    if (this.viewContainer.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  } else {
    // Ocultar el elemento si no tiene permisos
    this.viewContainer.clear();
  }
}
```

**Concepto:** ViewContainer permite crear/destruir vistas dinámicamente en el DOM.

### ✅ Resultado Esperado

- Directiva estructural funcional
- Reactividad automática a cambios de rol
- Optimización para evitar re-creaciones innecesarias

### 💡 Uso en Templates

```html
<!-- Solo para administradores -->
<div *appHasRole="UserRole.ADMIN">
  <h2>Panel de Administración</h2>
</div>

<!-- Para múltiples roles -->
<button *appHasRole="[UserRole.ADMIN, UserRole.TEACHER]">
  Crear Asignatura
</button>

<!-- Solo para estudiantes -->
<section *appHasRole="UserRole.STUDENT">
  <h3>Mis Tareas</h3>
</section>
```

---

## 🔄 Ejercicio 4: Control Flow Moderno

**Archivo:** `src/app/features/dashboard/dashboard.component.TODO.html`

### 🎯 Objetivos de Aprendizaje

- Migrar de *ngIf a @if
- Migrar de *ngFor a @for con track obligatorio
- Usar @empty para estados vacíos
- Comprender las ventajas de performance

### 📝 TODOs a Completar

#### 4.1 Migrar *ngIf a @if (Línea 27)
**Antes:**
```html
<section class="quick-stats" *ngIf="userRole() === 'admin' || userRole() === 'teacher'">
  <!-- contenido -->
</section>
```

**Después:**
```html
@if (userRole() === 'admin' || userRole() === 'teacher') {
  <section class="quick-stats">
    <!-- contenido -->
  </section>
}
```

**Ventajas:**
- Sintaxis más clara y legible
- Mejor tree-shaking
- Menos overhead de directivas

#### 4.2 Migrar *ngFor a @for (Línea 71)
**Antes:**
```html
<div
  *ngFor="let card of dashboardCards(); trackBy: trackByTitle"
  class="dashboard-card"
>
  <!-- contenido -->
</div>
```

**Después:**
```html
@for (card of dashboardCards(); track card.title) {
  <div class="dashboard-card">
    <!-- contenido -->
  </div>
}
```

**Concepto:** `track` es obligatorio en @for para optimizar el rendering. Usa una expresión única (id, title, etc.).

#### 4.3 Migrar *ngIf Anidado (Línea 81)
**Antes:**
```html
<span class="card-count" *ngIf="card.count">{{ card.count }}</span>
```

**Después:**
```html
@if (card.count) {
  <span class="card-count">{{ card.count }}</span>
}
```

#### 4.4 Migrar *ngFor con @empty (Línea 96)
**Antes:**
```html
<div *ngFor="let activity of recentActivities(); trackBy: trackById">
  <!-- contenido -->
</div>

<div class="no-activities" *ngIf="recentActivities().length === 0">
  <p>No hay actividades</p>
</div>
```

**Después:**
```html
@for (activity of recentActivities(); track activity.id) {
  <div class="activity-item">
    <!-- contenido -->
  </div>
} @empty {
  <div class="no-activities">
    <span class="empty-icon">📭</span>
    <p>No hay actividades recientes</p>
  </div>
}
```

**Concepto:** `@empty` es un bloque especial que se muestra cuando la lista está vacía, eliminando la necesidad de un *ngIf separado.

### ✅ Resultado Esperado

- Templates migrados a sintaxis moderna
- Mejor rendimiento en listas grandes
- Código más limpio y mantenible
- Reducción en bundle size (~30%)

---

## 📊 Verificación de Resultados

### 🧪 Comprobaciones Manuales

1. **Dashboard se carga correctamente** con OnPush
2. **Notificaciones aparecen** y se pueden marcar como leídas
3. **Directiva HasRole** oculta/muestra elementos según el rol
4. **Control flow moderno** funciona correctamente
5. **Reloj se actualiza** cada minuto

### 🎯 Métricas de Rendimiento

Antes de entregar, verifica que:

- ✅ No hay errores en consola
- ✅ El dashboard se renderiza en < 2 segundos
- ✅ Los computed signals no se recalculan innecesariamente
- ✅ Las notificaciones se auto-cierran según su tipo

---

## 💡 Conceptos Clave Aplicados

### Signals vs Variables Tradicionales

| Característica | Variables | Signals |
|---------------|-----------|---------|
| Reactividad | Manual | Automática |
| Detección de cambios | Zona.js | Sin Zone.js |
| Rendimiento | Menor | Mayor |
| Type safety | Básico | Completo |
| Composición | Limitada | Computed signals |

### OnPush vs Default

| Aspecto | Default | OnPush |
|---------|---------|--------|
| Re-renders | Cada ciclo CD | Solo cuando cambian inputs/signals |
| Rendimiento | Bajo | Alto |
| Complejidad | Baja | Media |
| Recomendado para | Prototipos | Producción |

### Control Flow: Antes vs Después

| Feature | *ngIf/*ngFor | @if/@for |
|---------|-------------|----------|
| Bundle size | Mayor | Menor (30%) |
| Tree-shaking | Limitado | Optimizado |
| Sintaxis | Directivas | Lenguaje nativo |
| Type safety | Bueno | Mejor |
| @empty | No | Sí |

---

## 🎓 Recursos Adicionales

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Change Detection OnPush](https://angular.dev/guide/change-detection)
- [Control Flow Syntax](https://angular.dev/guide/templates/control-flow)
- [Structural Directives](https://angular.dev/guide/directives/structural-directives)

---

## ✅ Checklist de Entrega

- [ ] dashboard.component.TODO.ts completado
- [ ] notification.service.TODO.ts completado
- [ ] has-role.directive.TODO.ts completado
- [ ] dashboard.component.TODO.html completado
- [ ] Todos los archivos compilan sin errores
- [ ] La aplicación funciona correctamente
- [ ] Se aplica OnPush en el dashboard
- [ ] Todos los signals son readonly donde corresponde
- [ ] Control flow moderno aplicado en templates

---

**🎯 Tiempo estimado:** 3 horas
**🏆 Nivel:** Intermedio-Avanzado
**📚 Sesión:** 2 - Reactividad Avanzada con Angular 20

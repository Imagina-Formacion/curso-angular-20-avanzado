# 📋 Snippets VS Code - Sesión 2: Reactividad Avanzada

## 📋 Instalación

1. **Copiar el archivo de snippets:**
   ```bash
   cp sesion-02-snippets.code-snippets ~/.vscode/snippets/
   ```

2. **O instalar via VS Code:**
   - `Ctrl/Cmd + Shift + P`
   - Buscar "Preferences: Configure User Snippets"
   - Seleccionar "TypeScript"
   - Pegar el contenido del archivo

## 🎯 Snippets Disponibles

### 🔧 Componentes Optimizados

#### `ng-onpush-signals`
**Descripción:** Componente OnPush con Signals optimizado
**Genera:** Componente standalone con ChangeDetectionStrategy.OnPush y estructura de signals

```typescript
// Resultado del snippet
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ComponentNameComponent {
  private readonly _title = signal('Default Title');
  readonly title = this._title.asReadonly();
  // ...
}
```

### 🛡️ Directivas Avanzadas

#### `ng-has-role-directive`
**Descripción:** Directiva estructural para control de roles
**Genera:** Directiva reactiva con effect() en constructor

```typescript
// Uso en template
<button *appHasRole="['admin', 'teacher']">
  Solo administradores y profesores
</button>
```

### 🔔 Servicios Reactivos

#### `ng-notification-service`
**Descripción:** Servicio de notificaciones completo con Signals
**Genera:** Servicio con métodos CRUD y computed signals

```typescript
// Uso en componente
this.notificationService.success('Éxito', 'Operación completada');
```

### 🎨 Control Flow Moderno

#### `ng-if-modern`
**Descripción:** Sintaxis @if/@else moderna

```html
@if (condition) {
  <!-- Contenido verdadero -->
} @else {
  <!-- Contenido falso -->
}
```

#### `ng-for-modern`
**Descripción:** Sintaxis @for/@empty moderna

```html
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>No hay elementos</div>
}
```

#### `ng-switch-modern`
**Descripción:** Sintaxis @switch/@case/@default moderna

```html
@switch (status) {
  @case ('active') {
    🟢 Activo
  }
  @default {
    ❌ Inactivo
  }
}
```

### 📊 Signals Avanzados

#### `ng-signal-computed`
**Descripción:** Signal privado con computed y método de actualización

```typescript
private readonly _data = signal<Type>(initialValue);
readonly data = this._data.asReadonly();
readonly computed = computed(() => this.data() * 2);
```

#### `ng-effect-cleanup`
**Descripción:** Effect con lógica de cleanup

```typescript
constructor() {
  effect(() => {
    // Lógica reactiva
    return () => {
      // Cleanup
    };
  });
}
```

### 🎯 Patrones Específicos

#### `ng-dashboard-card`
**Descripción:** Cards reactivas para dashboard

```typescript
readonly cards = computed(() => {
  const role = this.userRole();
  switch (role) {
    case UserRole.STUDENT:
      return [/* cards específicas */];
  }
});
```

#### `ng-reactive-form-signals`
**Descripción:** Formulario reactivo completo con Signals

```typescript
private readonly _formData = signal<FormType>({});
readonly isValid = computed(() => /* validación */);
```

## 🚀 Casos de Uso

### 1. **Crear Componente Optimizado**
```
ng-onpush-signals → Componente base con OnPush + Signals
```

### 2. **Implementar Control de Permisos**
```
ng-has-role-directive → Directiva *appHasRole
```

### 3. **Sistema de Notificaciones**
```
ng-notification-service → Servicio completo
```

### 4. **Migrar Templates**
```
ng-if-modern → @if/@else
ng-for-modern → @for/@empty
ng-switch-modern → @switch/@case
```

### 5. **Formularios Reactivos**
```
ng-reactive-form-signals → Form con validación
```

## 📝 Tips de Uso

1. **Tab Navigation:** Usa `Tab` para navegar entre placeholders
2. **Variables Relacionadas:** Los snippets mantienen consistencia en nombres
3. **Imports Automáticos:** Algunos snippets incluyen imports necesarios
4. **Comentarios Útiles:** Cada snippet incluye comentarios explicativos

## 🔄 Workflow Recomendado

1. **Crear componente:** `ng-onpush-signals`
2. **Agregar signals:** `ng-signal-computed`
3. **Implementar effects:** `ng-effect-cleanup`
4. **Migrar templates:** `ng-*-modern`
5. **Agregar directivas:** `ng-has-role-directive`

## 📚 Relación con Ejercicios

- **Ejercicio 1 (OnPush):** `ng-onpush-signals`
- **Ejercicio 2 (Directivas):** `ng-has-role-directive`
- **Ejercicio 3 (Notificaciones):** `ng-notification-service`
- **Ejercicio 4 (Control Flow):** `ng-*-modern`

¡Estos snippets acelerarán significativamente el desarrollo con las nuevas funcionalidades de Angular 20! 🚀
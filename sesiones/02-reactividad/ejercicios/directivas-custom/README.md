# 🎨 Ejercicio: Directivas Custom con Signals

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Crear directivas estructurales y de atributo personalizadas
- Integrar Signals con directivas para reactividad
- Implementar effects en directivas con cleanup
- Aplicar directivas para funcionalidades transversales

## ⏱️ Duración: 45 minutos

---

## 📚 Parte 1: Conceptos Fundamentales (10 min)

### 🤔 ¿Qué vamos a construir?
Un conjunto de directivas avanzadas que demuestran:
- **Directiva Estructural**: Control de permisos reactivo
- **Directiva de Atributo**: Auto-focus inteligente
- **Directiva Host**: Detector de clicks externos
- **Directiva de Estado**: Loading states dinámicos

### 🎯 ¿Por qué son importantes las directivas?
- Reutilización de lógica entre componentes
- Separación de responsabilidades
- Encapsulación de comportamientos complejos
- Cross-cutting concerns (permisos, tracking, etc.)

---

## 🛠️ Parte 2: Hands-On - Construcción Progresiva (30 min)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular
ng new directivas-signals-demo --standalone --style=scss --routing=false
cd directivas-signals-demo

# 3. Copiar snippets del curso
# Descargar: https://github.com/tu-repo/curso-angular-20-avanzado
# Copiar: .vscode/snippets/ al proyecto
```

#### **Opción B: Local dentro del ejercicio**
```bash
# Desde la carpeta del ejercicio: sesiones/02-reactividad/ejercicios/directivas-custom/
ng new directivas-signals-demo --standalone --style=scss --routing=false
cd directivas-signals-demo
# Los snippets del curso ya están disponibles automáticamente
```

#### **Opción C: CodeSandbox (Sin snippets)**
```bash
# Crear nuevo proyecto Angular Standalone
# Copiar código manualmente desde este README
```

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-directive`**: Directiva standalone base
- **`ng20-signals`**: Signals reactivos básicos
- **`ng20-effect`**: Effects para directivas reactivas
- **`ng20-computed`**: Computed signals
- **`ng20-inject`**: Inyección de dependencias

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 🔒 Paso 2: Directiva de Permisos (Estructural)

**Archivo:** `src/app/directives/has-permission.directive.ts`

```typescript
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  DestroyRef
} from '@angular/core';

// Simulamos un servicio de permisos
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly _userPermissions = signal<string[]>(['read', 'write']);
  private readonly _userRole = signal<'admin' | 'user' | 'guest'>('user');

  readonly userPermissions = this._userPermissions.asReadonly();
  readonly userRole = this._userRole.asReadonly();

  // Simulamos cambio de rol para testing
  changeRole(role: 'admin' | 'user' | 'guest'): void {
    this._userRole.set(role);

    // Permisos según rol
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage'],
      user: ['read', 'write'],
      guest: ['read']
    };

    this._userPermissions.set(permissions[role]);
  }

  hasPermission(permission: string): boolean {
    return this._userPermissions().includes(permission);
  }
}

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private readonly permissionService = inject(PermissionService);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private requiredPermission = '';

  constructor() {
    // 🎯 Effect que reacciona a cambios de permisos
    effect(() => {
      this.updateView();
    });
  }

  @Input()
  set appHasPermission(permission: string) {
    this.requiredPermission = permission;
    this.updateView();
  }

  private updateView(): void {
    const hasPermission = this.permissionService.hasPermission(this.requiredPermission);

    if (hasPermission) {
      // ✅ Mostrar contenido si tiene permiso
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      // ❌ Ocultar contenido si no tiene permiso
      this.viewContainer.clear();
    }

    console.log(`🔒 Permiso '${this.requiredPermission}': ${hasPermission ? '✅' : '❌'}`);
  }
}
```

**🤔 Pregunta para reflexionar:** ¿Por qué usamos effect() en el constructor en lugar de ngOnInit?

### 🎯 Paso 3: Directiva Auto-Focus (Atributo)

**Archivo:** `src/app/directives/auto-focus.directive.ts`

```typescript
import {
  Directive,
  ElementRef,
  Input,
  inject,
  effect,
  signal
} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective {
  private readonly element = inject(ElementRef<HTMLElement>);

  // 🎯 Signal para controlar el focus
  private readonly _shouldFocus = signal(false);
  private readonly _delay = signal(0);

  constructor() {
    // Effect que maneja el focus automático
    effect(() => {
      if (this._shouldFocus()) {
        this.performFocus();
      }
    });
  }

  @Input()
  set appAutoFocus(condition: boolean | '') {
    // Tratar string vacío como true (uso sin valor)
    this._shouldFocus.set(condition === '' ? true : !!condition);
  }

  @Input()
  set autoFocusDelay(delay: number) {
    this._delay.set(delay);
  }

  private performFocus(): void {
    const delay = this._delay();

    if (delay > 0) {
      setTimeout(() => this.focusElement(), delay);
    } else {
      // Usar requestAnimationFrame para el próximo ciclo de render
      requestAnimationFrame(() => this.focusElement());
    }
  }

  private focusElement(): void {
    const element = this.element.nativeElement;

    if (element && typeof element.focus === 'function') {
      element.focus();
      console.log(`🎯 Auto-focus aplicado a: ${element.tagName}`);

      // Si es un input, seleccionar todo el contenido
      if (element instanceof HTMLInputElement && element.value) {
        element.select();
      }
    }
  }
}
```

**💡 Ejercicio:** ¿Qué pasaría si no usáramos requestAnimationFrame?

### 👆 Paso 4: Directiva Click Outside (Host)

**Archivo:** `src/app/directives/click-outside.directive.ts`

```typescript
import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  inject,
  effect,
  signal,
  DestroyRef
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
  host: {
    // 🎯 Host binding para manejar eventos del documento
    '(document:click)': 'onDocumentClick($event)',
    '(document:touchstart)': 'onDocumentClick($event)'
  }
})
export class ClickOutsideDirective {
  private readonly element = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  @Output() clickOutside = new EventEmitter<Event>();

  // 🎯 Signal para tracking de clics
  private readonly _clickCount = signal(0);

  constructor() {
    // Effect para debug/metrics
    effect(() => {
      const count = this._clickCount();
      if (count > 0) {
        console.log(`👆 Clicks fuera detectados: ${count}`);
      }
    });
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const elementRef = this.element.nativeElement;

    // Verificar si el click fue fuera del elemento
    if (elementRef && !elementRef.contains(target)) {
      this._clickCount.update(count => count + 1);
      this.clickOutside.emit(event);
    }
  }
}
```

### ⏳ Paso 5: Directiva Loading State (Compleja)

**Archivo:** `src/app/directives/loading-state.directive.ts`

```typescript
import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  inject,
  effect,
  signal,
  computed,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Directive({
  selector: '[appLoadingState]',
  standalone: true
})
export class LoadingStateDirective {
  private readonly element = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  // 🎯 Signals para el estado
  private readonly _state = signal<LoadingState>('idle');
  private readonly _message = signal('');
  private readonly _showSpinner = signal(true);

  // 🧮 Computed para clases CSS
  private readonly cssClasses = computed(() => {
    const state = this._state();
    return {
      'loading-idle': state === 'idle',
      'loading-active': state === 'loading',
      'loading-success': state === 'success',
      'loading-error': state === 'error'
    };
  });

  constructor() {
    // Effect para aplicar estilos
    effect(() => {
      this.updateElementClasses();
      this.updateElementContent();
    });
  }

  @Input()
  set appLoadingState(state: LoadingState) {
    this._state.set(state);
  }

  @Input()
  set loadingMessage(message: string) {
    this._message.set(message);
  }

  @Input()
  set showSpinner(show: boolean) {
    this._showSpinner.set(show);
  }

  private updateElementClasses(): void {
    const classes = this.cssClasses();
    const element = this.element.nativeElement;

    // Limpiar clases anteriores
    Object.keys(classes).forEach(className => {
      this.renderer.removeClass(element, className);
    });

    // Aplicar clases activas
    Object.entries(classes).forEach(([className, isActive]) => {
      if (isActive) {
        this.renderer.addClass(element, className);
      }
    });
  }

  private updateElementContent(): void {
    const state = this._state();
    const message = this._message();
    const showSpinner = this._showSpinner();

    if (state === 'loading') {
      this.showLoadingIndicator(message, showSpinner);
    } else {
      this.hideLoadingIndicator();
    }
  }

  private showLoadingIndicator(message: string, showSpinner: boolean): void {
    const element = this.element.nativeElement;

    // Crear overlay de loading
    const overlay = this.renderer.createElement('div');
    this.renderer.addClass(overlay, 'loading-overlay');

    if (showSpinner) {
      const spinner = this.renderer.createElement('div');
      this.renderer.addClass(spinner, 'loading-spinner');
      this.renderer.appendChild(overlay, spinner);
    }

    if (message) {
      const text = this.renderer.createText(message);
      this.renderer.appendChild(overlay, text);
    }

    this.renderer.appendChild(element, overlay);
    this.renderer.setStyle(element, 'position', 'relative');
  }

  private hideLoadingIndicator(): void {
    const element = this.element.nativeElement;
    const overlay = element.querySelector('.loading-overlay');

    if (overlay) {
      this.renderer.removeChild(element, overlay);
    }
  }
}
```

### 🎮 Paso 6: Componente Demo Integrado

**Archivo:** `src/app/components/directives-demo/directives-demo.component.ts`

```typescript
@Component({
  selector: 'app-directives-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HasPermissionDirective,
    AutoFocusDirective,
    ClickOutsideDirective,
    LoadingStateDirective
  ],
  template: `
    <div class="demo-container">
      <h1>🎨 Directivas Custom con Signals</h1>

      <!-- Control de Permisos -->
      <section class="demo-section">
        <h2>🔒 Directiva de Permisos</h2>

        <div class="role-selector">
          <label>Cambiar rol:</label>
          <select (change)="changeRole($event)" [value]="currentRole()">
            <option value="guest">👤 Guest</option>
            <option value="user">👨‍💼 User</option>
            <option value="admin">👑 Admin</option>
          </select>
        </div>

        <div class="permission-demos">
          <!-- Solo para lectura -->
          <div *appHasPermission="'read'" class="permission-card read">
            ✅ Contenido de solo lectura (todos pueden ver)
          </div>

          <!-- Solo para escritura -->
          <div *appHasPermission="'write'" class="permission-card write">
            ✏️ Contenido para escritura (user y admin)
          </div>

          <!-- Solo para eliminación -->
          <div *appHasPermission="'delete'" class="permission-card delete">
            🗑️ Contenido de eliminación (solo admin)
          </div>

          <!-- Solo para administración -->
          <div *appHasPermission="'manage'" class="permission-card manage">
            ⚙️ Panel de administración (solo admin)
          </div>
        </div>

        <div class="current-permissions">
          <strong>Permisos actuales:</strong>
          {{ permissions().join(', ') }}
        </div>
      </section>

      <!-- Auto Focus -->
      <section class="demo-section">
        <h2>🎯 Directiva Auto-Focus</h2>

        <div class="focus-controls">
          <button (click)="toggleFocusDemo()">
            {{ focusEnabled() ? 'Deshabilitar' : 'Habilitar' }} Auto-Focus
          </button>
        </div>

        <div class="focus-inputs">
          <input
            type="text"
            placeholder="Input normal"
            class="demo-input">

          <input
            type="text"
            placeholder="Input con auto-focus inmediato"
            [appAutoFocus]="focusEnabled()"
            class="demo-input">

          <input
            type="text"
            placeholder="Input con auto-focus retardado (1s)"
            [appAutoFocus]="focusEnabled()"
            [autoFocusDelay]="1000"
            class="demo-input">
        </div>
      </section>

      <!-- Click Outside -->
      <section class="demo-section">
        <h2>👆 Directiva Click Outside</h2>

        <div class="click-outside-demo">
          <div
            class="dropdown-menu"
            [class.open]="dropdownOpen()"
            appClickOutside
            (clickOutside)="closeDropdown()">

            <button (click)="toggleDropdown()" class="dropdown-trigger">
              {{ dropdownOpen() ? '🔽' : '▶️' }} Menú Dropdown
            </button>

            <div class="dropdown-content" *ngIf="dropdownOpen()">
              <div class="dropdown-item">📄 Opción 1</div>
              <div class="dropdown-item">📊 Opción 2</div>
              <div class="dropdown-item">⚙️ Configuración</div>
            </div>
          </div>

          <p class="instruction">
            👆 Haz click fuera del dropdown para cerrarlo
          </p>
        </div>
      </section>

      <!-- Loading State -->
      <section class="demo-section">
        <h2>⏳ Directiva Loading State</h2>

        <div class="loading-controls">
          <button (click)="simulateLoading()">🔄 Simular Carga</button>
          <button (click)="simulateSuccess()">✅ Simular Éxito</button>
          <button (click)="simulateError()">❌ Simular Error</button>
          <button (click)="resetLoading()">🔄 Reset</button>
        </div>

        <div
          class="loading-demo-card"
          [appLoadingState]="loadingState()"
          [loadingMessage]="loadingMessage()"
          [showSpinner]="true">

          <h3>Contenido de Ejemplo</h3>
          <p>Este contenido se muestra cuando no está cargando.</p>

          @switch (loadingState()) {
            @case ('success') {
              <div class="success-message">✅ ¡Operación completada con éxito!</div>
            }
            @case ('error') {
              <div class="error-message">❌ Error en la operación</div>
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .demo-section {
      margin-bottom: 40px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .permission-card {
      padding: 15px;
      margin: 10px 0;
      border-radius: 6px;
      font-weight: 500;
    }

    .permission-card.read { background: #d4edda; border-left: 4px solid #28a745; }
    .permission-card.write { background: #fff3cd; border-left: 4px solid #ffc107; }
    .permission-card.delete { background: #f8d7da; border-left: 4px solid #dc3545; }
    .permission-card.manage { background: #d6d8db; border-left: 4px solid #6c757d; }

    .demo-input {
      display: block;
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 2px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.3s;
    }

    .demo-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
    }

    .dropdown-menu {
      position: relative;
      display: inline-block;
    }

    .dropdown-content {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-width: 200px;
      z-index: 1000;
    }

    .dropdown-item {
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .loading-demo-card {
      min-height: 150px;
      padding: 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .loading-demo-card.loading-active {
      opacity: 0.7;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success-message {
      color: #28a745;
      font-weight: 500;
    }

    .error-message {
      color: #dc3545;
      font-weight: 500;
    }
  `]
})
export class DirectivesDemoComponent {
  readonly permissionService = inject(PermissionService);

  // 🎯 Signals para el estado del demo
  readonly currentRole = this.permissionService.userRole;
  readonly permissions = this.permissionService.userPermissions;
  readonly focusEnabled = signal(true);
  readonly dropdownOpen = signal(false);
  readonly loadingState = signal<LoadingState>('idle');
  readonly loadingMessage = signal('');

  // Métodos para controlar permisos
  changeRole(event: any): void {
    const role = event.target.value as 'admin' | 'user' | 'guest';
    this.permissionService.changeRole(role);
  }

  // Métodos para auto-focus
  toggleFocusDemo(): void {
    this.focusEnabled.update(enabled => !enabled);
  }

  // Métodos para click outside
  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
    console.log('🔽 Dropdown cerrado por click outside');
  }

  // Métodos para loading state
  simulateLoading(): void {
    this.loadingState.set('loading');
    this.loadingMessage.set('Cargando datos...');

    setTimeout(() => {
      this.loadingState.set('success');
      this.loadingMessage.set('');
    }, 2000);
  }

  simulateSuccess(): void {
    this.loadingState.set('success');
  }

  simulateError(): void {
    this.loadingState.set('error');
  }

  resetLoading(): void {
    this.loadingState.set('idle');
    this.loadingMessage.set('');
  }
}
```

---

## 🧪 Parte 3: Experimentación Práctica (5 min)

### 🔬 Experimento 1: Permisos Reactivos
1. **Cambia el rol** entre guest → user → admin
2. **Observa** qué contenido aparece/desaparece
3. **Resultado:** La directiva reacciona automáticamente a los cambios

### 🔬 Experimento 2: Auto-Focus Inteligente
1. **Activa/desactiva** el auto-focus
2. **Prueba** con inputs retardados
3. **Resultado:** Focus preciso sin conflictos

### 🔬 Experimento 3: Click Outside
1. **Abre el dropdown** y haz click fuera
2. **Observa** cómo se cierra automáticamente
3. **Resultado:** UX mejorada sin JavaScript adicional

### 🔬 Experimento 4: Loading States
1. **Simula** diferentes estados de carga
2. **Observa** transiciones suaves
3. **Resultado:** Feedback visual consistente

---

## ❓ Preguntas de Comprensión

1. **¿Cuál es la diferencia entre directiva estructural y de atributo?**
   - Estructural: Modifica el DOM (agrega/quita elementos)
   - Atributo: Modifica comportamiento o apariencia

2. **¿Por qué usar effect() en directivas?**
   - Para reaccionar automáticamente a cambios de Signals
   - Cleanup automático al destruir la directiva

3. **¿Cuándo usar Host bindings?**
   - Para manejar eventos del documento o elementos padre
   - Para aplicar clases CSS dinámicamente

4. **¿Qué ventajas tienen las directivas con Signals?**
   - Reactividad automática sin subscripciones manuales
   - Mejor rendimiento con updates granulares

---

## 🎯 Desafíos Adicionales

### Desafío 1: Directiva de Validación
Crea una directiva que:
- Valide inputs en tiempo real
- Muestre mensajes de error
- Use Signals para el estado

### Desafío 2: Directiva de Tooltip
Implementa tooltips que:
- Se posicionen automáticamente
- Tengan animaciones suaves
- Sean accesibles (ARIA)

### Desafío 3: Directiva de Infinite Scroll
Crea scroll infinito que:
- Detecte cuándo cargar más datos
- Use Intersection Observer
- Tenga throttling inteligente

---

## 📚 Recursos de Consulta

- [Angular Directives Guide](https://angular.dev/guide/directives)
- [Creating Custom Directives](https://angular.dev/guide/directives/creating-custom)
- [Signals in Directives](https://angular.dev/guide/signals#signals-in-directives)

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la diferencia entre tipos de directivas
- [ ] Sé crear directivas estructurales con ViewContainer
- [ ] Puedo integrar Signals con directivas
- [ ] Comprendo el uso de effects en directivas
- [ ] Domino Host bindings y decorators

---

## 🏁 Conclusión

**Recuerda:**
- Directivas = Reutilización de lógica
- Signals + Directivas = Reactividad poderosa
- Effects en constructor para injection context
- Host bindings para eventos globales

**Próximo paso:** Aplicar directivas en el sistema de messaging
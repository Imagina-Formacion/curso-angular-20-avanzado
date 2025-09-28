# 🎯 Ejercicio: Directivas Custom Reactivas

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Crear directivas estructurales modernas con signals
- Integrar effects en directivas para reactividad
- Desarrollar directivas reutilizables para UI
- Optimizar performance en directivas custom

## ⏱️ Duración: 45 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Qué son las Directivas Custom?
Las Directivas Custom en Angular 20 son:
- **Componentes sin template** que modifican el DOM
- **Reutilizables** a través de toda la aplicación
- **Reactivas** con signals para máxima performance
- **Type-safe** con TypeScript avanzado

### 🎯 Tipos de Directivas
1. **Attribute Directives**: Modifican apariencia/comportamiento
2. **Structural Directives**: Modifican estructura del DOM
3. **Component Directives**: Combination de ambas

### 📖 Nuevas Capacidades con Signals

```typescript
// 🔄 Directiva reactiva con signals
@Directive({
  selector: '[appSmart]'
})
export class SmartDirective {
  private state = signal(false);

  constructor() {
    // 🚀 Effect para reactividad automática
    effect(() => {
      console.log('State changed:', this.state());
    });
  }
}
```

---

## 🛠️ Parte 2: Hands-On - Directivas Reactivas (30 min)

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-directive`**: Directiva básica con signals
- **`ng20-structural-directive`**: Directiva estructural moderna
- **`ng20-attribute-directive`**: Directiva de atributo reactiva

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone
ng new directives-demo --standalone --style=scss --routing=false
cd directives-demo

# 3. Instalar dependencias
npm install
```

### 🎯 Paso 2: Has Permission Directive (Structural)

**Archivo:** `src/app/directives/has-permission.directive.ts`

```typescript
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  signal,
  effect,
  computed
} from '@angular/core';

export type UserRole = 'admin' | 'user' | 'guest' | 'moderator';
export type Permission = 'read' | 'write' | 'delete' | 'admin';

// 🧮 Mock service para permisos
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  // 📊 Signals para estado del usuario
  private _currentUser = signal<{
    role: UserRole;
    permissions: Permission[];
  } | null>(null);

  private _isLoading = signal(false);

  // 🔗 Readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // 🧮 Computed signals
  readonly isAdmin = computed(() =>
    this._currentUser()?.role === 'admin'
  );

  readonly userPermissions = computed(() =>
    this._currentUser()?.permissions || []
  );

  constructor() {
    // 🚀 Simular carga inicial del usuario
    this.loadCurrentUser();
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission) || this.isAdmin();
  }

  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this._currentUser()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  // 🔄 Métodos para cambiar usuario (demo)
  setUser(role: UserRole, permissions: Permission[]): void {
    this._currentUser.set({ role, permissions });
  }

  logout(): void {
    this._currentUser.set(null);
  }

  private loadCurrentUser(): void {
    this._isLoading.set(true);

    // Simular carga async
    setTimeout(() => {
      this._currentUser.set({
        role: 'user',
        permissions: ['read', 'write']
      });
      this._isLoading.set(false);
    }, 1000);
  }
}

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);

  // 📊 Signal para el estado de visibilidad
  private _isVisible = signal(false);

  // 🔗 Inputs como signals
  private _requiredPermission = signal<Permission | null>(null);
  private _requiredRole = signal<UserRole | null>(null);
  private _requiredAnyRoles = signal<UserRole[]>([]);

  @Input() set appHasPermission(permission: Permission) {
    this._requiredPermission.set(permission);
  }

  @Input() set appHasPermissionRole(role: UserRole) {
    this._requiredRole.set(role);
  }

  @Input() set appHasPermissionAnyRoles(roles: UserRole[]) {
    this._requiredAnyRoles.set(roles);
  }

  // 🧮 Computed para determinar si debe mostrar contenido
  private shouldShow = computed(() => {
    const user = this.permissionService.currentUser();
    if (!user) return false;

    const permission = this._requiredPermission();
    const role = this._requiredRole();
    const anyRoles = this._requiredAnyRoles();

    // Check permission
    if (permission && !this.permissionService.hasPermission(permission)) {
      return false;
    }

    // Check specific role
    if (role && !this.permissionService.hasRole(role)) {
      return false;
    }

    // Check any of the roles
    if (anyRoles.length > 0 && !this.permissionService.hasAnyRole(anyRoles)) {
      return false;
    }

    return true;
  });

  constructor() {
    // 🔄 Effect para manejar visibilidad reactiva
    effect(() => {
      const shouldShow = this.shouldShow();
      const currentlyVisible = this._isVisible();

      if (shouldShow && !currentlyVisible) {
        // Mostrar contenido
        this.viewContainer.createEmbeddedView(this.templateRef);
        this._isVisible.set(true);
      } else if (!shouldShow && currentlyVisible) {
        // Ocultar contenido
        this.viewContainer.clear();
        this._isVisible.set(false);
      }
    });

    // 🔄 Effect para logging (debugging)
    effect(() => {
      console.log('🔐 Permission check:', {
        requiredPermission: this._requiredPermission(),
        requiredRole: this._requiredRole(),
        requiredAnyRoles: this._requiredAnyRoles(),
        shouldShow: this.shouldShow(),
        user: this.permissionService.currentUser()
      });
    });
  }
}
```

### ✨ Paso 3: Smart Loading Directive (Attribute)

**Archivo:** `src/app/directives/smart-loading.directive.ts`

```typescript
import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  inject,
  signal,
  effect,
  computed
} from '@angular/core';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Directive({
  selector: '[appSmartLoading]',
  standalone: true
})
export class SmartLoadingDirective {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  // 📊 Signals para estado
  private _loadingState = signal<LoadingState>('idle');
  private _loadingText = signal('Loading...');
  private _showSpinner = signal(true);
  private _disableElement = signal(true);

  // 🧮 Computed signals
  private isLoading = computed(() => this._loadingState() === 'loading');
  private isSuccess = computed(() => this._loadingState() === 'success');
  private isError = computed(() => this._loadingState() === 'error');

  // 📝 Original element state
  private originalText: string = '';
  private originalDisabled: boolean = false;

  @Input() set appSmartLoading(state: LoadingState) {
    this._loadingState.set(state);
  }

  @Input() set appSmartLoadingText(text: string) {
    this._loadingText.set(text);
  }

  @Input() set appSmartLoadingSpinner(show: boolean) {
    this._showSpinner.set(show);
  }

  @Input() set appSmartLoadingDisable(disable: boolean) {
    this._disableElement.set(disable);
  }

  constructor() {
    // Store original state
    this.storeOriginalState();

    // 🔄 Effect para manejar estado de loading
    effect(() => {
      if (this.isLoading()) {
        this.applyLoadingState();
      } else {
        this.restoreOriginalState();
      }
    });

    // 🔄 Effect para success state
    effect(() => {
      if (this.isSuccess()) {
        this.applySuccessState();
      }
    });

    // 🔄 Effect para error state
    effect(() => {
      if (this.isError()) {
        this.applyErrorState();
      }
    });

    // 🔄 Effect para clases CSS reactivas
    effect(() => {
      const element = this.elementRef.nativeElement;

      // Remove all state classes
      this.renderer.removeClass(element, 'smart-loading');
      this.renderer.removeClass(element, 'smart-success');
      this.renderer.removeClass(element, 'smart-error');

      // Add current state class
      if (this.isLoading()) {
        this.renderer.addClass(element, 'smart-loading');
      } else if (this.isSuccess()) {
        this.renderer.addClass(element, 'smart-success');
      } else if (this.isError()) {
        this.renderer.addClass(element, 'smart-error');
      }
    });
  }

  private storeOriginalState(): void {
    const element = this.elementRef.nativeElement;
    this.originalText = element.textContent || element.value || '';
    this.originalDisabled = element.disabled || false;
  }

  private applyLoadingState(): void {
    const element = this.elementRef.nativeElement;

    // Update text with spinner if enabled
    const loadingText = this._showSpinner()
      ? `⟳ ${this._loadingText()}`
      : this._loadingText();

    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
      if (element.type === 'submit' || element.tagName === 'BUTTON') {
        element.textContent = loadingText;
      } else {
        element.placeholder = loadingText;
      }

      if (this._disableElement()) {
        element.disabled = true;
      }
    } else {
      element.textContent = loadingText;
    }

    // Add loading cursor
    this.renderer.setStyle(element, 'cursor', 'wait');
  }

  private applySuccessState(): void {
    const element = this.elementRef.nativeElement;

    if (element.tagName === 'BUTTON') {
      element.textContent = '✅ Success!';
    }

    this.renderer.setStyle(element, 'cursor', 'default');

    // Auto-restore after 2 seconds
    setTimeout(() => {
      if (this._loadingState() === 'success') {
        this._loadingState.set('idle');
      }
    }, 2000);
  }

  private applyErrorState(): void {
    const element = this.elementRef.nativeElement;

    if (element.tagName === 'BUTTON') {
      element.textContent = '❌ Error!';
    }

    this.renderer.setStyle(element, 'cursor', 'default');

    // Auto-restore after 3 seconds
    setTimeout(() => {
      if (this._loadingState() === 'error') {
        this._loadingState.set('idle');
      }
    }, 3000);
  }

  private restoreOriginalState(): void {
    const element = this.elementRef.nativeElement;

    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
      if (element.type === 'submit' || element.tagName === 'BUTTON') {
        element.textContent = this.originalText;
      } else {
        element.placeholder = '';
      }
      element.disabled = this.originalDisabled;
    } else {
      element.textContent = this.originalText;
    }

    this.renderer.setStyle(element, 'cursor', 'default');
  }
}
```

### 🎨 Paso 4: Highlight Directive (Attribute + Signals)

**Archivo:** `src/app/directives/smart-highlight.directive.ts`

```typescript
import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  inject,
  signal,
  effect,
  computed,
  HostListener
} from '@angular/core';

export interface HighlightConfig {
  normalColor: string;
  hoverColor: string;
  activeColor: string;
  textColor?: string;
  duration?: number;
}

@Directive({
  selector: '[appSmartHighlight]',
  standalone: true
})
export class SmartHighlightDirective {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  // 📊 Signals para estado
  private _isHovered = signal(false);
  private _isActive = signal(false);
  private _config = signal<HighlightConfig>({
    normalColor: 'transparent',
    hoverColor: '#f0f8ff',
    activeColor: '#007bff',
    textColor: 'inherit',
    duration: 300
  });

  // 🧮 Computed para color actual
  private currentBackgroundColor = computed(() => {
    const config = this._config();

    if (this._isActive()) {
      return config.activeColor;
    } else if (this._isHovered()) {
      return config.hoverColor;
    } else {
      return config.normalColor;
    }
  });

  private currentTextColor = computed(() => {
    const config = this._config();

    if (this._isActive()) {
      return this._isLightColor(config.activeColor) ? '#000' : '#fff';
    } else {
      return config.textColor || 'inherit';
    }
  });

  @Input() set appSmartHighlight(config: Partial<HighlightConfig>) {
    this._config.update(current => ({ ...current, ...config }));
  }

  @Input() set appSmartHighlightActive(active: boolean) {
    this._isActive.set(active);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this._isHovered.set(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this._isHovered.set(false);
  }

  constructor() {
    // 🔄 Effect para aplicar estilos reactivos
    effect(() => {
      const element = this.elementRef.nativeElement;
      const backgroundColor = this.currentBackgroundColor();
      const textColor = this.currentTextColor();
      const duration = this._config().duration;

      // Apply transition
      this.renderer.setStyle(element, 'transition', `all ${duration}ms ease-in-out`);

      // Apply colors
      this.renderer.setStyle(element, 'background-color', backgroundColor);
      this.renderer.setStyle(element, 'color', textColor);

      // Add box-shadow for active state
      if (this._isActive()) {
        this.renderer.setStyle(element, 'box-shadow', '0 0 10px rgba(0,123,255,0.5)');
      } else {
        this.renderer.removeStyle(element, 'box-shadow');
      }
    });

    // 🔄 Effect para logging state changes (debug)
    effect(() => {
      console.log('🎨 Highlight state:', {
        hovered: this._isHovered(),
        active: this._isActive(),
        backgroundColor: this.currentBackgroundColor(),
        textColor: this.currentTextColor()
      });
    });
  }

  // 🎨 Helper para determinar si un color es claro
  private _isLightColor(color: string): boolean {
    // Simple heuristic for light color detection
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    }
    return false;
  }
}
```

### 🔍 Paso 5: Click Outside Directive

**Archivo:** `src/app/directives/click-outside.directive.ts`

```typescript
import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  inject,
  signal,
  effect,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<Event>();

  private elementRef = inject(ElementRef);

  // 📊 Signals para estado
  private _isEnabled = signal(true);
  private _clickCount = signal(0);
  private _lastClickTime = signal(0);

  @Input() set appClickOutsideEnabled(enabled: boolean) {
    this._isEnabled.set(enabled);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this._isEnabled()) return;

    const target = event.target as HTMLElement;
    const element = this.elementRef.nativeElement;

    // Check if click is outside the element
    if (!element.contains(target)) {
      this._clickCount.update(count => count + 1);
      this._lastClickTime.set(Date.now());
      this.clickOutside.emit(event);
    }
  }

  constructor() {
    // 🔄 Effect para logging clicks outside (debug)
    effect(() => {
      if (this._clickCount() > 0) {
        console.log('👆 Click outside detected:', {
          clickCount: this._clickCount(),
          lastClickTime: new Date(this._lastClickTime()).toLocaleTimeString(),
          enabled: this._isEnabled()
        });
      }
    });
  }

  // 📊 Public method para obtener estadísticas
  getStats() {
    return {
      clickCount: this._clickCount(),
      lastClickTime: this._lastClickTime(),
      isEnabled: this._isEnabled()
    };
  }

  resetStats(): void {
    this._clickCount.set(0);
    this._lastClickTime.set(0);
  }
}
```

### 🧪 Paso 6: Demo Component

**Archivo:** `src/app/components/directives-demo/directives-demo.component.ts`

```typescript
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import all directives
import { HasPermissionDirective, PermissionService, UserRole, Permission } from '../../directives/has-permission.directive';
import { SmartLoadingDirective, LoadingState } from '../../directives/smart-loading.directive';
import { SmartHighlightDirective } from '../../directives/smart-highlight.directive';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-directives-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HasPermissionDirective,
    SmartLoadingDirective,
    SmartHighlightDirective,
    ClickOutsideDirective
  ],
  template: `
    <div class="directives-demo">
      <h2>🎯 Directivas Custom Reactivas - Demo</h2>

      <!-- 🔐 Permission Controls -->
      <div class="control-section">
        <h3>🔐 Permission Controls</h3>
        <div class="permission-controls">
          <div class="control-group">
            <label>Current Role:</label>
            <select (change)="changeUserRole($event)" [value]="currentRole()">
              <option value="guest">Guest</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="control-group">
            <label>Permissions:</label>
            <div class="checkbox-group">
              @for (permission of availablePermissions; track permission) {
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    [checked]="currentPermissions().includes(permission)"
                    (change)="togglePermission(permission, $event)"
                  >
                  {{ permission }}
                </label>
              }
            </div>
          </div>

          <div class="user-info">
            <strong>User Info:</strong>
            <span>Role: {{ currentUser()?.role || 'None' }}</span>
            <span>Permissions: {{ currentUser()?.permissions.join(', ') || 'None' }}</span>
          </div>
        </div>
      </div>

      <!-- 🎯 Permission Directive Demo -->
      <div class="demo-section">
        <h3>🎯 Permission-based Visibility</h3>

        <div class="permission-examples">
          <!-- Basic permission check -->
          <div class="example-card">
            <h4>Read Permission Required</h4>
            <div *appHasPermission="'read'" class="permission-content">
              📖 You can read this content!
            </div>
            <div class="permission-note">
              Visible only with 'read' permission
            </div>
          </div>

          <!-- Admin role check -->
          <div class="example-card">
            <h4>Admin Role Required</h4>
            <div *appHasPermission="'admin'" appHasPermissionRole="admin" class="permission-content admin-content">
              👑 Admin-only content here!
            </div>
            <div class="permission-note">
              Visible only for admin role
            </div>
          </div>

          <!-- Multiple roles check -->
          <div class="example-card">
            <h4>Moderator or Admin Required</h4>
            <div *appHasPermission="'write'" [appHasPermissionAnyRoles]="['moderator', 'admin']" class="permission-content">
              ⚡ Moderator/Admin content with write permission!
            </div>
            <div class="permission-note">
              Visible for moderator or admin with write permission
            </div>
          </div>

          <!-- Complex permission check -->
          <div class="example-card">
            <h4>Delete Permission Required</h4>
            <div *appHasPermission="'delete'" class="permission-content danger-content">
              🗑️ Dangerous delete operations available
            </div>
            <div class="permission-note">
              Visible only with 'delete' permission
            </div>
          </div>
        </div>
      </div>

      <!-- ⚡ Loading Directive Demo -->
      <div class="demo-section">
        <h3>⚡ Smart Loading States</h3>

        <div class="loading-controls">
          <button (click)="setLoadingState('idle')" class="btn btn-secondary">
            Idle
          </button>
          <button (click)="setLoadingState('loading')" class="btn btn-primary">
            Loading
          </button>
          <button (click)="setLoadingState('success')" class="btn btn-success">
            Success
          </button>
          <button (click)="setLoadingState('error')" class="btn btn-danger">
            Error
          </button>
        </div>

        <div class="loading-examples">
          <div class="example-card">
            <h4>Button with Loading State</h4>
            <button
              [appSmartLoading]="loadingState()"
              appSmartLoadingText="Processing..."
              class="demo-button"
              (click)="simulateAsyncOperation()"
            >
              {{ loadingState() === 'idle' ? 'Click Me' : 'Processing...' }}
            </button>
          </div>

          <div class="example-card">
            <h4>Input with Loading State</h4>
            <input
              type="text"
              [appSmartLoading]="inputLoadingState()"
              appSmartLoadingText="Validating..."
              placeholder="Type something..."
              (input)="validateInput($event)"
              class="demo-input"
            >
          </div>
        </div>
      </div>

      <!-- 🎨 Highlight Directive Demo -->
      <div class="demo-section">
        <h3>🎨 Smart Highlighting</h3>

        <div class="highlight-examples">
          <div class="example-card">
            <h4>Basic Highlight</h4>
            <div
              appSmartHighlight="{
                hoverColor: '#e3f2fd',
                activeColor: '#2196f3'
              }"
              [appSmartHighlightActive]="isHighlightActive()"
              class="highlight-demo basic-highlight"
              (click)="toggleHighlight()"
            >
              Hover me and click to toggle active state!
            </div>
            <button (click)="toggleHighlight()" class="btn btn-sm">
              Toggle Active: {{ isHighlightActive() ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="example-card">
            <h4>Custom Colors</h4>
            <div
              appSmartHighlight="{
                normalColor: '#f8f9fa',
                hoverColor: '#fff3cd',
                activeColor: '#ffc107',
                duration: 500
              }"
              class="highlight-demo custom-highlight"
            >
              Custom yellow theme with slower transition
            </div>
          </div>

          <div class="example-card">
            <h4>Card Highlight</h4>
            <div
              appSmartHighlight="{
                hoverColor: '#f0fff0',
                activeColor: '#28a745'
              }"
              [appSmartHighlightActive]="selectedCard() === 'card1'"
              class="highlight-card"
              (click)="selectCard('card1')"
            >
              <h5>Card 1</h5>
              <p>Click to select this card</p>
            </div>
            <div
              appSmartHighlight="{
                hoverColor: '#fff5f5',
                activeColor: '#dc3545'
              }"
              [appSmartHighlightActive]="selectedCard() === 'card2'"
              class="highlight-card"
              (click)="selectCard('card2')"
            >
              <h5>Card 2</h5>
              <p>Click to select this card</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 👆 Click Outside Demo -->
      <div class="demo-section">
        <h3>👆 Click Outside Detection</h3>

        <div class="click-outside-demo">
          <div class="example-card">
            <h4>Modal Simulation</h4>
            <button (click)="toggleModal()" class="btn btn-primary">
              {{ showModal() ? 'Close Modal' : 'Open Modal' }}
            </button>

            @if (showModal()) {
              <div class="modal-overlay">
                <div
                  class="modal-content"
                  appClickOutside
                  (clickOutside)="onModalClickOutside($event)"
                >
                  <h4>Modal Content</h4>
                  <p>Click outside this modal to close it</p>
                  <p>Outside clicks detected: {{ outsideClickCount() }}</p>
                  <button (click)="toggleModal()" class="btn btn-secondary">
                    Close
                  </button>
                </div>
              </div>
            }
          </div>

          <div class="example-card">
            <h4>Dropdown Simulation</h4>
            <div class="dropdown-container">
              <button (click)="toggleDropdown()" class="btn btn-outline">
                Dropdown ▼
              </button>

              @if (showDropdown()) {
                <div
                  class="dropdown-menu"
                  appClickOutside
                  [appClickOutsideEnabled]="true"
                  (clickOutside)="closeDropdown()"
                >
                  <div class="dropdown-item">Option 1</div>
                  <div class="dropdown-item">Option 2</div>
                  <div class="dropdown-item">Option 3</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- 📊 Stats Section -->
      <div class="stats-section">
        <h3>📊 Directive Statistics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Permission Checks</h4>
            <div class="stat-value">{{ permissionChecks() }}</div>
          </div>
          <div class="stat-card">
            <h4>Loading Operations</h4>
            <div class="stat-value">{{ loadingOperations() }}</div>
          </div>
          <div class="stat-card">
            <h4>Outside Clicks</h4>
            <div class="stat-value">{{ outsideClickCount() }}</div>
          </div>
          <div class="stat-card">
            <h4>Highlight Toggles</h4>
            <div class="stat-value">{{ highlightToggles() }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .directives-demo {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .control-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .permission-controls {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.9rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .demo-section {
      margin-bottom: 3rem;
    }

    .demo-section h3 {
      margin-bottom: 1.5rem;
      color: #495057;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 0.5rem;
    }

    .permission-examples,
    .loading-examples,
    .highlight-examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .example-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .example-card h4 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    .permission-content {
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #c3e6cb;
      margin-bottom: 0.5rem;
    }

    .permission-content.admin-content {
      background: #fff3cd;
      color: #856404;
      border-color: #ffeaa7;
    }

    .permission-content.danger-content {
      background: #f8d7da;
      color: #721c24;
      border-color: #f5c6cb;
    }

    .permission-note {
      font-size: 0.8rem;
      color: #6c757d;
      font-style: italic;
    }

    .loading-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
    }

    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-outline { background: white; border: 1px solid #007bff; color: #007bff; }
    .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8rem; }

    .demo-button,
    .demo-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .highlight-demo {
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      text-align: center;
      cursor: pointer;
      margin-bottom: 1rem;
    }

    .highlight-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      margin-bottom: 1rem;
    }

    .highlight-card h5 {
      margin: 0 0 0.5rem 0;
    }

    .click-outside-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
    }

    .dropdown-container {
      position: relative;
      display: inline-block;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      min-width: 150px;
      z-index: 100;
    }

    .dropdown-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid #f8f9fa;
    }

    .dropdown-item:hover {
      background: #f8f9fa;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .stats-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
      border: 1px solid #e9ecef;
    }

    .stat-card h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    /* CSS classes for loading directive */
    .smart-loading {
      opacity: 0.7;
      pointer-events: none;
    }

    .smart-success {
      background-color: #d4edda !important;
      border-color: #c3e6cb !important;
    }

    .smart-error {
      background-color: #f8d7da !important;
      border-color: #f5c6cb !important;
    }
  `]
})
export class DirectivesDemoComponent {
  // Permission service injection
  private permissionService = inject(PermissionService);

  // 📊 Signals para estado
  private _loadingState = signal<LoadingState>('idle');
  private _inputLoadingState = signal<LoadingState>('idle');
  private _isHighlightActive = signal(false);
  private _selectedCard = signal<string | null>(null);
  private _showModal = signal(false);
  private _showDropdown = signal(false);

  // 📊 Statistics signals
  private _permissionChecks = signal(0);
  private _loadingOperations = signal(0);
  private _outsideClickCount = signal(0);
  private _highlightToggles = signal(0);

  // 🔗 Readonly signals
  readonly loadingState = this._loadingState.asReadonly();
  readonly inputLoadingState = this._inputLoadingState.asReadonly();
  readonly isHighlightActive = this._isHighlightActive.asReadonly();
  readonly selectedCard = this._selectedCard.asReadonly();
  readonly showModal = this._showModal.asReadonly();
  readonly showDropdown = this._showDropdown.asReadonly();

  readonly permissionChecks = this._permissionChecks.asReadonly();
  readonly loadingOperations = this._loadingOperations.asReadonly();
  readonly outsideClickCount = this._outsideClickCount.asReadonly();
  readonly highlightToggles = this._highlightToggles.asReadonly();

  // 🧮 Computed signals for user data
  readonly currentUser = this.permissionService.currentUser;
  readonly currentRole = computed(() => this.currentUser()?.role || 'guest');
  readonly currentPermissions = computed(() => this.currentUser()?.permissions || []);

  // Data
  readonly availablePermissions: Permission[] = ['read', 'write', 'delete', 'admin'];

  constructor() {
    // 🔄 Effect para tracking permission changes
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this._permissionChecks.update(count => count + 1);
      }
    });
  }

  // 🔐 Permission methods
  changeUserRole(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const role = select.value as UserRole;
    const currentPermissions = this.currentPermissions();

    this.permissionService.setUser(role, currentPermissions);
  }

  togglePermission(permission: Permission, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentRole = this.currentRole();
    const currentPermissions = this.currentPermissions();

    if (checkbox.checked) {
      this.permissionService.setUser(currentRole, [...currentPermissions, permission]);
    } else {
      this.permissionService.setUser(
        currentRole,
        currentPermissions.filter(p => p !== permission)
      );
    }
  }

  // ⚡ Loading methods
  setLoadingState(state: LoadingState): void {
    this._loadingState.set(state);
    this._loadingOperations.update(count => count + 1);
  }

  simulateAsyncOperation(): void {
    this.setLoadingState('loading');

    setTimeout(() => {
      const success = Math.random() > 0.3;
      this.setLoadingState(success ? 'success' : 'error');
    }, 2000);
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length > 3) {
      this._inputLoadingState.set('loading');

      setTimeout(() => {
        const isValid = !value.includes('error');
        this._inputLoadingState.set(isValid ? 'success' : 'error');
      }, 1000);
    } else {
      this._inputLoadingState.set('idle');
    }
  }

  // 🎨 Highlight methods
  toggleHighlight(): void {
    this._isHighlightActive.update(active => !active);
    this._highlightToggles.update(count => count + 1);
  }

  selectCard(cardId: string): void {
    this._selectedCard.set(this._selectedCard() === cardId ? null : cardId);
  }

  // 👆 Click outside methods
  toggleModal(): void {
    this._showModal.update(show => !show);
  }

  onModalClickOutside(event: Event): void {
    this._showModal.set(false);
    this._outsideClickCount.update(count => count + 1);
  }

  toggleDropdown(): void {
    this._showDropdown.update(show => !show);
  }

  closeDropdown(): void {
    this._showDropdown.set(false);
    this._outsideClickCount.update(count => count + 1);
  }
}
```

### 🔗 Paso 7: Integrar en AppComponent

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesDemoComponent } from './components/directives-demo/directives-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DirectivesDemoComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🎯 Directivas Custom Reactivas</h1>
        <p>Desarrollando directivas modernas con Angular 20 y Signals</p>
      </header>

      <main>
        <app-directives-demo></app-directives-demo>
      </main>

      <footer class="app-footer">
        <p>Curso Angular 20 Avanzado - Imagina Formación 2025</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .app-header h1 {
      margin: 0;
      font-size: 2.5rem;
    }

    .app-header p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
    }

    main {
      flex: 1;
    }

    .app-footer {
      background: #f8f9fa;
      text-align: center;
      padding: 1rem;
      border-top: 1px solid #e9ecef;
    }
  `]
})
export class AppComponent {
  title = 'directives-demo';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Permission-based UI
1. **Cambia roles y permisos** usando los controles
2. **Observa** cómo los elementos aparecen/desaparecen reactivamente
3. **Abre la consola** para ver los logs de permission checks

### 🔬 Experimento 2: Loading States
1. **Simula operaciones async** con diferentes estados
2. **Observa** las transiciones automáticas de success/error
3. **Prueba** con inputs para validación en tiempo real

### 🔬 Experimento 3: Interactive Elements
1. **Hover sobre elementos** con highlight directive
2. **Abre/cierra modales** haciendo click outside
3. **Observa** las animaciones y transiciones suaves

---

## ❓ Preguntas de Comprensión

1. **¿Cómo mejoran los signals las directivas custom?**

2. **¿Cuándo usarías una directiva estructural vs attribute?**

3. **¿Qué ventajas tiene usar effects en directivas?**

4. **¿Cómo manejarías memory leaks en directivas complejas?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: AutoSave Directive
Crea una directiva que:
- Auto-guarde contenido de inputs después de delay
- Use signals para debouncing
- Muestre estado de guardado visual

### Desafío 2: Resize Observer Directive
Implementa una directiva que:
- Detecte cambios de tamaño del elemento
- Emita eventos con dimensiones
- Use signals para state management

### Desafío 3: Virtual Scroll Directive
Desarrolla una directiva para:
- Manejar listas grandes virtualmente
- Optimizar rendering con signals
- Incluir smooth scrolling

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo los tipos de directivas y cuándo usar cada una
- [ ] Puedo crear directivas estructurales con signals
- [ ] Sé integrar effects para reactividad automática
- [ ] Comprendo el cleanup automático de directivas
- [ ] Puedo crear directivas reutilizables y performantes

---

## 🏁 Conclusión

**Recuerda:**
- Directivas + Signals = Reactividad automática
- Effects en directivas = Cleanup automático
- Type safety = Menos bugs, mejor DX
- Reutilización = DRY principle aplicado

**Próximo paso:** Integrar todo en aplicaciones reales con arquitecturas escalables
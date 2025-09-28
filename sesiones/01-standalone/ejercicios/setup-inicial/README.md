# 🔧 Ejercicio: Setup Inicial con Standalone Components

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Entender los fundamentos de standalone components
- Crear una aplicación Angular 20 sin NgModules
- Usar el nuevo control flow (@if, @for, @switch)
- Configurar bootstrapApplication moderna

## ⏱️ Duración: 30 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Qué son los Standalone Components?
Los Standalone Components son la nueva forma de desarrollar en Angular que:
- **Eliminan NgModules** para la mayoría de casos de uso
- **Simplifican la arquitectura** con imports directos
- **Mejoran tree-shaking** automáticamente
- **Aceleran el desarrollo** con menos configuración

### 🎯 ¿Por qué son revolutionary?
- **Mental model simple**: Un componente = una responsabilidad
- **Imports explícitos**: Solo lo que necesitas, donde lo necesitas
- **Bundle optimization**: Tree-shaking perfecto out-of-the-box
- **Developer experience**: Setup más rápido, menos archivos

### 📖 Sintaxis Básica

```typescript
// ✅ Standalone Component
@Component({
  selector: 'app-welcome',
  standalone: true,  // 🚀 La magia está aquí
  imports: [CommonModule], // 📦 Imports directos
  template: `<h1>Welcome!</h1>`
})
export class WelcomeComponent { }

// ✅ Bootstrap Application
bootstrapApplication(AppComponent, {
  providers: [
    // 🔧 Providers a nivel de aplicación
  ]
});
```

---

## 🛠️ Parte 2: Hands-On - Tu Primera App Standalone (15 min)

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-standalone`**: Componente standalone básico
- **`ng20-bootstrap`**: Bootstrap application setup
- **`ng20-control-flow`**: Control flow moderno (@if, @for)

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone
ng new standalone-demo --standalone --style=scss --routing=false
cd standalone-demo

# 3. Instalar dependencias
npm install
```

#### **Opción B: CodeSandbox**
1. Ir a [codesandbox.io](https://codesandbox.io)
2. Crear nuevo proyecto Angular
3. Copiar código desde este ejercicio

### 🎯 Paso 2: Crear Welcome Component

**Archivo:** `src/app/components/welcome/welcome.component.ts`

```typescript
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="welcome-container">
      <header class="welcome-header">
        <h1>🚀 ¡Bienvenido a Angular 20!</h1>
        <p class="subtitle">Tu primera aplicación con Standalone Components</p>
      </header>

      <main class="welcome-content">
        <!-- 📝 Input para el nombre -->
        <div class="input-section">
          <label for="userName">¿Cómo te llamas?</label>
          <input
            id="userName"
            type="text"
            [(ngModel)]="userName"
            placeholder="Escribe tu nombre"
            class="name-input"
          >
        </div>

        <!-- 🎯 Saludo personalizado con control flow moderno -->
        @if (userName().trim()) {
          <div class="greeting-section">
            <h2>👋 ¡Hola {{ userName() }}!</h2>
            <p>{{ personalizedMessage() }}</p>
          </div>
        } @else {
          <div class="placeholder-section">
            <p>Escribe tu nombre para ver un saludo personalizado</p>
          </div>
        }

        <!-- 📊 Estadísticas del usuario -->
        <div class="stats-section">
          <h3>📊 Estadísticas</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">Caracteres:</span>
              <span class="stat-value">{{ characterCount() }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Palabras:</span>
              <span class="stat-value">{{ wordCount() }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Longitud:</span>
              <span class="stat-value">{{ nameLength() }}</span>
            </div>
          </div>
        </div>

        <!-- 🎨 Lista de colores favoritos -->
        <div class="colors-section">
          <h3>🎨 Colores Favoritos</h3>
          <div class="color-controls">
            <select (change)="addColor($event)" class="color-select">
              <option value="">Selecciona un color</option>
              @for (color of availableColors; track color.name) {
                <option [value]="color.name">{{ color.emoji }} {{ color.name }}</option>
              }
            </select>
            <button (click)="clearColors()" class="clear-btn">
              🧹 Limpiar
            </button>
          </div>

          <div class="colors-display">
            @if (favoriteColors().length > 0) {
              <h4>Tus colores elegidos:</h4>
              <ul class="colors-list">
                @for (color of favoriteColors(); track color; let i = $index) {
                  <li class="color-item">
                    <span class="color-emoji">{{ getColorEmoji(color) }}</span>
                    <span class="color-name">{{ color }}</span>
                    <button
                      (click)="removeColor(i)"
                      class="remove-color"
                      title="Eliminar color"
                    >
                      ❌
                    </button>
                  </li>
                }
              </ul>
            } @else {
              <p class="no-colors">No has seleccionado colores aún</p>
            }
          </div>
        </div>

        <!-- 🎯 Actividades sugeridas -->
        <div class="activities-section">
          <h3>🎯 Actividades Sugeridas</h3>
          @switch (timeOfDay()) {
            @case ('morning') {
              <div class="activity-card morning">
                <h4>🌅 Buenos días!</h4>
                <p>Es un gran momento para:</p>
                <ul>
                  <li>☕ Tomar un café</li>
                  <li>📚 Estudiar Angular</li>
                  <li>🏃‍♂️ Hacer ejercicio</li>
                </ul>
              </div>
            }
            @case ('afternoon') {
              <div class="activity-card afternoon">
                <h4>☀️ Buenas tardes!</h4>
                <p>Hora perfecta para:</p>
                <ul>
                  <li>💻 Programar</li>
                  <li>🤝 Colaborar en equipo</li>
                  <li>📞 Hacer reuniones</li>
                </ul>
              </div>
            }
            @case ('evening') {
              <div class="activity-card evening">
                <h4>🌙 Buenas noches!</h4>
                <p>Momento ideal para:</p>
                <ul>
                  <li>📖 Leer documentación</li>
                  <li>🎮 Relajarse</li>
                  <li>📝 Planificar el día siguiente</li>
                </ul>
              </div>
            }
            @default {
              <div class="activity-card default">
                <h4>🕐 ¡Cualquier momento es bueno!</h4>
                <p>Para aprender Angular 20</p>
              </div>
            }
          }
        </div>
      </main>

      <footer class="welcome-footer">
        <p>💡 Esta aplicación usa <strong>Standalone Components</strong> - sin NgModules!</p>
        <p>🎯 Desarrollado con Angular 20 y control flow moderno</p>
      </footer>
    </div>
  `,
  styles: [`
    .welcome-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .welcome-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .welcome-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }

    .welcome-content {
      background: rgba(255,255,255,0.1);
      border-radius: 15px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      margin-bottom: 2rem;
    }

    .input-section {
      margin-bottom: 2rem;
    }

    .input-section label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .name-input {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      background: rgba(255,255,255,0.9);
      color: #333;
    }

    .name-input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.5);
    }

    .greeting-section, .placeholder-section {
      background: rgba(255,255,255,0.2);
      padding: 1.5rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .greeting-section h2 {
      margin: 0 0 1rem 0;
      font-size: 2rem;
    }

    .stats-section {
      margin-bottom: 2rem;
    }

    .stats-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: rgba(255,255,255,0.2);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .colors-section, .activities-section {
      margin-bottom: 2rem;
    }

    .colors-section h3, .activities-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .color-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .color-select {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      background: rgba(255,255,255,0.9);
      color: #333;
    }

    .clear-btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 6px;
      background: rgba(220,53,69,0.8);
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    .clear-btn:hover {
      background: rgba(220,53,69,1);
    }

    .colors-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .color-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: rgba(255,255,255,0.1);
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .color-emoji {
      font-size: 1.2rem;
    }

    .color-name {
      flex: 1;
      font-weight: 500;
    }

    .remove-color {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      opacity: 0.8;
      transition: opacity 0.3s;
    }

    .remove-color:hover {
      opacity: 1;
    }

    .no-colors {
      font-style: italic;
      opacity: 0.8;
      text-align: center;
      padding: 1rem;
    }

    .activity-card {
      padding: 1.5rem;
      border-radius: 10px;
      margin-bottom: 1rem;
    }

    .activity-card.morning {
      background: linear-gradient(135deg, #ffeaa7, #fab1a0);
      color: #2d3436;
    }

    .activity-card.afternoon {
      background: linear-gradient(135deg, #fd79a8, #fdcb6e);
      color: #2d3436;
    }

    .activity-card.evening {
      background: linear-gradient(135deg, #6c5ce7, #a29bfe);
      color: white;
    }

    .activity-card.default {
      background: linear-gradient(135deg, #00b894, #00cec9);
      color: white;
    }

    .activity-card h4 {
      margin: 0 0 1rem 0;
      font-size: 1.3rem;
    }

    .activity-card ul {
      margin: 0.5rem 0 0 1rem;
    }

    .activity-card li {
      margin-bottom: 0.5rem;
    }

    .welcome-footer {
      text-align: center;
      opacity: 0.9;
    }

    .welcome-footer p {
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .welcome-container {
        margin: 1rem;
        padding: 1rem;
      }

      .welcome-content {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .color-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .color-select {
        min-width: auto;
      }
    }
  `]
})
export class WelcomeComponent {
  // 📊 Signals para gestión de estado
  private _userName = signal('');
  private _favoriteColors = signal<string[]>([]);

  // 🎨 Colores disponibles
  availableColors = [
    { name: 'Rojo', emoji: '🔴' },
    { name: 'Azul', emoji: '🔵' },
    { name: 'Verde', emoji: '🟢' },
    { name: 'Amarillo', emoji: '🟡' },
    { name: 'Naranja', emoji: '🟠' },
    { name: 'Morado', emoji: '🟣' },
    { name: 'Rosa', emoji: '🩷' },
    { name: 'Marrón', emoji: '🟤' }
  ];

  // 🔗 Getters y setters para userName
  get userName() {
    return this._userName;
  }

  set userName(value: string) {
    this._userName.set(value);
  }

  // 🔗 Getter readonly para favoriteColors
  favoriteColors = this._favoriteColors.asReadonly();

  // 🧮 Computed signals para estadísticas
  characterCount = computed(() => this._userName().length);
  wordCount = computed(() => {
    const name = this._userName().trim();
    return name ? name.split(/\s+/).length : 0;
  });
  nameLength = computed(() => {
    const length = this.characterCount();
    if (length === 0) return 'Sin nombre';
    if (length <= 3) return 'Corto';
    if (length <= 8) return 'Medio';
    return 'Largo';
  });

  // 🧮 Computed para mensaje personalizado
  personalizedMessage = computed(() => {
    const name = this._userName();
    const hour = new Date().getHours();

    let greeting = '';
    if (hour < 12) greeting = '¡Buenos días';
    else if (hour < 18) greeting = '¡Buenas tardes';
    else greeting = '¡Buenas noches';

    return `${greeting}, ${name}! Es genial verte aprendiendo Angular 20.`;
  });

  // 🧮 Computed para momento del día
  timeOfDay = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  });

  // 📝 Métodos para manejar colores
  addColor(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const color = select.value;

    if (color && !this._favoriteColors().includes(color)) {
      this._favoriteColors.update(colors => [...colors, color]);
      select.value = '';
    }
  }

  removeColor(index: number): void {
    this._favoriteColors.update(colors =>
      colors.filter((_, i) => i !== index)
    );
  }

  clearColors(): void {
    this._favoriteColors.set([]);
  }

  getColorEmoji(colorName: string): string {
    const color = this.availableColors.find(c => c.name === colorName);
    return color?.emoji || '⚪';
  }
}
```

### 🔧 Paso 3: Actualizar main.ts

**Archivo:** `src/main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// 🚀 Bootstrap moderno sin NgModules
bootstrapApplication(AppComponent, {
  providers: [
    // 🔧 Aquí irían los providers globales
    // provideRouter(routes),
    // provideHttpClient(),
    // etc.
  ]
}).catch(err => console.error(err));
```

### 🏠 Paso 4: Actualizar AppComponent

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './components/welcome/welcome.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeComponent
  ],
  template: `
    <div class="app-container">
      <app-welcome></app-welcome>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(45deg, #1e3c72, #2a5298);
      padding: 1rem;
    }
  `]
})
export class AppComponent {
  title = 'standalone-demo';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Bundle Analysis
Ejecuta tu aplicación y observa:
1. **Network tab**: Tamaño de bundles cargados
2. **Console**: Ausencia de NgModule warnings
3. **Performance**: Tiempo de carga inicial

### 🔬 Experimento 2: Control Flow Moderno
Experimenta con el nuevo control flow:
- Cambia tu nombre para ver `@if/@else`
- Agrega colores para ver `@for` en acción
- Cambia la hora del sistema para ver `@switch`

### 🔬 Experimento 3: Imports Directos
Nota cómo cada componente declara exactamente lo que necesita:
- `CommonModule` para directives básicas
- `FormsModule` para ngModel
- Sin imports innecesarios

---

## ❓ Preguntas de Comprensión

1. **¿Cuál es la principal diferencia entre standalone y NgModule?**

2. **¿Por qué el bundle size es mejor con standalone?**

3. **¿Qué ventaja tiene el nuevo control flow (@if, @for, @switch)?**

4. **¿Cómo se manejan los providers en aplicaciones standalone?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Crear un Contador
Añade a la aplicación:
- Un contador con botones +/-
- Historial de cambios
- Computed para estadísticas

### Desafío 2: Lista de Tareas
Implementa:
- Input para agregar tareas
- Lista con @for
- Toggle completed con @if

### Desafío 3: Tema Dinámico
Crea:
- Selector de tema (claro/oscuro)
- CSS variables reactivas
- Persistencia en localStorage

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo qué son los standalone components
- [ ] Puedo crear componentes sin NgModules
- [ ] Domino el nuevo control flow (@if, @for, @switch)
- [ ] Sé configurar bootstrapApplication
- [ ] Comprendo las ventajas de bundle optimization

---

## 🏁 Conclusión

**Recuerda:**
- Standalone = Simplicidad + Performance
- Control flow moderno = Menos código + Mejor readability
- Imports directos = Tree-shaking perfecto
- bootstrapApplication = Setup sin complicaciones

**Próximo paso:** Comunicación avanzada entre standalone components
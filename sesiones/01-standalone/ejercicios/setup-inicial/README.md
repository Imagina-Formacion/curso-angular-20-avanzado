# 🚀 Ejercicio: Setup Inicial con Standalone Components

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Crear una aplicación Angular 20 con Standalone Components
- Configurar el entorno de desarrollo optimizado
- Entender las diferencias entre NgModules y Standalone
- Implementar el primer componente standalone

## ⏱️ Duración: 30 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Qué son los Standalone Components?
Los Standalone Components son una nueva forma de crear componentes en Angular que:
- **No necesitan NgModules** para funcionar
- **Se importan directamente** donde se necesitan
- **Simplifican la arquitectura** eliminando boilerplate
- **Mejoran el tree-shaking** y reducen el bundle size

### 🎯 ¿Por qué son importantes?
- **Menos código**: Sin necesidad de declarar en módulos
- **Más flexibilidad**: Importaciones dinámicas más fáciles
- **Mejor performance**: Tree-shaking más efectivo
- **DX mejorado**: Desarrollo más intuitivo

---

## 🛠️ Parte 2: Hands-On - Setup Paso a Paso (15 min)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone
ng new my-standalone-app --standalone --style=scss --routing=false
cd my-standalone-app

# 3. Copiar snippets del curso
# Descargar: https://github.com/tu-repo/curso-angular-20-avanzado
# Copiar: .vscode/snippets/ al proyecto
```

#### **Opción B: Local dentro del ejercicio**
```bash
# Desde la carpeta del ejercicio: sesiones/01-standalone/ejercicios/setup-inicial/
ng new my-standalone-app --standalone --style=scss --routing=false
cd my-standalone-app
# Los snippets del curso ya están disponibles automáticamente
```

#### **Opción C: CodeSandbox (Sin snippets)**
```bash
# Crear nuevo proyecto Angular Standalone
# Copiar código manualmente desde este README
```

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-standalone`**: Componente standalone base
- **`ng20-bootstrap`**: Bootstrap de aplicación standalone
- **`ng20-import`**: Importación de dependencias
- **`ng20-config`**: Configuración inicial

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 🎯 Paso 2: Analizar la Estructura Generada

**Archivo:** `src/main.ts`

```typescript
// 🎯 Punto de entrada de la aplicación standalone
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// 🚀 Bootstrap directo del componente, sin módulos
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

**💡 Diferencia clave:** En lugar de `platformBrowserDynamic().bootstrapModule(AppModule)`, usamos `bootstrapApplication(AppComponent)`

**Archivo:** `src/app/app.config.ts`

```typescript
// 🎯 Configuración centralizada de la aplicación
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    // 📦 Aquí agregarás más providers según necesites
  ]
};
```

**💡 Pregunta:** ¿Qué ventaja tiene tener la configuración separada del componente?

### 🔧 Paso 3: Crear tu Primer Componente Standalone

**Archivo:** `src/app/components/welcome/welcome.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true, // 🎯 Esta línea hace que sea standalone
  imports: [CommonModule], // 📦 Importamos solo lo que necesitamos
  template: `
    <div class="welcome-container">
      <h1>¡Bienvenido a Angular 20 Standalone!</h1>

      <div class="info-cards">
        <div class="card">
          <h3>🚀 Sin NgModules</h3>
          <p>Este componente no necesita ser declarado en ningún módulo</p>
        </div>

        <div class="card">
          <h3>📦 Importaciones Directas</h3>
          <p>Solo importamos {{ requiredImports }} que necesitamos</p>
        </div>

        <div class="card">
          <h3>⚡ Tree-shaking Optimizado</h3>
          <p>Bundles más pequeños automáticamente</p>
        </div>
      </div>

      <button (click)="showMessage()" class="action-btn">
        Mostrar Mensaje
      </button>

      @if (showWelcomeMessage) {
        <div class="success-message">
          🎉 ¡Has creado tu primer componente standalone!
        </div>
      }
    </div>
  `,
  styles: [`
    .welcome-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
      text-align: center;
      color: #1976d2;
      margin-bottom: 2rem;
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }

    .card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card h3 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    .action-btn {
      display: block;
      margin: 2rem auto;
      padding: 12px 24px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .action-btn:hover {
      background: #218838;
    }

    .success-message {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class WelcomeComponent {
  requiredImports = 'CommonModule';
  showWelcomeMessage = false;

  showMessage(): void {
    this.showWelcomeMessage = true;

    // Auto-hide después de 3 segundos
    setTimeout(() => {
      this.showWelcomeMessage = false;
    }, 3000);
  }
}
```

### 🔗 Paso 4: Integrar en AppComponent

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 📦 Importamos nuestro componente directamente
import { WelcomeComponent } from './components/welcome/welcome.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeComponent // 🎯 Importación directa, sin módulos
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>{{ title }}</h1>
        <p>Aplicación Angular 20 con Standalone Components</p>
      </header>

      <main>
        <app-welcome></app-welcome>
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
      background: #1976d2;
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
      padding: 1rem;
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
  title = 'Mi App Standalone';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Comparación de Bundles
1. **Ejecuta:** `npm run build`
2. **Observa:** El tamaño de los chunks generados
3. **Compara:** Con una app tradicional con módulos

### 🔬 Experimento 2: Importaciones Dinámicas
Prueba a comentar `CommonModule` del array de imports:
```typescript
imports: [
  // CommonModule  // ← Comenta esta línea
],
```

**¿Qué sucede y por qué?**

### 🔬 Experimento 3: Control Flow Moderno
Cambia el `*ngIf` por la nueva sintaxis `@if`:
```typescript
// Cambiar esto:
<div *ngIf="showWelcomeMessage">

// Por esto:
@if (showWelcomeMessage) {
  <div class="success-message">
}
```

---

## 📊 Comparación: Tradicional vs Standalone

| Aspecto | NgModules Tradicional | Standalone Components |
|---------|----------------------|----------------------|
| **Declaraciones** | En @NgModule.declarations | No necesario |
| **Importaciones** | En @NgModule.imports | En @Component.imports |
| **Bootstrap** | bootstrapModule(AppModule) | bootstrapApplication(AppComponent) |
| **Lazy Loading** | loadChildren: () => import('./module') | loadComponent: () => import('./component') |
| **Bundle Size** | Incluye todo el módulo | Solo lo importado |

---

## ❓ Preguntas de Comprensión

1. **¿Cuál es la principal diferencia entre un componente tradicional y uno standalone?**

2. **¿Por qué no necesitamos AppModule en una aplicación standalone?**

3. **¿Qué ventajas ofrece el tree-shaking automático?**

4. **¿Cuándo usarías standalone vs módulos tradicionales?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Componente de Contador
Crea un componente standalone que:
- Mantenga un estado de contador
- Tenga botones para incrementar/decrementar
- Use el control flow moderno (@if/@for)

### Desafío 2: Servicio Standalone
Implementa un servicio que:
- Se provea usando `providedIn: 'root'`
- Gestione una lista de tareas
- Sea consumido por múltiples componentes

### Desafío 3: Lazy Loading
Configura lazy loading de un componente standalone:
- Crea una ruta lazy
- Usa `loadComponent` en lugar de `loadChildren`
- Mide la diferencia en performance

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo qué son los Standalone Components
- [ ] Sé crear un proyecto Angular standalone desde cero
- [ ] Comprendo las diferencias con NgModules tradicionales
- [ ] Puedo importar dependencias directamente en componentes
- [ ] Domino el bootstrapping de aplicaciones standalone

---

## 🏁 Conclusión

**Recuerda:**
- Standalone = Menos boilerplate, más flexibilidad
- Importa solo lo que necesitas para mejor performance
- El control flow moderno (@if/@for) es más limpio
- Tree-shaking automático mejora los bundles

**Próximo paso:** Explorar componentes standalone más complejos y routing
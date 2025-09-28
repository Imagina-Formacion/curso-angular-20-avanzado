# 🛣️ Ejercicio 3: Routing Básico Standalone

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Configurar routing básico sin NgModules
- Usar `provideRouter()` en lugar de RouterModule
- Implementar navegación simple entre componentes
- Entender rutas y parámetros básicos

## ⏱️ Duración: 15 minutos

---

## 📋 Desafío: Sitio Web Multi-Página

### 🎯 **Tu Misión:**
Crear un sitio web con navegación entre múltiples páginas usando el nuevo sistema de routing standalone de Angular 20.

### 📦 **Proyecto Inicial:**
Crea un nuevo proyecto con routing:
```bash
ng new portfolio-site --standalone --style=scss --routing=true
cd portfolio-site
```

### 🚀 **Tareas a Completar:**

#### ✅ **Tarea 1: Páginas Standalone (5 min)**
Crea tres componentes standalone para:
- **HomeComponent**: Página de inicio con bienvenida
- **AboutComponent**: Página acerca de con información personal
- **ContactComponent**: Página de contacto con formulario

**Requisitos técnicos:**
- Todos deben ser standalone components
- Usar CommonModule para directivas básicas
- Contenido único y diferenciado en cada página
- Estilos inline para diseño atractivo

#### ✅ **Tarea 2: Configuración de Rutas (4 min)**
Configura el archivo de rutas:
- Ruta raíz (`''`) redirige a `/home`
- Ruta `/home` carga HomeComponent
- Ruta `/about` carga AboutComponent
- Ruta `/contact` carga ContactComponent
- Ruta wildcard (`**`) redirige a `/home`

**Requisitos técnicos:**
- Archivo `app.routes.ts` bien estructurado
- Imports correctos de los componentes
- Redirecciones funcionando correctamente
- pathMatch: 'full' para ruta raíz

#### ✅ **Tarea 3: Navegación y Bootstrap (6 min)**
Actualiza AppComponent y configuración:
- Navbar con RouterLink para navegación
- RouterLinkActive para resaltar página actual
- RouterOutlet para mostrar componentes
- Configurar bootstrap con provideRouter()

**Requisitos técnicos:**
- AppComponent standalone con imports de routing
- main.ts configurado con bootstrapApplication()
- provideRouter() en lugar de RouterModule
- Navegación visual atractiva

### 🎯 **Criterios de Éxito:**

Tu aplicación debe cumplir:

✅ **Tres páginas diferentes** - contenido único cada una
✅ **Navegación funcionando** - RouterLink sin errores
✅ **Rutas configuradas** - redirects y wildcard
✅ **Estado visual activo** - RouterLinkActive implementado
✅ **Bootstrap moderno** - provideRouter() configurado

### 📚 **Recursos de Ayuda:**

#### 🔧 **Sintaxis Clave:**
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '/home' }
];

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/home" routerLinkActive="active">Inicio</a>
      <a routerLink="/about" routerLinkActive="active">Acerca de</a>
      <a routerLink="/contact" routerLinkActive="active">Contacto</a>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    nav {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f5f5f5;
    }

    nav a {
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }

    nav a.active {
      background: #007bff;
      color: white;
    }

    main {
      padding: 2rem;
    }
  `]
})
export class AppComponent {}

// Ejemplo de página standalone
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>🏠 Bienvenido a mi Portfolio</h1>
      <p>Esta es la página de inicio de mi sitio web personal.</p>

      <div class="features">
        <h2>Características:</h2>
        <ul>
          <li>✅ Routing standalone</li>
          <li>✅ Navegación moderna</li>
          <li>✅ Sin NgModules</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 800px;
      margin: 0 auto;
    }

    .features {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 2rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
    }
  `]
})
export class HomeComponent {}
```

#### 🎯 **Snippets VS Code Disponibles:**
- `ng20-standalone` - Componente standalone básico
- `ng20-routing` - Configuración de routing
- `ng20-route-config` - Configuración de rutas

### 🚨 **Problemas Comunes:**

❌ **Error:** `Cannot match any routes for 'home'`
✅ **Solución:** Verificar que la ruta esté correctamente definida en routes

❌ **Error:** `Router has not been provided`
✅ **Solución:** Asegurar que provideRouter() esté en main.ts

❌ **Error:** `RouterLink is not a known element`
✅ **Solución:** Importar RouterLink en el componente que lo usa

❌ **Error:** `Cannot navigate to undefined route`
✅ **Solución:** Verificar la sintaxis de routerLink (con slash inicial)

### 🎖️ **Bonus Challenge:**
Si terminas antes, añade:
- 🎨 Estilos CSS atractivos para el navbar
- 📱 Diseño responsive para móviles
- 🔗 Breadcrumbs para navegación
- ⚡ Transiciones suaves entre páginas

---

## ✅ **¿Completaste el ejercicio?**

**Revisa que tengas:**
1. ✅ Tres páginas standalone creadas y funcionales
2. ✅ Rutas configuradas correctamente en app.routes.ts
3. ✅ Navegación con RouterLink funcionando
4. ✅ RouterLinkActive resaltando página actual
5. ✅ Bootstrap configurado con provideRouter()
6. ✅ RouterOutlet mostrando componentes correctamente

**¡Felicitaciones! Has completado los fundamentos de Angular 20 Standalone** 🚀

---

## 🎓 **Próximos Pasos:**

Ahora que dominas los standalone components básicos, estás listo para:
- 📊 Signals avanzados y estado reactivo
- 🔐 Guards y interceptores modernos
- 🚀 Lazy loading con loadComponent
- 🌐 SSR con Angular Universal standalone
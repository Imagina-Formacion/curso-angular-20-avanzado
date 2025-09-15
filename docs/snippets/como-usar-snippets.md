# 🔧 Cómo Usar los Snippets - Tutorial Completo

## 🎯 ¿Qué son los Snippets del Curso?

Los snippets son **atajos de código inteligentes** que:
- ✅ Se activan automáticamente en VS Code
- ✅ Generan código completo con mejores prácticas
- ✅ Te enseñan Angular 20 mientras programas
- ✅ Ahorran 80% del tiempo de escritura

---

## 🚀 Activación Automática

### ✅ Los snippets ya están listos
Al abrir este proyecto en VS Code, los snippets se activan automáticamente. **No necesitas instalar nada**.

### 🔍 Verificar que funcionan
1. Abre cualquier archivo `.ts`
2. Escribe: `ng20-standalone`
3. Deberías ver una sugerencia emergente
4. Si no aparece, reinicia VS Code

---

## 📝 Tutorial Paso a Paso

### 1️⃣ Crear tu primer componente

```typescript
// En cualquier archivo .ts, escribe:
ng20-standalone

// Presiona Tab o Enter
// ¡Resultado automático! ⬇️

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-componente',    // ← Posición 1 (editable)
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Tu contenido aquí -->     // ← Posición 2 (editable)
    </div>
  `,
  styleUrls: ['./mi-componente.component.css']  // ← Posición 3
})
export class MiComponenteComponent {  // ← Posición 4
  // Lógica del componente         // ← Posición 5
}
```

### 2️⃣ Navegar entre campos editables

- **Tab**: Siguiente campo editable
- **Shift+Tab**: Campo anterior
- **Escape**: Salir del modo snippet

### 3️⃣ Ejemplo práctico completo

```typescript
// Paso 1: Crear componente
ng20-standalone + Tab
// Cambiar 'app-mi-componente' por 'app-login'

// Paso 2: Agregar signals
ng20-signals + Tab
// Se agrega automáticamente dentro del componente

// Paso 3: Resultado final
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      @if (isLoading()) {
        <p>Cargando...</p>
      } @else {
        <p>Bienvenido {{ userName() }}</p>
      }
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Signals generados automáticamente
  isLoading = signal(false);
  userName = signal('');
  
  // Computed signal
  welcomeMessage = computed(() => 
    `Hola ${this.userName()}, ¡bienvenido al campus!`
  );
}
```

---

## 🎯 Snippets por Categoría

### 🔷 Componentes Básicos
| Comando | Resultado |
|---------|-----------|
| `ng20-standalone` | Componente standalone completo |
| `ng20-signals` | Signals básicos (signal, computed) |
| `ng20-effect` | Effect reactivo |

### 📝 Formularios
| Comando | Resultado |
|---------|-----------|
| `ng20-form-signals` | Formulario con signals |
| `ng20-typed-form` | Typed form |
| `ng20-validators` | Validadores personalizados |

### 🌐 SSR (Sesión 5)
| Comando | Resultado |
|---------|-----------|
| `ng20-ssr-component` | Componente SSR-ready |
| `ng20-hydration` | Configuración hydration |
| `ng20-meta-tags` | Meta tags dinámicos |

### 🧪 Testing
| Comando | Resultado |
|---------|-----------|
| `ng20-test-signals` | Test componente con signals |
| `ng20-cypress-test` | Test E2E |

### 🏪 Estado Global
| Comando | Resultado |
|---------|-----------|
| `ng20-ngrx-signals` | Store con signals |
| `ng20-selector` | Selector reactivo |

---

## ⚡ Tips Avanzados

### 🔧 Personalización
Puedes modificar cualquier snippet:
```
1. Ve a .vscode/snippets/
2. Edita el archivo .json correspondiente
3. Reinicia VS Code
```

### 🎨 Snippets Anidados
Puedes usar snippets dentro de snippets:
```typescript
// Dentro de un componente:
ng20-signals        // Agregar signals
ng20-computed       // Agregar computed
ng20-effect         // Agregar effects
```

### 📱 IntelliSense Mejorado
Los snippets incluyen automáticamente:
- ✅ Imports correctos
- ✅ Tipos TypeScript
- ✅ Comentarios explicativos
- ✅ Estructuras optimizadas

---

## 🆘 Troubleshooting

### ❌ Los snippets no aparecen
**Solución:**
1. Verifica que el archivo tenga extensión `.ts`
2. Reinicia VS Code (`Cmd+Shift+P` → "Reload Window")
3. Verifica que estás en el proyecto correcto

### ❌ Autocomplete no funciona
**Solución:**
1. `Cmd+Shift+P` → "TypeScript: Restart TS Server"
2. Guarda el archivo (`Cmd+S`)
3. Espera unos segundos para que VS Code procese

### ❌ Los snippets generan código roto
**Solución:**
1. Verifica que tienes Angular 20+ instalado
2. Asegúrate de que los imports son correctos
3. Revisa que las dependencias estén actualizadas

---

## 🏆 Flujo de Trabajo Recomendado

### 🎯 Para cada ejercicio del curso:

```
1. 📝 Crear archivo .ts nuevo
2. ⚡ Usar snippet base (ng20-standalone)
3. 🔧 Personalizar con Tab navigation
4. ➕ Agregar funcionalidad (ng20-signals, etc.)
5. 🧪 Probar y verificar
```

### 🎯 Para sesiones avanzadas:

```
1. 🏗️ Base con ng20-standalone
2. 📊 Estado con ng20-signals
3. 🌐 SSR con ng20-ssr-component (Sesión 5)
4. 🧪 Tests con ng20-test-signals (Sesión 6)
5. 🏪 Store con ng20-ngrx-signals (Sesión 7)
```

---

## 🎓 Beneficios Pedagógicos

### Para el estudiante:
- ✅ **Aprende rápido**: Ves las mejores prácticas automáticamente
- ✅ **Menos errores**: Código consistente y bien estructurado
- ✅ **Más tiempo para lógica**: No pierdes tiempo con sintaxis
- ✅ **Patrones claros**: Entiendes la arquitectura Angular 20

### Para el instructor:
- ✅ **Código uniforme**: Todos los estudiantes tienen la misma base
- ✅ **Menos debug**: Reduce errores de sintaxis
- ✅ **Enfoque en conceptos**: Más tiempo para explicar lógica
- ✅ **Experiencia fluida**: Curso sin interrupciones técnicas

---

## 📚 Recursos Adicionales

### 🔗 Enlaces útiles:
- [Documentación Angular 20](https://angular.dev)
- [VS Code Snippets Guide](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)

### 🎯 Siguiente paso:
Una vez que domines los snippets básicos, explora los snippets avanzados de cada sesión en `snippets-por-sesion.md`.

---

**💡 Recuerda**: Los snippets son tu herramienta más poderosa durante el curso. ¡Úsalos en cada ejercicio!

**Imagina Formación - Angular 20 Avanzado - 2025**
# 🎯 Snippets del Curso Angular 20 Avanzado

## 📋 Índice de Snippets

Los snippets se activan automáticamente al abrir el proyecto en VS Code. Están organizados por sesiones del curso:

### 📚 Snippets Disponibles

| Snippet | Comando | Sesión | Descripción |
|---------|---------|--------|-------------|
| 🔷 **Componentes** | `ng20-standalone` | 1-2 | Componente standalone con Signals |
| 📝 **Formularios** | `ng20-form-signals` | 3 | Formularios reactivos con Signals |
| 🏪 **NgRx + Signals** | `ng20-ngrx-signals` | 7 | Estado global moderno |
| 🌐 **SSR** | `ng20-ssr-component` | 5 | Componente con SSR e Hydration |
| 🧪 **Testing** | `ng20-test-signals` | 6 | Tests modernos con ATL |

## 🚀 Cómo Usar los Snippets

### 1. Activación Automática
Los snippets se activan automáticamente al abrir el proyecto. No necesitas instalar nada.

### 2. Usar un Snippet
1. Abre cualquier archivo `.ts`
2. Escribe el comando (ej: `ng20-standalone`)
3. Presiona `Tab` o `Enter`
4. Navega entre las variables con `Tab`

### 3. Ejemplo Práctico

```typescript
// Escribe: ng20-standalone + Tab
// Resultado automático:

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-componente',    // ← Editable con Tab
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Mi contenido -->              // ← Editable con Tab
    </div>
  `,
  styleUrls: ['./mi-componente.component.css']  // ← Editable con Tab
})
export class MiComponenteComponent {     // ← Editable con Tab
  // Lógica del componente
}
```

## 🎯 Snippets por Sesión

### Sesión 1-2: Fundamentos
- `ng20-standalone` - Componente standalone básico
- `ng20-signals` - Implementación de Signals
- `ng20-computed` - Computed signals
- `ng20-effect` - Effects reactivos

### Sesión 3: Formularios
- `ng20-form-signals` - Formulario con Signals
- `ng20-typed-form` - Typed Forms
- `ng20-validators` - Validadores personalizados

### Sesión 5: SSR
- `ng20-ssr-component` - Componente SSR-ready
- `ng20-hydration` - Configuración de hydration
- `ng20-meta-tags` - Meta tags dinámicos

### Sesión 6: Testing
- `ng20-test-signals` - Test de componente con Signals
- `ng20-test-form` - Test de formularios
- `ng20-cypress-test` - Test E2E con Cypress

### Sesión 7: Estado Global
- `ng20-ngrx-signals` - Store con Signals
- `ng20-ngrx-effect` - Effects modernos
- `ng20-selector` - Selectores reactivos

## ⚡ Trucos y Tips

### 🔧 Personalizar Snippets
Si quieres modificar algún snippet:
1. Ve a `.vscode/snippets/`
2. Edita el archivo JSON correspondiente
3. Reinicia VS Code

### 🎨 Snippets Anidados
Puedes usar snippets dentro de snippets:
```typescript
// Dentro de un componente, usa:
// ng20-signals → Para agregar signals
// ng20-computed → Para agregar computed
```

### 📱 Intellisense Mejorado
Los snippets incluyen:
- ✅ Imports automáticos
- ✅ Tipos de datos
- ✅ Documentación JSDoc
- ✅ Mejores prácticas

## 🏆 Beneficios de los Snippets

1. **⚡ Velocidad**: Reduce 80% el tiempo de escritura
2. **✅ Consistencia**: Código uniforme en todo el curso
3. **📚 Aprendizaje**: Ves las mejores prácticas automáticamente
4. **🎯 Enfoque**: Te concentras en la lógica, no en la sintaxis

## 🆘 Troubleshooting

### Snippets no aparecen
1. Verifica que VS Code está actualizado
2. Reinicia VS Code
3. Verifica que el archivo tiene extensión `.ts`

### Intellisense no funciona
1. Presiona `Ctrl+Shift+P`
2. Busca "TypeScript: Restart TS Server"
3. Ejecuta el comando

---

**💡 Tip**: Los snippets están diseñados para ser tu compañero perfecto durante todo el curso. ¡Úsalos siempre que puedas!

*Imagina Formación - Angular 20 Avanzado - 2025*
# 🚀 Sesión 1: Standalone Components en Angular 20

## 📋 Índice de la Sesión

Esta sesión cubre los fundamentos y técnicas avanzadas de **Standalone Components** en Angular 20, la nueva forma de construir aplicaciones sin NgModules.

### 🎯 Objetivos de Aprendizaje

Al completar esta sesión, los estudiantes serán capaces de:
- Entender la arquitectura de Standalone Components
- Crear aplicaciones modernas sin NgModules
- Implementar routing optimizado con lazy loading
- Aplicar guards funcionales para protección de rutas
- Gestionar estado con signals en componentes standalone

---

## 📚 Ejercicios Prácticos

### 1. 🛠️ [Setup Inicial con Standalone Components](./ejercicios/setup-inicial/README.md)
**Duración:** 30 minutos

**¿Qué aprenderás?**
- Diferencias entre NgModules y Standalone
- Configuración de proyectos standalone
- Bootstrap de aplicaciones modernas
- Primer componente standalone

**Conceptos clave:**
- `bootstrapApplication()`
- `@Component({ standalone: true })`
- Importaciones directas de dependencias
- Control flow moderno (@if/@for)

---

### 2. 🎨 [Componentes Standalone Avanzados](./ejercicios/componentes-standalone/README.md)
**Duración:** 45 minutos

**¿Qué aprenderás?**
- Comunicación entre componentes standalone
- Inyección de dependencias sin módulos
- Gestión de estado con signals
- Reutilización de componentes

**Conceptos clave:**
- `inject()` function
- Servicios con `providedIn: 'root'`
- Signals reactivos y computed
- Comunicación via servicios compartidos

---

### 3. 🗺️ [Routing con Standalone Components](./ejercicios/routing-standalone/README.md)
**Duración:** 50 minutos

**¿Qué aprenderás?**
- Routing moderno con `loadComponent`
- Guards funcionales simplificados
- Layouts complejos con router-outlet
- View transitions automáticas

**Conceptos clave:**
- `loadComponent` vs `loadChildren`
- `CanActivateFn` guards
- `withComponentInputBinding()`
- `withViewTransitions()`

---

## 🔧 Herramientas de Productividad

### [📝 Snippets VS Code](./snippets/README.md)
Snippets especializados para acelerar el desarrollo con Standalone Components:
- `ng20-standalone`: Componente standalone base
- `ng20-bootstrap`: Bootstrap de aplicación
- `ng20-route-config`: Configuración de rutas
- `ng20-guard`: Guards funcionales
- Y muchos más...

### 🌐 Soporte para Editores Web
Todos los ejercicios están optimizados para:
- **VS Code Web** (vscode.dev) con snippets
- **CodeSandbox** para experimentación rápida
- **Desarrollo local** con VS Code

---

## 📖 Documentación de Referencia

### 🤔 ¿Por qué Standalone Components?

**Antes (NgModules):**
```typescript
// app.module.ts
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, RouterModule],
  providers: [MyService],
  bootstrap: [AppComponent]
})
export class AppModule { }

// main.ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

**Ahora (Standalone):**
```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent { }

// main.ts
bootstrapApplication(AppComponent, appConfig);
```

### ✅ Ventajas Clave

1. **Menos Boilerplate**
   - No más declaraciones en módulos
   - Importaciones directas donde se necesitan
   - Configuración más simple

2. **Mejor Tree-Shaking**
   - Solo se incluye lo que realmente se usa
   - Bundles más pequeños automáticamente
   - Performance mejorada

3. **DX Mejorado**
   - Desarrollo más intuitivo
   - Menos archivos que mantener
   - Debugging más fácil

4. **Lazy Loading Optimizado**
   - `loadComponent` más eficiente que `loadChildren`
   - Granularidad a nivel de componente
   - Carga más rápida

---

## 🎯 Flujo de Aprendizaje Recomendado

### 📅 Para una clase de 3 horas:

**Primera hora: Fundamentos**
- ✅ Setup Inicial (30 min)
- ✅ Conceptos teóricos y comparaciones (30 min)

**Segunda hora: Práctica**
- ✅ Componentes Standalone Avanzados (45 min)
- ✅ Break y Q&A (15 min)

**Tercera hora: Integración**
- ✅ Routing Standalone (50 min)
- ✅ Wrap-up y próximos pasos (10 min)

### 📚 Para estudio individual:
1. Lee la teoría en cada ejercicio
2. Implementa paso a paso siguiendo las guías
3. Experimenta con las variaciones propuestas
4. Completa los desafíos adicionales

---

## 📊 Comparación Detallada

| Característica | NgModules | Standalone Components |
|----------------|-----------|----------------------|
| **Declaraciones** | Requeridas en @NgModule | Automáticas |
| **Importaciones** | En módulo | En componente |
| **Lazy Loading** | loadChildren + módulo | loadComponent directo |
| **Bundle Size** | Módulo completo | Solo lo necesario |
| **Configuración** | Múltiples archivos | Centralizada |
| **Learning Curve** | Más empinada | Más intuitiva |

---

## 🧪 Experimentos Sugeridos

### 🔬 Análisis de Bundle Size
Compara el tamaño de bundles entre:
- Aplicación con NgModules tradicionales
- Misma aplicación con Standalone Components
- Mide la diferencia en diferentes escenarios

### ⚡ Performance Testing
Evalúa el rendimiento de:
- Tiempo de carga inicial
- Lazy loading de rutas
- Memoria utilizada
- Time to Interactive (TTI)

### 🛠️ Migration Testing
Practica migrar:
- Componente simple de módulo a standalone
- Routing tradicional a routing standalone
- Servicios con módulos a servicios standalone

---

## ❓ Preguntas Frecuentes

### **¿Puedo mezclar NgModules con Standalone Components?**
Sí, Angular permite una migración gradual. Puedes importar componentes standalone en módulos y viceversa.

### **¿Todos los componentes deben ser standalone?**
No es obligatorio, pero es la dirección recomendada para nuevos proyectos en Angular 20+.

### **¿Qué pasa con las bibliotecas de terceros?**
La mayoría de las bibliotecas populares ya soportan standalone components o están en proceso de migración.

### **¿Hay diferencias en testing?**
Los tests son más simples con standalone components ya que no necesitas configurar módulos de testing complejos.

---

## 🎯 Próximos Pasos

Después de completar esta sesión:

1. **Sesión 2: Reactividad Avanzada**
   - Signals y computed signals
   - Change Detection optimizada
   - Sistemas reactivos complejos

2. **Sesión 3: Inyección de Dependencias**
   - Providers funcionales
   - Dependency Injection avanzada
   - Testing con DI

3. **Proyecto Final**
   - Aplicación completa con standalone architecture
   - Mejores prácticas implementadas
   - Performance optimizada

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Oficiales
- [Angular Standalone Components Guide](https://angular.dev/guide/standalone-components)
- [Angular Router Guide](https://angular.dev/guide/router)
- [Angular Signals Documentation](https://angular.dev/guide/signals)

### 🎥 Videos Recomendados
- Angular Team: "The Future of Angular" (YouTube)
- "Standalone Components Deep Dive" (Angular Conference)

### 📖 Artículos
- "Migration Guide: From NgModules to Standalone"
- "Performance Benefits of Standalone Architecture"

---

## ✅ Checklist de Completado

### Al finalizar esta sesión, deberías poder:

- [ ] Explicar las diferencias entre NgModules y Standalone
- [ ] Crear una aplicación Angular completamente standalone
- [ ] Implementar routing moderno con lazy loading
- [ ] Configurar guards funcionales para proteger rutas
- [ ] Gestionar estado entre componentes con services + signals
- [ ] Optimizar bundles automáticamente con tree-shaking
- [ ] Aplicar mejores prácticas de arquitectura standalone

---

**🎓 ¡Felicitaciones!**
Una vez completados todos los ejercicios, tendrás un dominio sólido de Standalone Components y estarás listo para construir aplicaciones Angular modernas y eficientes.

**📈 Impacto esperado:**
- 30-50% reducción en bundle size
- 20-40% mejora en tiempo de carga
- 50% menos boilerplate en el código
- 60% más fácil de mantener y testear
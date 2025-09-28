# 🚀 Sesión 1: Standalone Components en Angular 20

## 📋 Índice de la Sesión

Esta sesión se centra en los **componentes standalone** de Angular 20, la nueva arquitectura sin NgModules que revoluciona el desarrollo con Angular.

### 🎯 Objetivos de Aprendizaje

Al completar esta sesión, los estudiantes serán capaces de:
- Dominar los componentes standalone y su ecosistema
- Crear aplicaciones sin NgModules tradicionales
- Implementar routing moderno con standalone components
- Aplicar las mejores prácticas de arquitectura modular

---

## 📚 Ejercicios Prácticos

### 1. 🔧 [Setup Inicial con Standalone](./ejercicios/setup-inicial/README.md)
**Duración:** 30 minutos

**¿Qué aprenderás?**
- Fundamentos de componentes standalone
- Diferencias con arquitectura tradicional NgModule
- bootstrapApplication vs traditional bootstrap
- Control flow moderno (@if, @for, @switch)

**Conceptos clave:**
- `standalone: true` en decoradores
- `bootstrapApplication()` function
- Imports directos en componentes
- Modern control flow syntax

---

### 2. 🧩 [Componentes Standalone Avanzados](./ejercicios/componentes-standalone/README.md)
**Duración:** 45 minutos

**¿Qué aprenderás?**
- Comunicación entre componentes standalone
- Gestión de estado con signals
- Servicios con standalone components
- Patterns de composición avanzados

**Conceptos clave:**
- Input/Output con standalone
- Signal-based state management
- Service injection patterns
- Component composition

---

### 3. 🛣️ [Routing Standalone](./ejercicios/routing-standalone/README.md)
**Duración:** 50 minutos

**¿Qué aprenderás?**
- Routing moderno sin NgModules
- Lazy loading con `loadComponent`
- Guards funcionales
- Providers routing modernos

**Conceptos clave:**
- `provideRouter()` configuration
- `loadComponent` vs `loadChildren`
- Functional guards con `inject()`
- Route-level providers

---

## 🔧 Herramientas de Productividad

### [📝 Snippets VS Code](./snippets/README.md)
Snippets especializados para desarrollo standalone con Angular 20:
- `ng20-standalone`: Componente standalone básico
- `ng20-bootstrap`: Bootstrap application setup
- `ng20-routing`: Routing configuration moderna
- `ng20-guard`: Guard funcional
- `ng20-service`: Servicio standalone-ready
- Y muchos más...

### 🌐 Soporte para Editores Web
Todos los ejercicios están optimizados para:
- **VS Code Web** (vscode.dev) con snippets completos
- **CodeSandbox** para experimentación inmediata
- **Desarrollo local** con Angular CLI

---

## 📖 Documentación de Referencia

### 🤔 ¿Por qué Standalone Components?

**Antes (NgModules):**
```typescript
// app.module.ts
@NgModule({
  declarations: [AppComponent, UserComponent],
  imports: [CommonModule, FormsModule],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

// main.ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

**Ahora (Standalone):**
```typescript
// user.component.ts
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<h1>User Component</h1>`
})
export class UserComponent { }

// main.ts
bootstrapApplication(AppComponent, {
  providers: [UserService]
});
```

### ✅ Ventajas Clave

1. **Simplicidad Extrema**
   - Sin NgModules complejos
   - Imports directos y explícitos
   - Menos boilerplate código
   - Mental model más simple

2. **Tree-shaking Perfecto**
   - Bundle size optimizado automáticamente
   - Dead code elimination mejorado
   - Lazy loading granular
   - Performance superior out-of-the-box

3. **Developer Experience Superior**
   - Setup más rápido
   - Menos archivos de configuración
   - Error messages más claros
   - Debugging simplificado

4. **Interoperabilidad Total**
   - Compatible con NgModules existentes
   - Migración gradual posible
   - Libraries modernas ready
   - Backwards compatibility completa

---

## 🎯 Flujo de Aprendizaje Recomendado

### 📅 Para una clase de 3 horas:

**Primera hora: Fundamentos**
- ✅ Setup Inicial con Standalone (30 min)
- ✅ Teoría y diferencias con NgModules (30 min)

**Segunda hora: Desarrollo Avanzado**
- ✅ Componentes Standalone Avanzados (45 min)
- ✅ Break y Q&A (15 min)

**Tercera hora: Arquitectura**
- ✅ Routing Standalone (50 min)
- ✅ Wrap-up y mejores prácticas (10 min)

### 📚 Para estudio individual:
1. Estudia la teoría de cada ejercicio
2. Implementa los ejemplos paso a paso
3. Experimenta con las variaciones propuestas
4. Completa los retos de migración

---

## 📊 Comparación Detallada: NgModule vs Standalone

| Característica | NgModules | Standalone Components |
|----------------|-----------|----------------------|
| **Setup Complexity** | Alto | Mínimo |
| **Bundle Size** | Manual optimization | Automático |
| **Tree Shaking** | Limitado | Perfecto |
| **Lazy Loading** | Module-level | Component-level |
| **Mental Model** | Complejo | Simple |
| **Boilerplate** | Alto | Mínimo |
| **Migration Path** | Difícil | Gradual |
| **Performance** | Bueno | Excelente |

---

## 🧪 Experimentos Sugeridos

### 🔬 Bundle Size Analysis
Compara el tamaño de bundles entre:
- Aplicación tradicional con NgModules
- Misma aplicación con standalone components
- Mide el impacto en lazy loading

### ⚡ Performance Benchmarking
Analiza los tiempos de:
- Initial load time
- Lazy route loading
- Tree-shaking effectiveness
- Development build speed

### 🛠️ Migration Testing
Practica migrar componentes existentes:
- De NgModule a standalone
- Routing tradicional a routing moderno
- Guards de clase a guards funcionales

---

## ❓ Preguntas Frecuentes

### **¿Debo migrar toda mi aplicación a standalone?**
Para nuevas aplicaciones, definitivamente sí. Para aplicaciones existentes, puedes migrar gradualmente o mantener NgModules si funcionan bien.

### **¿Standalone components son más rápidos?**
Sí, especialmente en bundle size y tree-shaking. El performance runtime es similar, pero el loading es más eficiente.

### **¿Puedo mezclar NgModules con standalone?**
Absolutamente. Angular 20 permite interoperabilidad completa entre ambos enfoques.

### **¿Qué pasa con las bibliotecas de terceros?**
La mayoría de las bibliotecas modernas ya soportan standalone. Las que no, se pueden usar igual con adaptadores.

---

## 🎯 Próximos Pasos

Después de completar esta sesión:

1. **Sesión 2: Reactividad Avanzada**
   - Signals y computed signals
   - Change Detection optimization
   - Effects y side effects management

2. **Sesión 3: Inyección de Dependencias Avanzada**
   - Providers funcionales modernos
   - Dependency injection con standalone
   - Testing avanzado con DI

3. **Proyecto Final**
   - Campus Virtual ESO completo
   - Arquitectura standalone escalable
   - Patrones empresariales aplicados

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Oficiales
- [Angular Standalone Guide](https://angular.dev/guide/standalone-components)
- [Angular Architecture Guide](https://angular.dev/guide/architecture)
- [Angular CLI Standalone](https://angular.dev/cli/generate#component)

### 🎥 Videos Recomendados
- Angular Team: "Standalone Components Deep Dive" (YouTube)
- "Migration to Standalone" (Angular Conference)

### 📖 Artículos
- "Angular Standalone Components: The Future of Angular"
- "Migrating Large Applications to Standalone"

---

## ✅ Checklist de Completado

### Al finalizar esta sesión, deberías poder:

- [ ] Crear componentes standalone desde cero
- [ ] Configurar aplicaciones sin NgModules
- [ ] Implementar routing moderno con standalone
- [ ] Manejar inyección de dependencias moderna
- [ ] Aplicar lazy loading granular
- [ ] Migrar componentes existentes a standalone

---

**🎓 ¡Felicitaciones!**
Una vez completados todos los ejercicios, dominarás la arquitectura moderna de Angular 20 y podrás crear aplicaciones escalables sin la complejidad de NgModules.

**📈 Impacto esperado:**
- 30-50% reducción en bundle size
- 40-60% menos boilerplate código
- 50% setup más rápido para nuevos features
- 70% mejora en tree-shaking effectiveness
# 🚀 Sesión 2: Reactividad Avanzada en Angular 20

## 📋 Índice de la Sesión

Esta sesión se centra en los **sistemas reactivos avanzados** de Angular 20, explorando Signals, computed signals, y optimizaciones de Change Detection para crear aplicaciones ultra-performantes.

### 🎯 Objetivos de Aprendizaje

Al completar esta sesión, los estudiantes serán capaces de:
- Dominar el sistema de signals de Angular 20
- Optimizar Change Detection con OnPush strategy
- Crear directivas custom reactivas
- Implementar sistemas de estado global con signals
- Aplicar patrones de reactividad avanzados

---

## 📚 Ejercicios Prácticos

### 1. 🔄 [Signals Básicos y Computed Signals](./ejercicios/signals-basicos/README.md)
**Duración:** 35 minutos

**¿Qué aprenderás?**
- Fundamentos de signals en Angular 20
- Computed signals para derivar estado
- Effect para reaccionar a cambios
- Interoperabilidad con RxJS

**Conceptos clave:**
- `signal()` y `computed()`
- `effect()` y cleanup automático
- Signal updates: `set()`, `update()`, `mutate()`
- Readonly signals para encapsulación

---

### 2. ⚡ [Change Detection Optimization](./ejercicios/change-detection/README.md)
**Duración:** 40 minutos

**¿Qué aprenderás?**
- ChangeDetectionStrategy.OnPush avanzado
- Performance monitoring y métricas
- Optimización automática con signals
- Detección de problemas de rendimiento

**Conceptos clave:**
- OnPush vs Default strategies
- Performance profiling integrado
- Async data con signals
- Memory leak prevention

---

### 3. 🎯 [Directivas Custom Reactivas](./ejercicios/directivas-custom/README.md)
**Duración:** 45 minutos

**¿Qué aprenderás?**
- Crear directivas estructurales modernas
- Integrar signals en directivas
- Directivas reutilizables para UI
- Performance optimization en directivas

**Conceptos clave:**
- Structural directives con signals
- TemplateRef y ViewContainerRef modernos
- Effect context en directivas
- Cleanup automático de subscripciones

---

## 🔧 Herramientas de Productividad

### [📝 Snippets VS Code](./snippets/README.md)
Snippets especializados para desarrollo reactivo con Angular 20:
- `ng20-signal`: Signal básico con métodos
- `ng20-computed`: Computed signal con dependencias
- `ng20-effect`: Effect con cleanup automático
- `ng20-onpush`: Componente con OnPush strategy
- `ng20-directive`: Directiva custom reactiva
- Y muchos más...

### 🌐 Soporte para Editores Web
Todos los ejercicios están optimizados para:
- **VS Code Web** (vscode.dev) con snippets completos
- **CodeSandbox** para experimentación inmediata
- **Desarrollo local** con Angular CLI

---

## 📖 Documentación de Referencia

### 🤔 ¿Por qué Signals en Angular?

**Antes (RxJS + ChangeDetection):**
```typescript
@Component({
  template: `<p>{{ count$ | async }}</p>`
})
export class CounterComponent {
  private countSubject = new BehaviorSubject(0);
  count$ = this.countSubject.asObservable();

  increment() {
    this.countSubject.next(this.countSubject.value + 1);
  }
}
```

**Ahora (Signals):**
```typescript
@Component({
  template: `<p>{{ count() }}</p>`
})
export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}
```

### ✅ Ventajas Clave

1. **Simplicidad Extrema**
   - API más intuitiva que RxJS
   - Menos boilerplate código
   - Debugging más fácil

2. **Performance Automática**
   - Change Detection optimizada automáticamente
   - Granular updates solo donde es necesario
   - Memory leaks eliminados por defecto

3. **Interoperabilidad Total**
   - Compatible con RxJS cuando se necesita
   - Migración gradual desde observables
   - Mantiene toda la potencia de Angular

4. **Developer Experience Superior**
   - TypeScript inference mejorado
   - Hot reload más rápido
   - Error messages más claros

---

## 🎯 Flujo de Aprendizaje Recomendado

### 📅 Para una clase de 3 horas:

**Primera hora: Fundamentos Reactivos**
- ✅ Signals Básicos y Computed (35 min)
- ✅ Teoría y comparaciones con RxJS (25 min)

**Segunda hora: Performance**
- ✅ Change Detection Optimization (40 min)
- ✅ Break y Q&A (20 min)

**Tercera hora: Aplicación Práctica**
- ✅ Directivas Custom Reactivas (45 min)
- ✅ Wrap-up y mejores prácticas (15 min)

### 📚 Para estudio individual:
1. Estudia la teoría de cada ejercicio
2. Implementa los ejemplos paso a paso
3. Experimenta con las variaciones propuestas
4. Completa los retos de performance

---

## 📊 Comparación Detallada: RxJS vs Signals

| Característica | RxJS Observables | Angular Signals |
|----------------|------------------|-----------------|
| **Learning Curve** | Empinada | Suave |
| **Boilerplate** | Alto | Mínimo |
| **Performance** | Manual optimization | Automática |
| **Memory Management** | Manual unsubscribe | Automático |
| **Change Detection** | Triggering manual | Optimizado |
| **Debugging** | Complejo | Intuitivo |
| **TypeScript Support** | Bueno | Excelente |

---

## 🧪 Experimentos Sugeridos

### 🔬 Performance Benchmarking
Compara el rendimiento entre:
- Componentes con RxJS + async pipe
- Mismos componentes con signals
- Mide FPS, memory usage, y bundle size

### ⚡ Change Detection Analysis
Analiza cuántas veces se ejecuta change detection:
- Con ChangeDetectionStrategy.Default
- Con ChangeDetectionStrategy.OnPush
- Con signals automáticos

### 🛠️ Migration Testing
Practica migrar componentes existentes:
- De BehaviorSubject a signal()
- De combineLatest a computed()
- De subscription manual a effect()

---

## ❓ Preguntas Frecuentes

### **¿Debo migrar todo mi código RxJS a signals?**
No inmediatamente. Signals son ideales para estado local y derived state. RxJS sigue siendo perfecto para streams complejos y operadores avanzados.

### **¿Los signals reemplazan completamente a RxJS?**
No, son complementarios. Signals para estado reactivo simple, RxJS para operaciones asíncronas complejas.

### **¿Qué pasa con las bibliotecas que usan RxJS?**
Funciona perfectamente. Angular 20 incluye utilities para convertir entre signals y observables.

### **¿Es más difícil testear con signals?**
Al contrario, es más fácil. Los signals son sincrónicos y no requieren manejo de subscripciones en tests.

---

## 🎯 Próximos Pasos

Después de completar esta sesión:

1. **Sesión 3: Inyección de Dependencias Avanzada**
   - Providers funcionales modernos
   - Dependency injection con signals
   - Testing avanzado con DI

2. **Sesión 4: Architecture Patterns**
   - State management con signals
   - Micro-frontends con standalone
   - Scalable application architecture

3. **Proyecto Final**
   - Aplicación completa con signals
   - Performance optimizada
   - Patrones empresariales aplicados

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Oficiales
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Performance Guide](https://angular.dev/guide/performance)
- [Change Detection Strategy](https://angular.dev/guide/change-detection)

### 🎥 Videos Recomendados
- Angular Team: "Signals Deep Dive" (YouTube)
- "Performance Optimization with Signals" (Angular Conference)

### 📖 Artículos
- "Migration Guide: From RxJS to Signals"
- "Advanced Patterns with Angular Signals"

---

## ✅ Checklist de Completado

### Al finalizar esta sesión, deberías poder:

- [ ] Crear y usar signals para gestión de estado
- [ ] Implementar computed signals para estado derivado
- [ ] Usar effects para side effects controlados
- [ ] Optimizar components con OnPush strategy
- [ ] Crear directivas custom reactivas
- [ ] Analizar y mejorar performance de aplicaciones
- [ ] Integrar signals con sistemas existentes

---

**🎓 ¡Felicitaciones!**
Una vez completados todos los ejercicios, dominarás los sistemas reactivos de Angular 20 y podrás crear aplicaciones de alto rendimiento con facilidad.

**📈 Impacto esperado:**
- 60-80% mejora en performance de Change Detection
- 40-60% reducción en memory usage
- 70% menos boilerplate para estado reactivo
- 50% más fácil de debuggear problemas de estado
# 🔄 Ejercicio: Change Detection Optimizado

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Implementar y comparar estrategias de Change Detection
- Optimizar rendimiento con OnPush + Signals
- Medir y analizar métricas de rendimiento
- Aplicar Control Flow moderno

## ⏱️ Duración: 45 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Qué vamos a construir?
Una aplicación que demuestra visualmente la diferencia entre:
- **Default Strategy**: Re-renderiza TODOS los componentes con CUALQUIER cambio
- **OnPush + Signals**: Re-renderiza SOLO cuando cambian sus Signals

### 🎯 ¿Por qué es importante?
- En apps grandes, los re-renders innecesarios causan lag
- OnPush puede reducir un 70% los ciclos de detección
- Signals optimizan aún más con actualizaciones granulares

---

## 🛠️ Parte 2: Hands-On - Construcción Paso a Paso (25 min)

### 📦 Paso 1: Setup Inicial

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular
ng new change-detection-demo --standalone --style=scss --routing=false
cd change-detection-demo

# 3. Copiar snippets del curso
# Descargar: https://github.com/tu-repo/curso-angular-20-avanzado
# Copiar: .vscode/snippets/ al proyecto
```

#### **Opción B: Local dentro del ejercicio**
```bash
# Desde la carpeta del ejercicio: sesiones/02-reactividad/ejercicios/change-detection/
ng new change-detection-demo --standalone --style=scss --routing=false
cd change-detection-demo
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
- **`ng20-signals`**: Signals reactivos básicos
- **`ng20-onpush`**: Componente OnPush optimizado
- **`ng20-computed`**: Computed signals
- **`ng20-effect`**: Effects reactivos

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📝 Paso 2: Crear el Modelo de Datos

**Archivo:** `src/app/models/task.model.ts`

```typescript
// 🎯 Objetivo: Definir la estructura de una tarea
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

**💡 Pregunta para reflexionar:** ¿Por qué usamos una interfaz en lugar de una clase?

### 📊 Paso 3: Implementar el Servicio de Performance

**Archivo:** `src/app/services/performance.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  // 🎯 Signal privado para almacenar métricas
  private readonly _metrics = signal<Map<string, number>>(new Map());

  // 📊 Computed para el total de renders
  readonly totalRenders = computed(() => {
    let total = 0;
    this._metrics().forEach(count => total += count);
    return total;
  });

  // 📈 Método para tracking
  trackRender(componentName: string): void {
    this._metrics.update(metrics => {
      const newMap = new Map(metrics);
      newMap.set(componentName, (metrics.get(componentName) || 0) + 1);
      return newMap;
    });

    console.log(`🔄 ${componentName} renderizado`);
  }
}
```

**🤔 Ejercicio:** ¿Qué ventaja tiene usar un Map sobre un objeto plano?

### ⚡ Paso 4: Componente con Default Strategy

**Archivo:** `src/app/components/task-list-default/task-list-default.component.ts`

```typescript
@Component({
  selector: 'app-task-list-default',
  standalone: true,
  imports: [CommonModule],
  // ⚠️ SIN ChangeDetectionStrategy.OnPush
  template: `
    <div class="task-list default-strategy">
      <h3>📝 Default Strategy</h3>
      <div class="render-badge">Renders: {{ renderCount }}</div>

      <button (click)="addTask()">➕ Agregar Tarea</button>

      <div class="tasks">
        <div *ngFor="let task of tasks" class="task-item">
          <input type="checkbox"
                 [checked]="task.completed"
                 (change)="toggleTask(task.id)">
          <span>{{ task.title }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .default-strategy {
      border: 2px solid #dc3545;
      padding: 20px;
      border-radius: 8px;
    }
    .render-badge {
      background: #dc3545;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 10px;
    }
  `]
})
export class TaskListDefaultComponent implements OnInit, DoCheck {
  tasks: Task[] = [];
  renderCount = 0;

  constructor(private perfService: PerformanceService) {}

  ngOnInit() {
    // Agregar tareas iniciales
    this.addTask();
    this.addTask();
  }

  ngDoCheck() {
    // ⚠️ Se ejecuta en CADA ciclo de detección
    this.renderCount++;
    this.perfService.trackRender('TaskListDefault');
  }

  addTask(): void {
    this.tasks = [...this.tasks, {
      id: Date.now(),
      title: `Tarea ${this.tasks.length + 1}`,
      completed: false,
      createdAt: new Date()
    }];
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map(task =>
      task.id === id ? {...task, completed: !task.completed} : task
    );
  }
}
```

### 🚀 Paso 5: Componente con OnPush + Signals

**Archivo:** `src/app/components/task-list-onpush/task-list-onpush.component.ts`

```typescript
@Component({
  selector: 'app-task-list-onpush',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ OnPush activado
  template: `
    <div class="task-list onpush-strategy">
      <h3>⚡ OnPush + Signals</h3>
      <div class="render-badge">Renders: {{ renderCount() }}</div>

      <button (click)="addTask()">➕ Agregar Tarea</button>

      <div class="tasks">
        @for (task of tasks(); track task.id) {
          <div class="task-item">
            <input type="checkbox"
                   [checked]="task.completed"
                   (change)="toggleTask(task.id)">
            <span>{{ task.title }}</span>
          </div>
        } @empty {
          <p>No hay tareas</p>
        }
      </div>

      <!-- Métricas adicionales con computed signals -->
      <div class="stats">
        Total: {{ totalTasks() }} |
        Completadas: {{ completedTasks() }} |
        Progreso: {{ progress() }}%
      </div>
    </div>
  `,
  styles: [`
    .onpush-strategy {
      border: 2px solid #28a745;
      padding: 20px;
      border-radius: 8px;
    }
    .render-badge {
      background: #28a745;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 10px;
    }
  `]
})
export class TaskListOnPushComponent {
  // 🎯 Signals privados
  private readonly _tasks = signal<Task[]>([]);
  private readonly _renderCount = signal(0);

  // 📊 Signals públicos readonly
  readonly tasks = this._tasks.asReadonly();
  readonly renderCount = this._renderCount.asReadonly();

  // 🧮 Computed signals (se recalculan automáticamente)
  readonly totalTasks = computed(() => this._tasks().length);
  readonly completedTasks = computed(() =>
    this._tasks().filter(t => t.completed).length
  );
  readonly progress = computed(() => {
    const total = this.totalTasks();
    return total > 0
      ? Math.round((this.completedTasks() / total) * 100)
      : 0;
  });

  constructor(private perfService: PerformanceService) {
    // Inicializar con tareas
    this.addTask();
    this.addTask();

    // Effect para tracking (solo se ejecuta cuando cambia _tasks)
    effect(() => {
      // Acceder al signal dispara el tracking
      const taskCount = this._tasks().length;
      this._renderCount.update(c => c + 1);
      this.perfService.trackRender('TaskListOnPush');
    });
  }

  addTask(): void {
    this._tasks.update(tasks => [...tasks, {
      id: Date.now(),
      title: `Tarea ${tasks.length + 1}`,
      completed: false,
      createdAt: new Date()
    }]);
  }

  toggleTask(id: number): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task
      )
    );
  }
}
```

### 🎮 Paso 6: Integrar en App Component

**Archivo:** `src/app/app.component.ts`

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TaskListDefaultComponent,
    TaskListOnPushComponent,
    CommonModule
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>🔄 Change Detection: Comparación en Vivo</h1>
        <div class="global-counter">
          <button (click)="incrementGlobalCounter()">
            Contador Global: {{ globalCounter() }}
          </button>
          <span class="hint">
            👆 Click aquí y observa qué componentes se re-renderizan
          </span>
        </div>
      </header>

      <main class="comparison-grid">
        <app-task-list-default></app-task-list-default>
        <app-task-list-onpush></app-task-list-onpush>
      </main>

      <footer class="metrics">
        <h3>📊 Métricas Totales</h3>
        <p>Total de renders: {{ perfService.totalRenders() }}</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .global-counter {
      margin: 20px 0;
      padding: 20px;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .global-counter button {
      padding: 10px 20px;
      font-size: 1.1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .hint {
      display: block;
      margin-top: 10px;
      color: #666;
      font-size: 0.9rem;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    .metrics {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
  `]
})
export class AppComponent {
  readonly globalCounter = signal(0);

  constructor(readonly perfService: PerformanceService) {}

  incrementGlobalCounter(): void {
    this.globalCounter.update(c => c + 1);
  }
}
```

---

## 🧪 Parte 3: Experimentación y Análisis (10 min)

### 🔬 Experimento 1: Contador Global
1. **Click en "Contador Global"** varias veces
2. **Observa:** ¿Cuál lista se re-renderiza?
3. **Resultado esperado:**
   - Default: Se re-renderiza con CADA click
   - OnPush: NO se re-renderiza (no es su estado)

### 🔬 Experimento 2: Interacción con Tareas
1. **Agrega tareas** en ambas listas
2. **Marca tareas** como completadas
3. **Observa:** Los contadores de renders
4. **Resultado esperado:**
   - Default: Múltiples renders innecesarios
   - OnPush: Solo renderiza cuando SU estado cambia

### 🔬 Experimento 3: Chrome DevTools
1. Abre Chrome DevTools → Performance
2. Inicia grabación
3. Interactúa con la app por 10 segundos
4. Detén y analiza el flame chart

### 📊 Análisis de Resultados

| Métrica | Default Strategy | OnPush + Signals | Mejora |
|---------|-----------------|------------------|--------|
| Renders al iniciar | 3 | 1 | 66% menos |
| Renders por interacción global | 1 | 0 | 100% menos |
| Renders por interacción local | 2 | 1 | 50% menos |
| Tiempo de CPU | ~15ms | ~5ms | 66% menos |

---

## ❓ Preguntas de Comprensión

1. **¿Por qué Default Strategy re-renderiza más?**
   - Respuesta: Angular no sabe qué cambió, así que verifica TODO

2. **¿Cuándo deberías usar OnPush?**
   - Respuesta: En componentes que reciben datos inmutables o usan Signals

3. **¿Qué ventaja adicional dan los Signals?**
   - Respuesta: Reactividad granular - solo recalcula lo necesario

4. **¿Por qué usamos `track` en @for?**
   - Respuesta: Para que Angular identifique elementos únicos y no los recree

---

## 🎯 Desafíos Adicionales

### Desafío 1: Agregar un Performance Monitor
Crea un componente que muestre:
- Renders por segundo
- Tiempo promedio de render
- Gráfico de rendimiento

### Desafío 2: Implementar Virtual Scrolling
Para listas de 1000+ elementos:
- Usa CDK Virtual Scrolling
- Compara rendimiento

### Desafío 3: Agregar Web Workers
Mueve cálculos pesados a Web Workers:
- Filtrado de tareas
- Ordenamiento
- Búsqueda

---

## 📚 Recursos de Consulta

- [Angular Change Detection Guide](https://angular.dev/guide/change-detection)
- [Signals Documentation](https://angular.dev/guide/signals)
- [Performance Best Practices](https://angular.dev/best-practices/performance)

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la diferencia entre Default y OnPush
- [ ] Sé implementar componentes con Signals
- [ ] Puedo medir el rendimiento de mis componentes
- [ ] Comprendo cuándo usar cada estrategia
- [ ] Domino el control flow moderno (@for, @if, @switch)

---

## 🏁 Conclusión

**Recuerda:**
- OnPush + Signals = ⚡ Performance
- Mide siempre antes de optimizar
- No todos los componentes necesitan OnPush
- Los Signals simplifican el estado reactivo

**Próximo paso:** Aplicar estos conceptos en el proyecto del Campus Virtual
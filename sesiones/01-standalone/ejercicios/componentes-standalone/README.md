# 🎨 Ejercicio: Componentes Standalone Avanzados

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Crear componentes standalone complejos con comunicación
- Implementar inputs/outputs entre componentes standalone
- Usar dependency injection en componentes standalone
- Gestionar estado local con signals en componentes standalone

## ⏱️ Duración: 45 minutos

---

## 📚 Parte 1: Conceptos Avanzados (10 min)

### 🤔 ¿Qué vamos a construir?
Una **aplicación de gestión de tareas** que demuestra:
- **Comunicación entre componentes** standalone
- **Inyección de dependencias** sin módulos
- **Gestión de estado** con signals
- **Reutilización** de componentes

### 🎯 ¿Por qué este ejercicio?
- Demuestra patrones reales de desarrollo
- Enseña comunicación component-to-component
- Muestra el poder de la inyección de dependencias
- Prepara para arquitecturas escalables

---

## 🛠️ Parte 2: Construcción Progresiva (30 min)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular
ng new task-manager-standalone --standalone --style=scss --routing=false
cd task-manager-standalone

# 3. Copiar snippets del curso
# Descargar: https://github.com/tu-repo/curso-angular-20-avanzado
# Copiar: .vscode/snippets/ al proyecto
```

#### **Opción B: Local dentro del ejercicio**
```bash
# Desde la carpeta del ejercicio: sesiones/01-standalone/ejercicios/componentes-standalone/
ng new task-manager-standalone --standalone --style=scss --routing=false
cd task-manager-standalone
# Los snippets del curso ya están disponibles automáticamente
```

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-standalone`**: Componente standalone base
- **`ng20-input-output`**: Componente con inputs y outputs
- **`ng20-service`**: Servicio injectable
- **`ng20-signals`**: Signals reactivos
- **`ng20-inject`**: Inyección de dependencias

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📝 Paso 2: Modelo de Datos

**Archivo:** `src/app/models/task.model.ts`

```typescript
// 🎯 Modelo de datos para nuestras tareas
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

export interface TaskFilter {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  search: string;
}
```

### 🛠️ Paso 3: Servicio de Gestión de Tareas

**Archivo:** `src/app/services/task.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskFilter } from '../models/task.model';

@Injectable({
  providedIn: 'root' // 🎯 Servicio standalone, sin módulos
})
export class TaskService {
  // 📊 Estado privado con signals
  private readonly _tasks = signal<Task[]>([]);
  private readonly _filter = signal<TaskFilter>({
    status: 'all',
    priority: 'all',
    search: ''
  });

  // 🔗 Signals públicos readonly
  readonly tasks = this._tasks.asReadonly();
  readonly filter = this._filter.asReadonly();

  // 🧮 Computed signals para datos derivados
  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const filter = this._filter();

    return tasks.filter(task => {
      // Filtro por estado
      if (filter.status === 'pending' && task.completed) return false;
      if (filter.status === 'completed' && !task.completed) return false;

      // Filtro por prioridad
      if (filter.priority !== 'all' && task.priority !== filter.priority) return false;

      // Filtro por búsqueda
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;

      return true;
    });
  });

  readonly taskStats = computed(() => {
    const tasks = this._tasks();
    return {
      total: tasks.length,
      pending: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };
  });

  constructor() {
    // 🎯 Datos iniciales para demo
    this.loadMockData();
  }

  // 📝 Métodos CRUD
  addTask(taskData: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date()
    };

    this._tasks.update(tasks => [...tasks, newTask]);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }

  deleteTask(id: string): void {
    this._tasks.update(tasks =>
      tasks.filter(task => task.id !== id)
    );
  }

  toggleTaskCompletion(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  updateFilter(filter: Partial<TaskFilter>): void {
    this._filter.update(current => ({ ...current, ...filter }));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadMockData(): void {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Aprender Standalone Components',
        description: 'Completar el ejercicio de componentes standalone',
        completed: false,
        priority: 'high',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Implementar formulario de tareas',
        description: 'Crear componente para agregar nuevas tareas',
        completed: true,
        priority: 'medium',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Configurar filtros',
        description: 'Permitir filtrar tareas por estado y prioridad',
        completed: false,
        priority: 'low',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    this._tasks.set(mockTasks);
  }
}
```

### 📊 Paso 4: Componente de Estadísticas

**Archivo:** `src/app/components/task-stats/task-stats.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h3>📊 Estadísticas de Tareas</h3>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-number">{{ taskService.taskStats().total }}</div>
          <div class="stat-label">Total</div>
        </div>

        <div class="stat-card pending">
          <div class="stat-number">{{ taskService.taskStats().pending }}</div>
          <div class="stat-label">Pendientes</div>
        </div>

        <div class="stat-card completed">
          <div class="stat-number">{{ taskService.taskStats().completed }}</div>
          <div class="stat-label">Completadas</div>
        </div>

        <div class="stat-card high-priority">
          <div class="stat-number">{{ taskService.taskStats().highPriority }}</div>
          <div class="stat-label">Alta Prioridad</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      text-align: center;
      padding: 1rem;
      border-radius: 6px;
      border: 2px solid;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .total {
      border-color: #6c757d;
      background: #f8f9fa;
      color: #6c757d;
    }

    .pending {
      border-color: #ffc107;
      background: #fff3cd;
      color: #856404;
    }

    .completed {
      border-color: #28a745;
      background: #d4edda;
      color: #155724;
    }

    .high-priority {
      border-color: #dc3545;
      background: #f8d7da;
      color: #721c24;
    }
  `]
})
export class TaskStatsComponent {
  // 🎯 Inyección directa del servicio
  readonly taskService = inject(TaskService);
}
```

### 🔍 Paso 5: Componente de Filtros

**Archivo:** `src/app/components/task-filter/task-filter.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <h3>🔍 Filtros</h3>

      <div class="filter-grid">
        <div class="filter-group">
          <label for="status">Estado:</label>
          <select
            id="status"
            [value]="taskService.filter().status"
            (change)="updateStatus($event)">
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="priority">Prioridad:</label>
          <select
            id="priority"
            [value]="taskService.filter().priority"
            (change)="updatePriority($event)">
            <option value="all">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        <div class="filter-group search-group">
          <label for="search">Buscar:</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar tareas..."
            [value]="taskService.filter().search"
            (input)="updateSearch($event)">
        </div>
      </div>

      <div class="filter-summary">
        Mostrando {{ taskService.filteredTasks().length }} de {{ taskService.tasks().length }} tareas
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .search-group {
      grid-column: 1 / -1;
    }

    label {
      font-weight: 600;
      color: #555;
    }

    select, input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    select:focus, input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .filter-summary {
      text-align: center;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      color: #6c757d;
      font-size: 0.9rem;
    }
  `]
})
export class TaskFilterComponent {
  readonly taskService = inject(TaskService);

  updateStatus(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.taskService.updateFilter({
      status: target.value as 'all' | 'pending' | 'completed'
    });
  }

  updatePriority(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.taskService.updateFilter({
      priority: target.value as 'all' | 'low' | 'medium' | 'high'
    });
  }

  updateSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.taskService.updateFilter({ search: target.value });
  }
}
```

### 📝 Paso 6: Componente de Lista de Tareas

**Archivo:** `src/app/components/task-list/task-list.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list-container">
      <h3>📋 Lista de Tareas</h3>

      @if (taskService.filteredTasks().length === 0) {
        <div class="empty-state">
          <p>No hay tareas que coincidan con los filtros</p>
        </div>
      } @else {
        <div class="task-list">
          @for (task of taskService.filteredTasks(); track task.id) {
            <div class="task-item" [class.completed]="task.completed">
              <div class="task-checkbox">
                <input
                  type="checkbox"
                  [checked]="task.completed"
                  (change)="toggleTask(task.id)">
              </div>

              <div class="task-content">
                <h4 class="task-title">{{ task.title }}</h4>
                <p class="task-description">{{ task.description }}</p>

                <div class="task-meta">
                  <span class="priority-badge" [class]="'priority-' + task.priority">
                    {{ getPriorityLabel(task.priority) }}
                  </span>

                  <span class="created-date">
                    Creada: {{ formatDate(task.createdAt) }}
                  </span>

                  @if (task.dueDate) {
                    <span class="due-date" [class.overdue]="isOverdue(task)">
                      Vence: {{ formatDate(task.dueDate) }}
                    </span>
                  }
                </div>
              </div>

              <div class="task-actions">
                <button
                  class="delete-btn"
                  (click)="deleteTask(task.id)"
                  title="Eliminar tarea">
                  🗑️
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .task-list-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .task-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-color: #dee2e6;
    }

    .task-item.completed {
      opacity: 0.7;
      background: #f8f9fa;
    }

    .task-item.completed .task-title {
      text-decoration: line-through;
    }

    .task-checkbox input {
      width: 1.2rem;
      height: 1.2rem;
      margin-top: 0.2rem;
    }

    .task-content {
      flex: 1;
    }

    .task-title {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .task-description {
      margin: 0 0 0.5rem 0;
      color: #6c757d;
      line-height: 1.4;
    }

    .task-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .priority-badge {
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .priority-high {
      background: #f8d7da;
      color: #721c24;
    }

    .priority-medium {
      background: #fff3cd;
      color: #856404;
    }

    .priority-low {
      background: #d4edda;
      color: #155724;
    }

    .created-date, .due-date {
      color: #6c757d;
    }

    .due-date.overdue {
      color: #dc3545;
      font-weight: 600;
    }

    .task-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .delete-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .delete-btn:hover {
      background: #f8d7da;
    }
  `]
})
export class TaskListComponent {
  readonly taskService = inject(TaskService);

  toggleTask(id: string): void {
    this.taskService.toggleTaskCompletion(id);
  }

  deleteTask(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(id);
    }
  }

  getPriorityLabel(priority: Task['priority']): string {
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return labels[priority];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES');
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date() > task.dueDate;
  }
}
```

### 🎯 Paso 7: Integración en AppComponent

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskStatsComponent } from './components/task-stats/task-stats.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TaskStatsComponent,
    TaskFilterComponent,
    TaskListComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>📋 Gestor de Tareas Standalone</h1>
        <p>Demostración de componentes standalone avanzados</p>
      </header>

      <main class="app-main">
        <app-task-stats></app-task-stats>
        <app-task-filter></app-task-filter>
        <app-task-list></app-task-list>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .app-header {
      background: #007bff;
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

    .app-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Gestor de Tareas Standalone';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Reactividad de Signals
1. **Cambia filtros** y observa cómo se actualizan automáticamente las estadísticas
2. **Marca tareas como completadas** y ve el cambio en tiempo real
3. **Elimina tareas** y observa cómo se recalculan los totales

### 🔬 Experimento 2: Inyección de Dependencias
Intenta inyectar el servicio de diferentes maneras:
```typescript
// Opción 1: inject() function (recomendado)
readonly taskService = inject(TaskService);

// Opción 2: Constructor injection
constructor(private taskService: TaskService) {}
```

### 🔬 Experimento 3: Performance
Abre las DevTools y observa:
- ¿Cuántas veces se re-renderiza cada componente?
- ¿Cómo afecta el cambio de un filtro a otros componentes?

---

## ❓ Preguntas de Comprensión

1. **¿Cómo se comunican los componentes standalone entre sí?**

2. **¿Qué ventajas tienen los computed signals sobre métodos tradicionales?**

3. **¿Por qué no necesitamos providers en módulos para servicios standalone?**

4. **¿Cuándo usarías inject() vs constructor injection?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Formulario de Nueva Tarea
Crea un componente para agregar nuevas tareas que:
- Use reactive forms
- Valide los campos requeridos
- Emita eventos al componente padre

### Desafío 2: Persistencia de Datos
Implementa persistencia que:
- Guarde tareas en localStorage
- Restaure el estado al cargar la app
- Maneje errores de storage

### Desafío 3: Componente de Edición
Añade funcionalidad de edición que:
- Permita editar tareas inline
- Use el patrón "edit mode" con formularios
- Guarde/cancele cambios

---

## ✅ Checklist de Aprendizaje

- [ ] Comprendo la comunicación entre componentes standalone
- [ ] Sé usar inyección de dependencias sin módulos
- [ ] Domino el patrón de servicios con signals
- [ ] Puedo crear computed signals complejos
- [ ] Entiendo el ciclo de vida de los datos reactivos

---

## 🏁 Conclusión

**Recuerda:**
- Los componentes standalone se comunican via servicios compartidos
- Los signals proveen reactividad automática y optimizada
- La inyección de dependencias funciona igual, pero más simple
- Los computed signals son fundamentales para datos derivados

**Próximo paso:** Explorar routing avanzado con componentes standalone
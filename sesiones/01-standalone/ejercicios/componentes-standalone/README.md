# 🧩 Ejercicio: Componentes Standalone Avanzados

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Manejar comunicación entre componentes standalone
- Implementar gestión de estado con signals
- Crear servicios optimizados para standalone
- Aplicar patterns de composición avanzados

## ⏱️ Duración: 45 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Cómo se comunican los Standalone Components?
Los componentes standalone usan los mismos patrones que los tradicionales:
- **Input/Output**: Para comunicación parent-child
- **Services**: Para estado compartido y lógica de negocio
- **Signals**: Para reactividad moderna y optimizada
- **ViewChild/ContentChild**: Para acceso directo a componentes

### 🎯 Ventajas del Patrón Standalone
- **Explicit dependencies**: Solo importas lo que necesitas
- **Better tree-shaking**: Eliminación automática de código no usado
- **Simpler testing**: Menos setup, más focus en la lógica
- **Improved performance**: Bundle optimization automática

### 📖 Patterns Avanzados

```typescript
// 🔄 Service con Signals
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();

  addTask(task: Task) {
    this._tasks.update(tasks => [...tasks, task]);
  }
}

// 🧩 Component con Service injection
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `...`
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  readonly tasks = this.taskService.tasks;
}
```

---

## 🛠️ Parte 2: Hands-On - Task Management App (30 min)

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-service`**: Servicio con signals
- **`ng20-standalone`**: Componente standalone con inputs/outputs
- **`ng20-inject`**: Injection moderna con inject()

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone
ng new task-manager --standalone --style=scss --routing=false
cd task-manager

# 3. Instalar dependencias
npm install
```

### 🎯 Paso 2: Task Service con Signals

**Archivo:** `src/app/services/task.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  dueDate?: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: Record<Task['priority'], number>;
  byCategory: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // 📊 Estado privado con signals
  private readonly _tasks = signal<Task[]>([]);
  private readonly _filter = signal<string>('all');
  private readonly _searchTerm = signal<string>('');
  private readonly _sortBy = signal<keyof Task>('createdAt');
  private readonly _sortOrder = signal<'asc' | 'desc'>('desc');

  // 🔗 Signals públicos readonly
  readonly tasks = this._tasks.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly sortOrder = this._sortOrder.asReadonly();

  // 🧮 Computed signals para estadísticas
  readonly taskStats = computed((): TaskStats => {
    const tasks = this._tasks();
    const now = new Date();

    const stats: TaskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t =>
        !t.completed && t.dueDate && t.dueDate < now
      ).length,
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length
      },
      byCategory: {}
    };

    // Calcular por categoría
    tasks.forEach(task => {
      stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
    });

    return stats;
  });

  // 🧮 Computed para tasks filtradas
  readonly filteredTasks = computed(() => {
    let filtered = this._tasks();
    const filter = this._filter();
    const searchTerm = this._searchTerm().toLowerCase();

    // Aplicar filtro por estado
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'overdue') {
      const now = new Date();
      filtered = filtered.filter(task =>
        !task.completed && task.dueDate && task.dueDate < now
      );
    }

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar ordenamiento
    const sortBy = this._sortBy();
    const sortOrder = this._sortOrder();

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'createdAt' || sortBy === 'dueDate') {
        const aDate = a[sortBy] || new Date(0);
        const bDate = b[sortBy] || new Date(0);
        comparison = aDate.getTime() - bDate.getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        comparison = String(a[sortBy]).localeCompare(String(b[sortBy]));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  });

  // 🧮 Computed para categorías disponibles
  readonly categories = computed(() => {
    const cats = new Set(this._tasks().map(task => task.category));
    return Array.from(cats).sort();
  });

  constructor() {
    // 🎯 Cargar tareas de ejemplo
    this.loadSampleTasks();
  }

  // 📝 Métodos para gestionar tareas
  addTask(taskData: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...taskData,
      id: Math.max(0, ...this._tasks().map(t => t.id)) + 1,
      createdAt: new Date()
    };

    this._tasks.update(tasks => [...tasks, newTask]);
  }

  updateTask(id: number, updates: Partial<Task>): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }

  deleteTask(id: number): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  toggleTask(id: number): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  // 🔍 Métodos para filtrado y búsqueda
  setFilter(filter: string): void {
    this._filter.set(filter);
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  setSorting(sortBy: keyof Task, sortOrder: 'asc' | 'desc'): void {
    this._sortBy.set(sortBy);
    this._sortOrder.set(sortOrder);
  }

  // 🎯 Cargar datos de ejemplo
  private loadSampleTasks(): void {
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: 'Aprender Angular 20',
        description: 'Completar el curso de standalone components',
        completed: false,
        priority: 'high',
        category: 'Educación',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // En 7 días
      },
      {
        id: 2,
        title: 'Implementar proyecto campus',
        description: 'Desarrollar la aplicación de campus virtual',
        completed: false,
        priority: 'medium',
        category: 'Trabajo',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // En 14 días
      },
      {
        id: 3,
        title: 'Comprar groceries',
        description: 'Leche, pan, frutas y verduras',
        completed: true,
        priority: 'low',
        category: 'Personal',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      },
      {
        id: 4,
        title: 'Revisar documentación',
        description: 'Leer la nueva documentación de Angular',
        completed: false,
        priority: 'medium',
        category: 'Educación',
        createdAt: new Date(),
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Vencida (ayer)
      }
    ];

    this._tasks.set(sampleTasks);
  }
}
```

### 📊 Paso 3: Task Stats Component

**Archivo:** `src/app/components/task-stats/task-stats.component.ts`

```typescript
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h2>📊 Estadísticas de Tareas</h2>

      <!-- 📈 Estadísticas principales -->
      <div class="main-stats">
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().total }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>

        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().completed }}</span>
            <span class="stat-label">Completadas</span>
          </div>
        </div>

        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().pending }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>

        <div class="stat-card overdue">
          <div class="stat-icon">🚨</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().overdue }}</span>
            <span class="stat-label">Vencidas</span>
          </div>
        </div>
      </div>

      <!-- 🎯 Estadísticas por prioridad -->
      <div class="priority-stats">
        <h3>Por Prioridad</h3>
        <div class="priority-bars">
          <div class="priority-bar high">
            <span class="priority-label">🔴 Alta</span>
            <div class="priority-progress">
              <div
                class="priority-fill high"
                [style.width.%]="getPriorityPercentage('high')"
              ></div>
            </div>
            <span class="priority-count">{{ stats().byPriority.high }}</span>
          </div>

          <div class="priority-bar medium">
            <span class="priority-label">🟡 Media</span>
            <div class="priority-progress">
              <div
                class="priority-fill medium"
                [style.width.%]="getPriorityPercentage('medium')"
              ></div>
            </div>
            <span class="priority-count">{{ stats().byPriority.medium }}</span>
          </div>

          <div class="priority-bar low">
            <span class="priority-label">🟢 Baja</span>
            <div class="priority-progress">
              <div
                class="priority-fill low"
                [style.width.%]="getPriorityPercentage('low')"
              ></div>
            </div>
            <span class="priority-count">{{ stats().byPriority.low }}</span>
          </div>
        </div>
      </div>

      <!-- 📂 Estadísticas por categoría -->
      <div class="category-stats">
        <h3>Por Categoría</h3>
        <div class="category-list">
          @for (category of categoryStats(); track category.name) {
            <div class="category-item">
              <span class="category-name">{{ category.name }}</span>
              <div class="category-progress">
                <div
                  class="category-fill"
                  [style.width.%]="category.percentage"
                ></div>
              </div>
              <span class="category-count">{{ category.count }}</span>
            </div>
          }

          @if (categoryStats().length === 0) {
            <p class="no-categories">No hay categorías aún</p>
          }
        </div>
      </div>

      <!-- 📈 Porcentaje de completado -->
      <div class="completion-section">
        <h3>Progreso General</h3>
        <div class="completion-circle">
          <svg class="progress-ring" width="120" height="120">
            <circle
              class="progress-ring-background"
              stroke="#e9ecef"
              stroke-width="8"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
            <circle
              class="progress-ring-progress"
              stroke="#28a745"
              stroke-width="8"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
              [style.stroke-dasharray]="circumference + ' ' + circumference"
              [style.stroke-dashoffset]="completionOffset()"
            />
          </svg>
          <div class="progress-text">
            <span class="progress-percentage">{{ completionPercentage() }}%</span>
            <span class="progress-label">Completado</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .stats-container h2 {
      margin: 0 0 1.5rem 0;
      color: #343a40;
      font-size: 1.5rem;
    }

    .stats-container h3 {
      margin: 1.5rem 0 1rem 0;
      color: #495057;
      font-size: 1.2rem;
    }

    .main-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-left: 4px solid;
    }

    .stat-card.total {
      border-left-color: #007bff;
    }

    .stat-card.completed {
      border-left-color: #28a745;
    }

    .stat-card.pending {
      border-left-color: #ffc107;
    }

    .stat-card.overdue {
      border-left-color: #dc3545;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #343a40;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #6c757d;
    }

    .priority-stats, .category-stats {
      margin-bottom: 2rem;
    }

    .priority-bars {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .priority-bar {
      display: grid;
      grid-template-columns: 80px 1fr 40px;
      align-items: center;
      gap: 1rem;
    }

    .priority-label {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .priority-progress {
      background: #e9ecef;
      border-radius: 10px;
      height: 8px;
      overflow: hidden;
    }

    .priority-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .priority-fill.high {
      background: #dc3545;
    }

    .priority-fill.medium {
      background: #ffc107;
    }

    .priority-fill.low {
      background: #28a745;
    }

    .priority-count {
      font-weight: 500;
      text-align: center;
      color: #495057;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-item {
      display: grid;
      grid-template-columns: 1fr 2fr 40px;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .category-name {
      font-weight: 500;
      color: #495057;
    }

    .category-progress {
      background: #e9ecef;
      border-radius: 10px;
      height: 6px;
      overflow: hidden;
    }

    .category-fill {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .category-count {
      font-weight: 500;
      text-align: center;
      color: #495057;
      font-size: 0.9rem;
    }

    .no-categories {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      padding: 1rem;
    }

    .completion-section {
      text-align: center;
    }

    .completion-circle {
      position: relative;
      display: inline-block;
    }

    .progress-ring {
      transform: rotate(-90deg);
    }

    .progress-ring-progress {
      transition: stroke-dashoffset 0.5s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .progress-percentage {
      font-size: 1.5rem;
      font-weight: bold;
      color: #28a745;
    }

    .progress-label {
      font-size: 0.8rem;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .main-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .priority-bar {
        grid-template-columns: 60px 1fr 30px;
      }

      .category-item {
        grid-template-columns: 1fr 1fr 30px;
      }
    }
  `]
})
export class TaskStatsComponent {
  private taskService = inject(TaskService);

  // 🔗 Computed signals del servicio
  readonly stats = this.taskService.taskStats;

  // 🧮 Computed para categorías con porcentajes
  readonly categoryStats = computed(() => {
    const stats = this.stats();
    const total = stats.total;

    return Object.entries(stats.byCategory)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  });

  // 🧮 Computed para progreso circular
  readonly completionPercentage = computed(() => {
    const stats = this.stats();
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  });

  readonly circumference = 2 * Math.PI * 52; // radio = 52

  readonly completionOffset = computed(() => {
    const percentage = this.completionPercentage();
    return this.circumference - (percentage / 100) * this.circumference;
  });

  // 📊 Helper para porcentajes de prioridad
  getPriorityPercentage(priority: 'low' | 'medium' | 'high'): number {
    const stats = this.stats();
    if (stats.total === 0) return 0;
    return Math.round((stats.byPriority[priority] / stats.total) * 100);
  }
}
```

### 🔍 Paso 4: Task Filter Component

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
      <h3>🔍 Filtros y Búsqueda</h3>

      <!-- 🔍 Búsqueda -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchValue"
            (input)="onSearchChange()"
            placeholder="Buscar tareas..."
            class="search-input"
          >
          @if (searchValue) {
            <button
              (click)="clearSearch()"
              class="clear-search"
              title="Limpiar búsqueda"
            >
              ❌
            </button>
          }
        </div>
      </div>

      <!-- 📋 Filtros por estado -->
      <div class="filter-section">
        <h4>Estado</h4>
        <div class="filter-buttons">
          <button
            (click)="setFilter('all')"
            [class.active]="currentFilter() === 'all'"
            class="filter-btn"
          >
            📋 Todas ({{ taskService.tasks().length }})
          </button>
          <button
            (click)="setFilter('pending')"
            [class.active]="currentFilter() === 'pending'"
            class="filter-btn"
          >
            ⏳ Pendientes ({{ pendingCount() }})
          </button>
          <button
            (click)="setFilter('completed')"
            [class.active]="currentFilter() === 'completed'"
            class="filter-btn"
          >
            ✅ Completadas ({{ completedCount() }})
          </button>
          <button
            (click)="setFilter('overdue')"
            [class.active]="currentFilter() === 'overdue'"
            class="filter-btn overdue"
          >
            🚨 Vencidas ({{ overdueCount() }})
          </button>
        </div>
      </div>

      <!-- 📂 Filtro por categoría -->
      <div class="category-section">
        <h4>Categorías</h4>
        <div class="category-pills">
          @for (category of taskService.categories(); track category) {
            <button
              (click)="searchByCategory(category)"
              class="category-pill"
              [title]="'Filtrar por ' + category"
            >
              📂 {{ category }}
            </button>
          }

          @if (taskService.categories().length === 0) {
            <p class="no-categories">No hay categorías disponibles</p>
          }
        </div>
      </div>

      <!-- 🔢 Ordenamiento -->
      <div class="sort-section">
        <h4>Ordenamiento</h4>
        <div class="sort-controls">
          <select
            [(ngModel)]="sortByValue"
            (change)="onSortChange()"
            class="sort-select"
          >
            <option value="createdAt">Fecha de creación</option>
            <option value="title">Título</option>
            <option value="priority">Prioridad</option>
            <option value="dueDate">Fecha límite</option>
            <option value="category">Categoría</option>
          </select>

          <button
            (click)="toggleSortOrder()"
            class="sort-order-btn"
            [title]="sortOrderValue === 'asc' ? 'Ascendente' : 'Descendente'"
          >
            {{ sortOrderValue === 'asc' ? '⬆️' : '⬇️' }}
            {{ sortOrderValue === 'asc' ? 'ASC' : 'DESC' }}
          </button>
        </div>
      </div>

      <!-- 📊 Resultados -->
      <div class="results-section">
        <div class="results-info">
          <span class="results-count">
            {{ filteredCount() }} resultado{{ filteredCount() !== 1 ? 's' : '' }}
          </span>
          @if (searchValue || currentFilter() !== 'all') {
            <button (click)="clearAllFilters()" class="clear-filters">
              🧹 Limpiar filtros
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .filter-container h3 {
      margin: 0 0 1.5rem 0;
      color: #343a40;
      font-size: 1.3rem;
    }

    .filter-container h4 {
      margin: 1rem 0 0.5rem 0;
      color: #495057;
      font-size: 1rem;
    }

    .search-section {
      margin-bottom: 1.5rem;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: #6c757d;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 0.75rem 0.75rem 2.5rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .clear-search {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.8rem;
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .clear-search:hover {
      opacity: 1;
    }

    .filter-section {
      margin-bottom: 1.5rem;
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 20px;
      background: white;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .filter-btn:hover {
      border-color: #007bff;
      background: #f8f9fa;
    }

    .filter-btn.active {
      background: #007bff;
      border-color: #007bff;
      color: white;
    }

    .filter-btn.overdue.active {
      background: #dc3545;
      border-color: #dc3545;
    }

    .category-section {
      margin-bottom: 1.5rem;
    }

    .category-pills {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .category-pill {
      padding: 0.4rem 0.8rem;
      border: 1px solid #d0d7de;
      border-radius: 15px;
      background: #f6f8fa;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.3s;
    }

    .category-pill:hover {
      background: #e9ecef;
      border-color: #6c757d;
    }

    .no-categories {
      color: #6c757d;
      font-style: italic;
      font-size: 0.9rem;
      margin: 0;
    }

    .sort-section {
      margin-bottom: 1.5rem;
    }

    .sort-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .sort-select {
      flex: 1;
      padding: 0.5rem;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      background: white;
      font-size: 0.9rem;
    }

    .sort-select:focus {
      outline: none;
      border-color: #007bff;
    }

    .sort-order-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .sort-order-btn:hover {
      border-color: #007bff;
      background: #f8f9fa;
    }

    .results-section {
      border-top: 1px solid #e9ecef;
      padding-top: 1rem;
    }

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .results-count {
      font-weight: 500;
      color: #495057;
    }

    .clear-filters {
      padding: 0.4rem 0.8rem;
      border: 1px solid #dc3545;
      border-radius: 6px;
      background: white;
      color: #dc3545;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.3s;
    }

    .clear-filters:hover {
      background: #dc3545;
      color: white;
    }

    @media (max-width: 768px) {
      .filter-buttons {
        flex-direction: column;
      }

      .filter-btn {
        text-align: center;
      }

      .sort-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .results-info {
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
    }
  `]
})
export class TaskFilterComponent {
  taskService = inject(TaskService);

  // 📊 Estado local para inputs
  searchValue = '';
  sortByValue: keyof Task = 'createdAt';
  sortOrderValue: 'asc' | 'desc' = 'desc';

  // 🔗 Referencias a signals del servicio
  readonly currentFilter = this.taskService.filter;
  readonly filteredCount = computed(() => this.taskService.filteredTasks().length);

  // 🧮 Computed para contadores
  readonly pendingCount = computed(() =>
    this.taskService.tasks().filter(t => !t.completed).length
  );

  readonly completedCount = computed(() =>
    this.taskService.tasks().filter(t => t.completed).length
  );

  readonly overdueCount = computed(() => {
    const now = new Date();
    return this.taskService.tasks().filter(t =>
      !t.completed && t.dueDate && t.dueDate < now
    ).length;
  });

  // 📝 Métodos de filtrado
  setFilter(filter: string): void {
    this.taskService.setFilter(filter);
  }

  onSearchChange(): void {
    this.taskService.setSearchTerm(this.searchValue);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.taskService.setSearchTerm('');
  }

  searchByCategory(category: string): void {
    this.searchValue = category;
    this.taskService.setSearchTerm(category);
  }

  // 📊 Métodos de ordenamiento
  onSortChange(): void {
    this.taskService.setSorting(this.sortByValue, this.sortOrderValue);
  }

  toggleSortOrder(): void {
    this.sortOrderValue = this.sortOrderValue === 'asc' ? 'desc' : 'asc';
    this.taskService.setSorting(this.sortByValue, this.sortOrderValue);
  }

  // 🧹 Limpiar filtros
  clearAllFilters(): void {
    this.searchValue = '';
    this.taskService.setSearchTerm('');
    this.taskService.setFilter('all');
  }
}
```

### 📋 Paso 5: Task List Component

**Archivo:** `src/app/components/task-list/task-list.component.ts`

```typescript
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list-container">
      <div class="list-header">
        <h3>📋 Lista de Tareas</h3>
        <span class="task-count">{{ filteredTasks().length }} tarea{{ filteredTasks().length !== 1 ? 's' : '' }}</span>
      </div>

      <div class="task-list">
        @for (task of filteredTasks(); track task.id) {
          <div
            class="task-item"
            [class.completed]="task.completed"
            [class.overdue]="isOverdue(task)"
            [class.priority-high]="task.priority === 'high'"
            [class.priority-medium]="task.priority === 'medium'"
            [class.priority-low]="task.priority === 'low'"
          >
            <!-- ✅ Checkbox y contenido principal -->
            <div class="task-main">
              <button
                (click)="toggleTask(task.id)"
                class="task-checkbox"
                [class.checked]="task.completed"
                [title]="task.completed ? 'Marcar como pendiente' : 'Marcar como completada'"
              >
                {{ task.completed ? '✅' : '⭕' }}
              </button>

              <div class="task-content">
                <h4 class="task-title" [class.completed-text]="task.completed">
                  {{ task.title }}
                </h4>
                <p class="task-description">{{ task.description }}</p>

                <div class="task-meta">
                  <span class="task-category">📂 {{ task.category }}</span>
                  <span class="task-priority priority-{{ task.priority }}">
                    {{ getPriorityIcon(task.priority) }} {{ task.priority.toUpperCase() }}
                  </span>
                  <span class="task-created">
                    📅 {{ formatDate(task.createdAt) }}
                  </span>
                  @if (task.dueDate) {
                    <span
                      class="task-due"
                      [class.overdue-text]="isOverdue(task)"
                    >
                      ⏰ {{ formatDate(task.dueDate) }}
                    </span>
                  }
                </div>
              </div>
            </div>

            <!-- 🎛️ Acciones -->
            <div class="task-actions">
              <button
                (click)="editTask(task)"
                class="action-btn edit-btn"
                title="Editar tarea"
                [disabled]="task.completed"
              >
                ✏️
              </button>

              <button
                (click)="duplicateTask(task)"
                class="action-btn duplicate-btn"
                title="Duplicar tarea"
              >
                📋
              </button>

              <button
                (click)="deleteTask(task.id)"
                class="action-btn delete-btn"
                title="Eliminar tarea"
              >
                🗑️
              </button>
            </div>
          </div>
        }

        @if (filteredTasks().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h4>No hay tareas</h4>
            <p>{{ getEmptyMessage() }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .list-header {
      background: #f8f9fa;
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-header h3 {
      margin: 0;
      color: #343a40;
      font-size: 1.3rem;
    }

    .task-count {
      color: #6c757d;
      font-weight: 500;
      background: #e9ecef;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
    }

    .task-list {
      max-height: 600px;
      overflow-y: auto;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      padding: 1.5rem;
      border-bottom: 1px solid #f8f9fa;
      transition: all 0.3s;
      border-left: 4px solid transparent;
    }

    .task-item:hover {
      background: #f8f9fa;
    }

    .task-item.completed {
      opacity: 0.7;
      background: #f8f9fa;
    }

    .task-item.overdue {
      border-left-color: #dc3545;
      background: linear-gradient(90deg, #fff5f5 0%, #ffffff 20%);
    }

    .task-item.priority-high {
      border-left-color: #dc3545;
    }

    .task-item.priority-medium {
      border-left-color: #ffc107;
    }

    .task-item.priority-low {
      border-left-color: #28a745;
    }

    .task-main {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex: 1;
    }

    .task-checkbox {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      transition: transform 0.2s;
      padding: 0.2rem;
      border-radius: 4px;
    }

    .task-checkbox:hover {
      transform: scale(1.1);
      background: rgba(0,123,255,0.1);
    }

    .task-content {
      flex: 1;
    }

    .task-title {
      margin: 0 0 0.5rem 0;
      color: #343a40;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .task-title.completed-text {
      text-decoration: line-through;
      color: #6c757d;
    }

    .task-description {
      margin: 0 0 1rem 0;
      color: #495057;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      font-size: 0.85rem;
    }

    .task-meta > span {
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      white-space: nowrap;
    }

    .task-category {
      background: #e3f2fd;
      color: #1976d2;
    }

    .task-priority {
      font-weight: 500;
    }

    .task-priority.priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .task-priority.priority-medium {
      background: #fff8e1;
      color: #f57c00;
    }

    .task-priority.priority-low {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .task-created {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .task-due {
      background: #fff3e0;
      color: #ef6c00;
    }

    .task-due.overdue-text {
      background: #ffebee;
      color: #d32f2f;
      font-weight: 600;
    }

    .task-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .task-item:hover .task-actions {
      opacity: 1;
    }

    .action-btn {
      background: none;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 0.4rem;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background: #f8f9fa;
      transform: scale(1.05);
    }

    .edit-btn:hover {
      background: #e3f2fd;
      border-color: #2196f3;
    }

    .duplicate-btn:hover {
      background: #f3e5f5;
      border-color: #9c27b0;
    }

    .delete-btn:hover {
      background: #ffebee;
      border-color: #f44336;
    }

    .action-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .action-btn:disabled:hover {
      background: none;
      transform: none;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h4 {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .empty-state p {
      margin: 0;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .task-item {
        flex-direction: column;
        gap: 1rem;
      }

      .task-actions {
        flex-direction: row;
        justify-content: center;
        opacity: 1;
      }

      .task-meta {
        justify-content: center;
      }

      .list-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
  `]
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  // 🔗 Signals del servicio
  readonly filteredTasks = this.taskService.filteredTasks;
  readonly currentFilter = this.taskService.filter;

  // 📝 Métodos para manejar tareas
  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
  }

  editTask(task: Task): void {
    // Aquí implementarías la lógica de edición
    // Por ahora, solo un alert simulando
    const newTitle = prompt('Nuevo título:', task.title);
    if (newTitle && newTitle !== task.title) {
      this.taskService.updateTask(task.id, { title: newTitle });
    }
  }

  duplicateTask(task: Task): void {
    const { id, createdAt, ...taskData } = task;
    this.taskService.addTask({
      ...taskData,
      title: `${task.title} (copia)`,
      completed: false
    });
  }

  deleteTask(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(id);
    }
  }

  // 🎨 Helpers para UI
  getPriorityIcon(priority: Task['priority']): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return task.dueDate < new Date();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getEmptyMessage(): string {
    const filter = this.currentFilter();
    switch (filter) {
      case 'completed':
        return 'No tienes tareas completadas aún.';
      case 'pending':
        return 'No tienes tareas pendientes. ¡Bien hecho!';
      case 'overdue':
        return 'No tienes tareas vencidas.';
      default:
        return 'Agrega tu primera tarea para comenzar.';
    }
  }
}
```

### ➕ Paso 6: Add Task Component

**Archivo:** `src/app/components/add-task/add-task.component.ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-task-container">
      <div class="add-task-header">
        <h3>➕ Agregar Nueva Tarea</h3>
        <button
          (click)="toggleForm()"
          class="toggle-btn"
          [class.active]="showForm()"
        >
          {{ showForm() ? '❌ Cancelar' : '➕ Nueva Tarea' }}
        </button>
      </div>

      @if (showForm()) {
        <form (ngSubmit)="onSubmit()" class="task-form">
          <!-- 📝 Título -->
          <div class="form-group">
            <label for="title">Título *</label>
            <input
              id="title"
              type="text"
              [(ngModel)]="title"
              name="title"
              placeholder="Ej: Aprender Angular 20"
              class="form-input"
              required
              #titleInput
            >
          </div>

          <!-- 📄 Descripción -->
          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea
              id="description"
              [(ngModel)]="description"
              name="description"
              placeholder="Describe los detalles de la tarea..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <!-- 📂 Categoría -->
          <div class="form-group">
            <label for="category">Categoría *</label>
            <div class="category-input-wrapper">
              <select
                id="category"
                [(ngModel)]="category"
                name="category"
                class="form-select"
                required
              >
                <option value="">Selecciona una categoría</option>
                @for (cat of availableCategories(); track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
                <option value="nueva">➕ Nueva categoría</option>
              </select>

              @if (category === 'nueva') {
                <input
                  type="text"
                  [(ngModel)]="newCategory"
                  name="newCategory"
                  placeholder="Nombre de la nueva categoría"
                  class="form-input new-category-input"
                  required
                >
              }
            </div>
          </div>

          <!-- 🎯 Prioridad -->
          <div class="form-group">
            <label>Prioridad *</label>
            <div class="priority-buttons">
              <button
                type="button"
                (click)="setPriority('low')"
                [class.active]="priority === 'low'"
                class="priority-btn low"
              >
                🟢 Baja
              </button>
              <button
                type="button"
                (click)="setPriority('medium')"
                [class.active]="priority === 'medium'"
                class="priority-btn medium"
              >
                🟡 Media
              </button>
              <button
                type="button"
                (click)="setPriority('high')"
                [class.active]="priority === 'high'"
                class="priority-btn high"
              >
                🔴 Alta
              </button>
            </div>
          </div>

          <!-- 📅 Fecha límite -->
          <div class="form-group">
            <label for="dueDate">Fecha límite (opcional)</label>
            <input
              id="dueDate"
              type="date"
              [(ngModel)]="dueDateString"
              name="dueDate"
              class="form-input"
              [min]="minDate"
            >
          </div>

          <!-- 🎛️ Botones de acción -->
          <div class="form-actions">
            <button
              type="button"
              (click)="resetForm()"
              class="action-btn cancel-btn"
            >
              🧹 Limpiar
            </button>
            <button
              type="submit"
              [disabled]="!isFormValid()"
              class="action-btn submit-btn"
            >
              ✅ Agregar Tarea
            </button>
          </div>

          <!-- ✅ Mensaje de validación -->
          @if (!isFormValid() && (title || category || priority)) {
            <div class="validation-message">
              <p>⚠️ Por favor completa los campos requeridos:</p>
              <ul>
                @if (!title.trim()) {
                  <li>Título es requerido</li>
                }
                @if (!getFinalCategory()) {
                  <li>Categoría es requerida</li>
                }
                @if (!priority) {
                  <li>Prioridad es requerida</li>
                }
              </ul>
            </div>
          }
        </form>
      }
    </div>
  `,
  styles: [`
    .add-task-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .add-task-header {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .add-task-header h3 {
      margin: 0;
      font-size: 1.3rem;
    }

    .toggle-btn {
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .toggle-btn:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.5);
    }

    .toggle-btn.active {
      background: #dc3545;
      border-color: #dc3545;
    }

    .task-form {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .category-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .new-category-input {
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .priority-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .priority-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s;
    }

    .priority-btn:hover {
      background: #f8f9fa;
    }

    .priority-btn.active.low {
      background: #d4edda;
      border-color: #28a745;
      color: #155724;
    }

    .priority-btn.active.medium {
      background: #fff3cd;
      border-color: #ffc107;
      color: #856404;
    }

    .priority-btn.active.high {
      background: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .action-btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .cancel-btn {
      background: #6c757d;
      color: white;
    }

    .cancel-btn:hover {
      background: #5a6268;
    }

    .submit-btn {
      background: #28a745;
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      background: #218838;
    }

    .submit-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .validation-message {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .validation-message p {
      margin: 0 0 0.5rem 0;
      font-weight: 500;
      color: #856404;
    }

    .validation-message ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #856404;
    }

    .validation-message li {
      margin-bottom: 0.25rem;
    }

    @media (max-width: 768px) {
      .add-task-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .priority-buttons {
        flex-direction: column;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AddTaskComponent {
  private taskService = inject(TaskService);

  // 📊 Signals para el estado del formulario
  private _showForm = signal(false);

  // 🔗 Readonly signal
  readonly showForm = this._showForm.asReadonly();

  // 📝 Propiedades del formulario
  title = '';
  description = '';
  category = '';
  newCategory = '';
  priority: Task['priority'] | '' = '';
  dueDateString = '';

  // 🧮 Computed para categorías disponibles
  availableCategories = this.taskService.categories;

  // 📅 Fecha mínima (hoy)
  readonly minDate = new Date().toISOString().split('T')[0];

  // 📝 Métodos del formulario
  toggleForm(): void {
    this._showForm.update(show => !show);
    if (!this._showForm()) {
      this.resetForm();
    }
  }

  setPriority(priority: Task['priority']): void {
    this.priority = priority;
  }

  getFinalCategory(): string {
    return this.category === 'nueva' ? this.newCategory.trim() : this.category;
  }

  isFormValid(): boolean {
    return (
      this.title.trim().length > 0 &&
      this.getFinalCategory().length > 0 &&
      this.priority !== ''
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const finalCategory = this.getFinalCategory();
    const dueDate = this.dueDateString ? new Date(this.dueDateString) : undefined;

    this.taskService.addTask({
      title: this.title.trim(),
      description: this.description.trim(),
      category: finalCategory,
      priority: this.priority as Task['priority'],
      completed: false,
      dueDate
    });

    this.resetForm();
    this._showForm.set(false);
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.category = '';
    this.newCategory = '';
    this.priority = '';
    this.dueDateString = '';
  }
}
```

### 🏠 Paso 7: App Component Final

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar todos los componentes standalone
import { TaskStatsComponent } from './components/task-stats/task-stats.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TaskStatsComponent,
    TaskFilterComponent,
    AddTaskComponent,
    TaskListComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🚀 Task Manager</h1>
        <p>Gestión de tareas con Angular 20 y Standalone Components</p>
      </header>

      <main class="app-main">
        <div class="app-layout">
          <!-- 📊 Sidebar con estadísticas y filtros -->
          <aside class="app-sidebar">
            <app-task-stats></app-task-stats>
            <app-task-filter></app-task-filter>
          </aside>

          <!-- 📋 Área principal con tareas -->
          <section class="app-content">
            <app-add-task></app-add-task>
            <app-task-list></app-task-list>
          </section>
        </div>
      </main>

      <footer class="app-footer">
        <p>💡 Desarrollado con <strong>Standalone Components</strong> y <strong>Signals</strong></p>
        <p>🎯 Angular 20 - Imagina Formación 2025</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      color: white;
      padding: 2rem;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .app-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .app-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .app-main {
      flex: 1;
      padding: 2rem;
    }

    .app-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .app-sidebar {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .app-content {
      min-width: 0; /* Permite que el contenido se contraiga */
    }

    .app-footer {
      background: rgba(0,0,0,0.2);
      color: white;
      text-align: center;
      padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .app-footer p {
      margin: 0.25rem 0;
      opacity: 0.9;
    }

    @media (max-width: 1024px) {
      .app-layout {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .app-main {
        padding: 1rem;
      }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 1.5rem 1rem;
      }

      .app-header h1 {
        font-size: 2rem;
      }

      .app-header p {
        font-size: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'task-manager';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Comunicación entre Componentes
1. **Agrega una nueva tarea** y observa cómo se actualizan las estadísticas automáticamente
2. **Filtra por categoría** y nota cómo la lista se actualiza reactivamente
3. **Cambia prioridades** y observa los gráficos en tiempo real

### 🔬 Experimento 2: Performance con Signals
1. **Abre DevTools** y ve a la pestaña Performance
2. **Realiza múltiples operaciones** (agregar, filtrar, completar tareas)
3. **Observa** que no hay re-renders innecesarios gracias a signals

### 🔬 Experimento 3: Gestión de Estado
1. **Nota** cómo el estado está centralizado en TaskService
2. **Observa** que todos los componentes reaccionan automáticamente
3. **Experimenta** con diferentes filtros y búsquedas

---

## ❓ Preguntas de Comprensión

1. **¿Cómo comunican estado los componentes standalone?**

2. **¿Qué ventajas tienen los signals sobre BehaviorSubject?**

3. **¿Por qué no necesitamos NgModules en esta aplicación?**

4. **¿Cómo maneja Angular la inyección de dependencias sin NgModules?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Persistencia
Agrega persistencia al TaskService:
- Guarda en localStorage automáticamente
- Carga datos al inicializar
- Sincroniza con una API REST

### Desafío 2: Drag & Drop
Implementa reordenamiento:
- Arrastra tareas para cambiar prioridad
- Reordena por categorías
- Visual feedback durante drag

### Desafío 3: Notificaciones
Crea sistema de notificaciones:
- Alertas para tareas vencidas
- Celebraciones al completar
- Progress tracking

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la comunicación entre componentes standalone
- [ ] Domino la gestión de estado con signals
- [ ] Puedo crear servicios optimizados para standalone
- [ ] Comprendo los patterns de composición avanzados
- [ ] Sé estructurar aplicaciones complejas sin NgModules

---

## 🏁 Conclusión

**Recuerda:**
- Servicios + Signals = Estado reactivo perfecto
- Standalone = Arquitectura simple y escalable
- Computed signals = Performance automática
- Inject() = Dependency injection moderna

**Próximo paso:** Routing avanzado con standalone components
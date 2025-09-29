# ⚡ Ejercicio: Change Detection Optimization

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Optimizar performance con ChangeDetectionStrategy.OnPush
- Medir y analizar performance de Change Detection
- Integrar signals para optimización automática
- Identificar y resolver problemas de rendimiento

## ⏱️ Duración: 40 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Qué es Change Detection?
Change Detection es el mecanismo de Angular que:
- **Detecta cambios** en el estado de la aplicación
- **Actualiza el DOM** cuando es necesario
- **Ejecuta automáticamente** en respuesta a eventos
- **Puede ser optimizado** para mejor performance

### 🎯 ¿Por qué OnPush es revolutionary?
- **Checks selectivos**: Solo cuando inputs cambian o eventos ocurren
- **Performance 10x**: Especialmente en listas grandes
- **Signals-compatible**: Optimización automática
- **Memory efficient**: Menos cycles desperdiciados

### 📖 Estrategias de Change Detection

```typescript
// 🐌 Default Strategy (checks siempre)
@Component({
  // changeDetection: ChangeDetectionStrategy.Default (por defecto)
})

// ⚡ OnPush Strategy (checks selectivos)
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// 🚀 Signals (optimización automática)
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ count() }}` // Auto-optimizado
})
```

---

## 🛠️ Parte 2: Hands-On - Performance Optimization (25 min)

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-onpush`**: Componente con OnPush strategy
- **`ng20-performance`**: Performance monitoring service
- **`ng20-signal-list`**: Lista optimizada con signals

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📦 Paso 1: Setup del Proyecto Performance

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone
ng new performance-demo --standalone --style=scss --routing=false
cd performance-demo

# 3. Instalar dependencias
npm install
```

### 🎯 Paso 2: Performance Monitoring Service

**Archivo:** `src/app/services/performance.service.ts`

```typescript
import { Injectable, signal, computed, effect } from '@angular/core';

export interface PerformanceMetric {
  componentName: string;
  timestamp: number;
  type: 'check' | 'render' | 'change';
  duration?: number;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  // 📊 Signals para métricas
  private _metrics = signal<PerformanceMetric[]>([]);
  private _isRecording = signal(false);

  // 🔗 Signals públicos readonly
  readonly metrics = this._metrics.asReadonly();
  readonly isRecording = this._isRecording.asReadonly();

  // 🧮 Computed signals para análisis
  readonly totalChecks = computed(() =>
    this._metrics().filter(m => m.type === 'check').length
  );

  readonly avgCheckDuration = computed(() => {
    const checks = this._metrics().filter(m => m.type === 'check' && m.duration);
    if (checks.length === 0) return 0;
    return checks.reduce((sum, m) => sum + (m.duration || 0), 0) / checks.length;
  });

  readonly componentsAnalysis = computed(() => {
    const metrics = this._metrics();
    const analysis = new Map<string, {
      checks: number;
      avgDuration: number;
      lastCheck: number;
    }>();

    metrics.forEach(metric => {
      if (metric.type === 'check') {
        const current = analysis.get(metric.componentName) || {
          checks: 0,
          avgDuration: 0,
          lastCheck: 0
        };

        current.checks++;
        current.avgDuration = (current.avgDuration + (metric.duration || 0)) / 2;
        current.lastCheck = metric.timestamp;

        analysis.set(metric.componentName, current);
      }
    });

    return Array.from(analysis.entries()).map(([name, data]) => ({
      name,
      ...data
    }));
  });

  constructor() {
    // 🔄 Effect para auto-limpieza (mantener solo últimas 1000 métricas)
    effect(() => {
      if (this._metrics().length > 1000) {
        this._metrics.update(metrics => metrics.slice(-500));
      }
    });
  }

  // 📝 Métodos para recording
  startRecording(): void {
    this._isRecording.set(true);
    this._metrics.set([]);
    console.log('🚀 Performance recording started');
  }

  stopRecording(): void {
    this._isRecording.set(false);
    console.log('⏹️ Performance recording stopped');
    this.logSummary();
  }

  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    if (!this._isRecording()) return;

    this._metrics.update(metrics => [
      ...metrics,
      { ...metric, timestamp: performance.now() }
    ]);
  }

  // 📊 Helpers para measuring
  measureChangeDetection<T>(componentName: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.recordMetric({
      componentName,
      type: 'check',
      duration,
      details: { duration: `${duration.toFixed(2)}ms` }
    });

    return result;
  }

  private logSummary(): void {
    const analysis = this.componentsAnalysis();
    console.table(analysis);
    console.log(`📊 Total checks: ${this.totalChecks()}`);
    console.log(`⏱️ Average duration: ${this.avgCheckDuration().toFixed(2)}ms`);
  }

  clearMetrics(): void {
    this._metrics.set([]);
  }
}
```

### 📊 Paso 3: Task Item Component (Default Strategy)

**Archivo:** `src/app/components/task-item-default/task-item-default.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService } from '../../services/performance.service';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

@Component({
  selector: 'app-task-item-default',
  standalone: true,
  imports: [CommonModule],
  // 🐌 Strategy DEFAULT (se ejecuta change detection siempre)
  template: `
    <div
      class="task-item"
      [class.completed]="task.completed"
      [class.priority-high]="task.priority === 'high'"
      [class.priority-medium]="task.priority === 'medium'"
    >
      <div class="task-content">
        <div class="task-header">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="onToggle()"
            class="task-checkbox"
          >
          <h4 [class.completed-text]="task.completed">
            {{ task.title }}
          </h4>
          <span class="priority-badge priority-{{ task.priority }}">
            {{ task.priority.toUpperCase() }}
          </span>
        </div>

        @if (task.dueDate) {
          <div class="due-date">
            📅 Due: {{ formatDate(task.dueDate) }}
          </div>
        }

        <div class="task-meta">
          <span class="task-id">ID: {{ task.id }}</span>
          <span class="check-indicator">
            🔄 Checked: {{ getCheckCount() }} times
          </span>
          <span class="timestamp">
            ⏰ {{ getCurrentTime() }}
          </span>
        </div>
      </div>

      <div class="task-actions">
        <button
          (click)="onEdit()"
          class="btn btn-sm btn-edit"
          [disabled]="task.completed"
        >
          ✏️ Edit
        </button>
        <button
          (click)="onDelete()"
          class="btn btn-sm btn-delete"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      background: white;
      transition: all 0.3s;
    }

    .task-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .task-item.completed {
      background: #f8f9fa;
      opacity: 0.7;
    }

    .task-item.priority-high {
      border-left: 4px solid #dc3545;
    }

    .task-item.priority-medium {
      border-left: 4px solid #ffc107;
    }

    .task-content {
      flex: 1;
    }

    .task-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .task-checkbox {
      transform: scale(1.2);
    }

    .task-header h4 {
      margin: 0;
      flex: 1;
    }

    .completed-text {
      text-decoration: line-through;
      color: #6c757d;
    }

    .priority-badge {
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .priority-low {
      background: #d4edda;
      color: #155724;
    }

    .priority-medium {
      background: #fff3cd;
      color: #856404;
    }

    .priority-high {
      background: #f8d7da;
      color: #721c24;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: #6c757d;
    }

    .due-date {
      color: #495057;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .check-indicator {
      background: #e7f3ff;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      border: 1px solid #bee5eb;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s;
    }

    .btn-edit {
      background: #17a2b8;
      color: white;
    }

    .btn-edit:hover:not(:disabled) {
      background: #138496;
    }

    .btn-edit:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background: #c82333;
    }
  `]
})
export class TaskItemDefaultComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  private performance = inject(PerformanceService);
  private checkCount = 0;

  ngDoCheck(): void {
    // 📊 Registrar cada check de change detection
    this.checkCount++;
    this.performance.recordMetric({
      componentName: 'TaskItemDefault',
      type: 'check',
      details: { taskId: this.task?.id, checkCount: this.checkCount }
    });
  }

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onEdit(): void {
    this.edit.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  getCheckCount(): number {
    return this.checkCount;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
```

### ⚡ Paso 4: Task Item Component (OnPush Strategy)

**Archivo:** `src/app/components/task-item-onpush/task-item-onpush.component.ts`

```typescript
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService } from '../../services/performance.service';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

@Component({
  selector: 'app-task-item-onpush',
  standalone: true,
  imports: [CommonModule],
  // ⚡ Strategy ONPUSH (change detection selectivo)
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="task-item onpush"
      [class.completed]="task.completed"
      [class.priority-high]="task.priority === 'high'"
      [class.priority-medium]="task.priority === 'medium'"
    >
      <div class="task-content">
        <div class="task-header">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="onToggle()"
            class="task-checkbox"
          >
          <h4 [class.completed-text]="task.completed">
            {{ task.title }}
          </h4>
          <span class="priority-badge priority-{{ task.priority }}">
            {{ task.priority.toUpperCase() }}
          </span>
        </div>

        @if (task.dueDate) {
          <div class="due-date">
            📅 Due: {{ formatDate(task.dueDate) }}
          </div>
        }

        <div class="task-meta">
          <span class="task-id">ID: {{ task.id }}</span>
          <span class="check-indicator onpush-indicator">
            ⚡ Checked: {{ checkCount() }} times
          </span>
          <span class="timestamp">
            ⏰ {{ currentTime() }}
          </span>
          <span class="optimization-badge">
            🚀 OnPush Optimized
          </span>
        </div>
      </div>

      <div class="task-actions">
        <button
          (click)="onEdit()"
          class="btn btn-sm btn-edit"
          [disabled]="task.completed"
        >
          ✏️ Edit
        </button>
        <button
          (click)="onDelete()"
          class="btn btn-sm btn-delete"
        >
          🗑️ Delete
        </button>
        <button
          (click)="forceUpdate()"
          class="btn btn-sm btn-update"
        >
          🔄 Force Update
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      background: white;
      transition: all 0.3s;
    }

    .task-item.onpush {
      border-left: 4px solid #28a745;
      background: linear-gradient(90deg, #f8fff9 0%, #ffffff 10%);
    }

    .task-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .task-item.completed {
      background: #f8f9fa;
      opacity: 0.7;
    }

    .task-item.priority-high {
      border-left: 4px solid #dc3545;
    }

    .task-item.priority-medium {
      border-left: 4px solid #ffc107;
    }

    .task-content {
      flex: 1;
    }

    .task-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .task-checkbox {
      transform: scale(1.2);
    }

    .task-header h4 {
      margin: 0;
      flex: 1;
    }

    .completed-text {
      text-decoration: line-through;
      color: #6c757d;
    }

    .priority-badge {
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .priority-low {
      background: #d4edda;
      color: #155724;
    }

    .priority-medium {
      background: #fff3cd;
      color: #856404;
    }

    .priority-high {
      background: #f8d7da;
      color: #721c24;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: #6c757d;
      flex-wrap: wrap;
    }

    .due-date {
      color: #495057;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .onpush-indicator {
      background: #d4f6d4;
      color: #155724;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      border: 1px solid #28a745;
    }

    .optimization-badge {
      background: #e7f3ff;
      color: #0056b3;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .btn-edit {
      background: #17a2b8;
      color: white;
    }

    .btn-edit:hover:not(:disabled) {
      background: #138496;
    }

    .btn-edit:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background: #c82333;
    }

    .btn-update {
      background: #28a745;
      color: white;
    }

    .btn-update:hover {
      background: #1e7e34;
    }
  `]
})
export class TaskItemOnPushComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  private performance = inject(PerformanceService);

  // 🚀 Using signals for internal state management
  private _checkCount = signal(0);
  private _currentTime = signal(new Date().toLocaleTimeString());

  // 🔗 Readonly signals
  readonly checkCount = this._checkCount.asReadonly();
  readonly currentTime = this._currentTime.asReadonly();

  ngDoCheck(): void {
    // 📊 Registrar cada check de change detection
    this._checkCount.update(count => count + 1);
    this.performance.recordMetric({
      componentName: 'TaskItemOnPush',
      type: 'check',
      details: {
        taskId: this.task?.id,
        checkCount: this._checkCount(),
        strategy: 'OnPush'
      }
    });
  }

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onEdit(): void {
    this.edit.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  forceUpdate(): void {
    // 🔄 Forzar actualización del tiempo
    this._currentTime.set(new Date().toLocaleTimeString());
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
```

### 📋 Paso 5: Performance Demo Component

**Archivo:** `src/app/components/performance-demo/performance-demo.component.ts`

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItemDefaultComponent, Task } from '../task-item-default/task-item-default.component';
import { TaskItemOnPushComponent } from '../task-item-onpush/task-item-onpush.component';
import { PerformanceService } from '../../services/performance.service';

@Component({
  selector: 'app-performance-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemDefaultComponent,
    TaskItemOnPushComponent
  ],
  template: `
    <div class="performance-demo">
      <h2>⚡ Change Detection Performance Demo</h2>

      <!-- 📊 Performance Controls -->
      <div class="controls-section">
        <div class="performance-controls">
          <button
            (click)="startRecording()"
            [disabled]="performance.isRecording()"
            class="btn btn-success"
          >
            🚀 Start Recording
          </button>

          <button
            (click)="stopRecording()"
            [disabled]="!performance.isRecording()"
            class="btn btn-danger"
          >
            ⏹️ Stop Recording
          </button>

          <button
            (click)="clearMetrics()"
            class="btn btn-secondary"
          >
            🧹 Clear
          </button>

          <button
            (click)="triggerGlobalUpdate()"
            class="btn btn-warning"
          >
            🔄 Global Update
          </button>
        </div>

        <div class="list-controls">
          <label>
            📋 Tasks Count:
            <input
              type="range"
              min="1"
              max="100"
              [value]="taskCount()"
              (input)="updateTaskCount($event)"
              class="range-input"
            >
            <span class="count-display">{{ taskCount() }}</span>
          </label>

          <button
            (click)="generateTasks()"
            class="btn btn-primary"
          >
            🔄 Regenerate Tasks
          </button>
        </div>
      </div>

      <!-- 📈 Performance Metrics -->
      @if (performance.metrics().length > 0) {
        <div class="metrics-section">
          <h3>📈 Performance Metrics</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <h4>Total Checks</h4>
              <span class="metric-value">{{ performance.totalChecks() }}</span>
            </div>
            <div class="metric-card">
              <h4>Avg Duration</h4>
              <span class="metric-value">{{ performance.avgCheckDuration().toFixed(2) }}ms</span>
            </div>
            <div class="metric-card">
              <h4>Recording</h4>
              <span class="metric-value" [class.recording]="performance.isRecording()">
                {{ performance.isRecording() ? '🔴 ON' : '⚫ OFF' }}
              </span>
            </div>
          </div>

          <!-- 📊 Component Analysis -->
          <div class="analysis-section">
            <h4>📊 Component Analysis</h4>
            <div class="analysis-table">
              @for (component of performance.componentsAnalysis(); track component.name) {
                <div class="analysis-row">
                  <span class="component-name">{{ component.name }}</span>
                  <span class="check-count">{{ component.checks }} checks</span>
                  <span class="avg-duration">{{ component.avgDuration.toFixed(2) }}ms avg</span>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- 📋 Task Lists Comparison -->
      <div class="comparison-section">
        <div class="list-section">
          <h3>🐌 Default Strategy</h3>
          <p class="strategy-description">
            Change Detection se ejecuta en CADA ciclo, sin importar si hay cambios relevantes.
            Observa cómo el contador de checks aumenta constantemente.
          </p>
          <div class="task-list">
            @for (task of tasks(); track task.id) {
              <app-task-item-default
                [task]="task"
                (toggle)="toggleTask($event)"
                (edit)="editTask($event)"
                (delete)="deleteTask($event)"
              ></app-task-item-default>
            }
          </div>
        </div>

        <div class="list-section">
          <h3>⚡ OnPush Strategy</h3>
          <p class="strategy-description">
            Change Detection se ejecuta SOLO cuando inputs cambian o hay eventos.
            Los checks son mucho menos frecuentes, mejorando significativamente la performance.
          </p>
          <div class="task-list">
            @for (task of tasks(); track task.id) {
              <app-task-item-onpush
                [task]="task"
                (toggle)="toggleTask($event)"
                (edit)="editTask($event)"
                (delete)="deleteTask($event)"
              ></app-task-item-onpush>
            }
          </div>
        </div>
      </div>

      <!-- 🧪 Experiments -->
      <div class="experiments-section">
        <h3>🧪 Experiments</h3>
        <div class="experiment-controls">
          <button
            (click)="stressTest()"
            class="btn btn-warning"
          >
            💥 Stress Test (1000 updates)
          </button>
          <button
            (click)="startAutoUpdates()"
            [disabled]="autoUpdating()"
            class="btn btn-info"
          >
            🔄 Auto Updates
          </button>
          <button
            (click)="stopAutoUpdates()"
            [disabled]="!autoUpdating()"
            class="btn btn-secondary"
          >
            ⏹️ Stop Auto
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .performance-demo {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .controls-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .performance-controls,
    .list-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .list-controls label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .range-input {
      width: 150px;
    }

    .count-display {
      min-width: 30px;
      font-weight: bold;
      color: #007bff;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .btn-success { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-warning { background: #ffc107; color: #212529; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-info { background: #17a2b8; color: white; }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .metrics-section {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .metric-card {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
    }

    .metric-card h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .metric-value.recording {
      color: #dc3545;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .analysis-section {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
    }

    .analysis-table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .analysis-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      padding: 0.5rem;
      background: white;
      border-radius: 4px;
      align-items: center;
    }

    .component-name {
      font-weight: 500;
    }

    .comparison-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .list-section {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .list-section h3 {
      margin: 0 0 1rem 0;
    }

    .strategy-description {
      background: #e7f3ff;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      border-left: 4px solid #007bff;
    }

    .task-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .experiments-section {
      background: #fff3cd;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #ffeaa7;
    }

    .experiment-controls {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .comparison-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PerformanceDemoComponent {
  performance = inject(PerformanceService);

  // 📊 Signals para estado
  private _taskCount = signal(5);
  private _tasks = signal<Task[]>([]);
  private _autoUpdating = signal(false);
  private autoUpdateInterval?: number;

  // 🔗 Readonly signals
  readonly taskCount = this._taskCount.asReadonly();
  readonly tasks = this._tasks.asReadonly();
  readonly autoUpdating = this._autoUpdating.asReadonly();

  constructor() {
    this.generateTasks();
  }

  ngOnDestroy(): void {
    this.stopAutoUpdates();
  }

  // 📊 Performance controls
  startRecording(): void {
    this.performance.startRecording();
  }

  stopRecording(): void {
    this.performance.stopRecording();
  }

  clearMetrics(): void {
    this.performance.clearMetrics();
  }

  // 📋 Task management
  updateTaskCount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._taskCount.set(parseInt(input.value));
    this.generateTasks();
  }

  generateTasks(): void {
    const count = this._taskCount();
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

    const newTasks: Task[] = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Task ${i + 1}: ${this.generateTaskTitle()}`,
      completed: Math.random() > 0.7,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
    }));

    this._tasks.set(newTasks);
  }

  toggleTask(id: number): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  editTask(id: number): void {
    console.log('Edit task:', id);
    // Simular edición
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id
          ? { ...task, title: `${task.title} (edited at ${new Date().toLocaleTimeString()})` }
          : task
      )
    );
  }

  deleteTask(id: number): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  // 🧪 Performance experiments
  triggerGlobalUpdate(): void {
    // Trigger change detection globally
    console.log('Global update triggered at:', new Date().toLocaleTimeString());
  }

  stressTest(): void {
    console.log('🚀 Starting stress test...');

    let updates = 0;
    const stressInterval = setInterval(() => {
      // Simular updates frecuentes
      this.triggerGlobalUpdate();
      updates++;

      if (updates >= 1000) {
        clearInterval(stressInterval);
        console.log('✅ Stress test completed!');
      }
    }, 10);
  }

  startAutoUpdates(): void {
    this._autoUpdating.set(true);
    this.autoUpdateInterval = window.setInterval(() => {
      this.triggerGlobalUpdate();
    }, 100);
  }

  stopAutoUpdates(): void {
    this._autoUpdating.set(false);
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
      this.autoUpdateInterval = undefined;
    }
  }

  private generateTaskTitle(): string {
    const actions = ['Review', 'Update', 'Fix', 'Implement', 'Test', 'Deploy', 'Analyze'];
    const subjects = ['authentication', 'dashboard', 'user profile', 'database', 'API', 'UI components'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    return `${action} ${subject}`;
  }
}
```

### 🔗 Paso 6: Integrar en AppComponent

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceDemoComponent } from './components/performance-demo/performance-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    PerformanceDemoComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>⚡ Change Detection Performance</h1>
        <p>Comparando Default vs OnPush Strategy con Angular 20</p>
      </header>

      <main>
        <app-performance-demo></app-performance-demo>
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
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
  title = 'change-detection-demo';
}
```

---

## 🧪 Parte 3: Experimentación y Análisis (5 min)

### 🔬 Experimento 1: Comparación de Checks
1. **Ejecuta la app** y observa ambas listas
2. **Start Recording** para comenzar el monitoring
3. **Observa los contadores** de checks en tiempo real
4. **Usa Global Update** para ver las diferencias

**¿Qué observas?**
- Default Strategy: Checks constantes en ambos componentes
- OnPush Strategy: Checks solo cuando hay eventos

### 🔬 Experimento 2: Stress Testing
1. **Incrementa el número de tasks** a 50+
2. **Start Recording**
3. **Ejecuta Stress Test** para 1000 updates
4. **Analiza los resultados** en Component Analysis

### 🔬 Experimento 3: Auto Updates
1. **Start Recording**
2. **Activar Auto Updates** (updates cada 100ms)
3. **Observa la diferencia** entre ambas estrategias
4. **Stop Recording** y analiza métricas

---

## ❓ Preguntas de Comprensión

1. **¿Por qué OnPush reduce dramáticamente los checks?**

2. **¿Cuándo NO deberías usar OnPush strategy?**

3. **¿Cómo los signals mejoran OnPush automáticamente?**

4. **¿Qué problemas puede causar OnPush mal implementado?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Optimización Automática
Modifica TaskItemOnPushComponent para usar signals para TODO el estado interno:
- Signal para task title editing
- Signal para hover states
- Computed para UI derivado

### Desafío 2: Performance Profiler
Extiende PerformanceService para incluir:
- Memory usage monitoring
- FPS tracking
- Bundle size impact analysis

### Desafío 3: Real-world Scenario
Crea un data table component que:
- Maneje 1000+ rows
- Use OnPush + signals
- Incluya sorting y filtering
- Compare performance con default strategy

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la diferencia entre Default y OnPush
- [ ] Sé cuándo y cómo usar OnPush strategy
- [ ] Puedo medir performance de Change Detection
- [ ] Comprendo cómo signals optimizan OnPush automáticamente
- [ ] Puedo identificar y resolver problemas de performance

---

## 🏁 Conclusión

**Recuerda:**
- OnPush = 10x mejor performance con el mismo código
- Signals + OnPush = Optimización automática
- Measure first, optimize second
- DevTools son tu mejor amigo para performance

**Próximo paso:** Crear directivas custom reactivas con signals
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStore } from '../../core/stores/task.store';
import { TaskStatus, TaskPriority } from '../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-list-container">
      <div class="task-header">
        <h2>Gestión de Tareas</h2>
        <div class="task-stats">
          <div class="stat-card">
            <span class="stat-number">{{ taskStore.totalTasks() }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ taskStore.pendingTasks() }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ taskStore.completedTasks() }}</span>
            <span class="stat-label">Completadas</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ taskStore.progressPercentage() }}%</span>
            <span class="stat-label">Progreso</span>
          </div>
        </div>
      </div>

      <div class="task-filters">
        <div class="filter-group">
          <label for="search">Buscar:</label>
          <input
            id="search"
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Buscar tareas..."
            class="filter-input">
        </div>

        <div class="filter-group">
          <label for="status">Estado:</label>
          <select id="status" [(ngModel)]="selectedStatus" (change)="onStatusFilter()" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="priority">Prioridad:</label>
          <select id="priority" [(ngModel)]="selectedPriority" (change)="onPriorityFilter()" class="filter-select">
            <option value="">Todas las prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        <button (click)="clearFilters()" class="btn btn-secondary">
          Limpiar Filtros
        </button>
      </div>

      @if (taskStore.loading()) {
        <div class="loading">Cargando tareas...</div>
      }

      @if (taskStore.error()) {
        <div class="error">{{ taskStore.error() }}</div>
      }

      <div class="tasks-grid">
        @for (task of taskStore.filteredTasks(); track task.id) {
          <div class="task-card" [class]="'priority-' + task.priority">
            <div class="task-header-card">
              <h3 class="task-title">{{ task.title }}</h3>
              <span class="task-status" [class]="'status-' + task.status">
                {{ getStatusLabel(task.status) }}
              </span>
            </div>

            <p class="task-description">{{ task.description }}</p>

            <div class="task-meta">
              <div class="task-info">
                <span class="task-priority" [class]="'priority-' + task.priority">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                @if (task.dueDate) {
                  <span class="task-due-date">
                    Vence: {{ formatDate(task.dueDate) }}
                  </span>
                }
              </div>

              @if (task.tags.length > 0) {
                <div class="task-tags">
                  @for (tag of task.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              }
            </div>

            <div class="task-actions">
              @if (task.status !== TaskStatus.COMPLETED) {
                <button
                  (click)="markAsCompleted(task.id)"
                  class="btn btn-success btn-sm">
                  ✓ Completar
                </button>
              }

              @if (task.status === TaskStatus.PENDING) {
                <button
                  (click)="startTask(task.id)"
                  class="btn btn-primary btn-sm">
                  ▶ Iniciar
                </button>
              }

              <button
                (click)="deleteTask(task.id)"
                class="btn btn-danger btn-sm">
                🗑 Eliminar
              </button>
            </div>
          </div>
        } @empty {
          <div class="no-tasks">
            <p>No se encontraron tareas que coincidan con los filtros.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .task-header {
      margin-bottom: 30px;
    }

    .task-header h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .task-stats {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 15px 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      min-width: 100px;
    }

    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }

    .stat-label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .task-filters {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .filter-group label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .filter-input, .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 150px;
    }

    .filter-input:focus, .filter-select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .task-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-left: 4px solid #007bff;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .task-card.priority-urgent {
      border-left-color: #dc3545;
    }

    .task-card.priority-high {
      border-left-color: #fd7e14;
    }

    .task-card.priority-medium {
      border-left-color: #ffc107;
    }

    .task-card.priority-low {
      border-left-color: #28a745;
    }

    .task-header-card {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }

    .task-title {
      margin: 0;
      color: #333;
      font-size: 16px;
      flex: 1;
    }

    .task-status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      margin-left: 10px;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-in_progress {
      background: #cce5ff;
      color: #0066cc;
    }

    .status-completed {
      background: #d4edda;
      color: #155724;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .task-description {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.4;
    }

    .task-meta {
      margin-bottom: 15px;
    }

    .task-info {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;
    }

    .task-priority {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .priority-urgent {
      background: #ffebee;
      color: #c62828;
    }

    .priority-high {
      background: #fff3e0;
      color: #ef6c00;
    }

    .priority-medium {
      background: #fffde7;
      color: #f57f17;
    }

    .priority-low {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .task-due-date {
      font-size: 12px;
      color: #666;
    }

    .task-tags {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }

    .tag {
      background: #f8f9fa;
      color: #495057;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 11px;
      border: 1px solid #dee2e6;
    }

    .task-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 11px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover {
      background: #1e7e34;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .loading, .error {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .error {
      color: #dc3545;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
    }

    .no-tasks {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      color: #666;
    }

    @media (max-width: 768px) {
      .task-filters {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        width: 100%;
      }

      .filter-input, .filter-select {
        min-width: auto;
        width: 100%;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  taskStore = inject(TaskStore);
  readonly TaskStatus = TaskStatus;

  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';

  ngOnInit() {
    this.taskStore.loadMockData();
  }

  onSearch() {
    this.taskStore.searchTasks(this.searchTerm);
  }

  onStatusFilter() {
    if (this.selectedStatus) {
      this.taskStore.filterByStatus([this.selectedStatus as TaskStatus]);
    } else {
      this.taskStore.setFilters({ status: undefined });
    }
  }

  onPriorityFilter() {
    if (this.selectedPriority) {
      this.taskStore.filterByPriority([this.selectedPriority as TaskPriority]);
    } else {
      this.taskStore.setFilters({ priority: undefined });
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.taskStore.clearFilters();
  }

  markAsCompleted(id: string) {
    this.taskStore.updateTaskStatus(id, TaskStatus.COMPLETED);
  }

  startTask(id: string) {
    this.taskStore.updateTaskStatus(id, TaskStatus.IN_PROGRESS);
  }

  deleteTask(id: string) {
    this.taskStore.deleteTask(id);
  }

  getStatusLabel(status: TaskStatus): string {
    const labels = {
      [TaskStatus.PENDING]: 'Pendiente',
      [TaskStatus.IN_PROGRESS]: 'En Progreso',
      [TaskStatus.COMPLETED]: 'Completada',
      [TaskStatus.CANCELLED]: 'Cancelada'
    };
    return labels[status];
  }

  getPriorityLabel(priority: TaskPriority): string {
    const labels = {
      [TaskPriority.URGENT]: 'Urgente',
      [TaskPriority.HIGH]: 'Alta',
      [TaskPriority.MEDIUM]: 'Media',
      [TaskPriority.LOW]: 'Baja'
    };
    return labels[priority];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
}
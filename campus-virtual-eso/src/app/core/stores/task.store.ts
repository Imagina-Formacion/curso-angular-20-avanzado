import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus, TaskPriority, TaskFilters, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  private readonly _state = signal<TaskState>({
    tasks: [],
    loading: false,
    error: null,
    filters: {}
  });

  readonly state = this._state.asReadonly();

  readonly tasks = computed(() => this._state().tasks);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly filters = computed(() => this._state().filters);

  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filters = this.filters();

    return tasks.filter(task => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }

      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }

      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) {
        return false;
      }

      if (filters.courseId && task.courseId !== filters.courseId) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(searchTerm) &&
            !task.description.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => task.tags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  });

  readonly tasksByStatus = computed(() => {
    const tasks = this.filteredTasks();
    return {
      pending: tasks.filter(t => t.status === TaskStatus.PENDING),
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED),
      cancelled: tasks.filter(t => t.status === TaskStatus.CANCELLED)
    };
  });

  readonly tasksByPriority = computed(() => {
    const tasks = this.filteredTasks();
    return {
      urgent: tasks.filter(t => t.priority === TaskPriority.URGENT),
      high: tasks.filter(t => t.priority === TaskPriority.HIGH),
      medium: tasks.filter(t => t.priority === TaskPriority.MEDIUM),
      low: tasks.filter(t => t.priority === TaskPriority.LOW)
    };
  });

  readonly totalTasks = computed(() => this.tasks().length);
  readonly completedTasks = computed(() => this.tasksByStatus().completed.length);
  readonly pendingTasks = computed(() => this.tasksByStatus().pending.length);
  readonly progressPercentage = computed(() => {
    const total = this.totalTasks();
    const completed = this.completedTasks();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  setLoading(loading: boolean): void {
    this._state.update(state => ({
      ...state,
      loading
    }));
  }

  setError(error: string | null): void {
    this._state.update(state => ({
      ...state,
      error
    }));
  }

  loadTasks(tasks: Task[]): void {
    this._state.update(state => ({
      ...state,
      tasks,
      loading: false,
      error: null
    }));
  }

  addTask(taskDto: CreateTaskDto): void {
    const newTask: Task = {
      id: this.generateId(),
      ...taskDto,
      status: TaskStatus.PENDING,
      createdBy: 'current-user', // En producción vendría del AuthService
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: taskDto.tags || []
    };

    this._state.update(state => ({
      ...state,
      tasks: [...state.tasks, newTask]
    }));
  }

  updateTask(id: string, updates: UpdateTaskDto): void {
    this._state.update(state => ({
      ...state,
      tasks: state.tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    }));
  }

  deleteTask(id: string): void {
    this._state.update(state => ({
      ...state,
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  }

  updateTaskStatus(id: string, status: TaskStatus): void {
    this.updateTask(id, { status });
  }

  setFilters(filters: TaskFilters): void {
    this._state.update(state => ({
      ...state,
      filters: { ...state.filters, ...filters }
    }));
  }

  clearFilters(): void {
    this._state.update(state => ({
      ...state,
      filters: {}
    }));
  }

  searchTasks(search: string): void {
    this.setFilters({ search });
  }

  filterByStatus(status: TaskStatus[]): void {
    this.setFilters({ status });
  }

  filterByPriority(priority: TaskPriority[]): void {
    this.setFilters({ priority });
  }

  filterByAssignee(assigneeId: string): void {
    this.setFilters({ assigneeId });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Método para cargar datos mock iniciales
  loadMockData(): void {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Completar ejercicios de Angular Signals',
        description: 'Implementar los 5 ejercicios de la primera sesión sobre Angular Signals',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: 'student1',
        createdBy: 'teacher1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16'),
        dueDate: new Date('2024-01-20'),
        tags: ['angular', 'signals', 'ejercicios'],
        courseId: 'angular-20',
        courseName: 'Angular 20 Avanzado'
      },
      {
        id: '2',
        title: 'Revisar documentación de Control Flow',
        description: 'Estudiar la nueva sintaxis de control de flujo @if, @for, @switch',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        assigneeId: 'student1',
        createdBy: 'teacher1',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        dueDate: new Date('2024-01-18'),
        tags: ['angular', 'control-flow', 'documentación'],
        courseId: 'angular-20',
        courseName: 'Angular 20 Avanzado'
      },
      {
        id: '3',
        title: 'Implementar formularios reactivos',
        description: 'Crear formularios usando FormBuilder y validaciones avanzadas',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        assigneeId: 'student1',
        createdBy: 'teacher1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-13'),
        dueDate: new Date('2024-01-15'),
        tags: ['angular', 'formularios', 'validaciones'],
        courseId: 'angular-20',
        courseName: 'Angular 20 Avanzado'
      },
      {
        id: '4',
        title: 'Configurar servicios avanzados',
        description: 'Implementar patrón de servicios con inyección de dependencias moderna',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        assigneeId: 'student2',
        createdBy: 'teacher1',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        tags: ['angular', 'servicios', 'di'],
        courseId: 'angular-20',
        courseName: 'Angular 20 Avanzado'
      }
    ];

    this.loadTasks(mockTasks);
  }
}
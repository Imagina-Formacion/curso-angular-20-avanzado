import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { UserRole, Course } from '../../core/models';

interface CourseFilter {
  search: string;
  status: 'all' | 'active' | 'pending' | 'completed';
  level: 'all' | '1eso' | '2eso' | '3eso' | '4eso';
}

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="courses-container">
      <div class="courses-header">
        <h2>📚 Gestión de Cursos</h2>
        <button
          class="btn btn-primary"
          *appHasRole="[UserRole.ADMIN, UserRole.TEACHER]"
          (click)="createCourse()"
        >
          ➕ Nuevo Curso
        </button>
      </div>

      <!-- Filtros -->
      <div class="courses-filters">
        <div class="filter-group">
          <label for="search">🔍 Buscar:</label>
          <input
            id="search"
            type="text"
            [(ngModel)]="filters().search"
            (input)="updateFilter('search', $event)"
            placeholder="Buscar por nombre o código..."
            class="filter-input"
          >
        </div>

        <div class="filter-group">
          <label for="status">📊 Estado:</label>
          <select
            id="status"
            [(ngModel)]="filters().status"
            (change)="updateFilter('status', $event)"
            class="filter-select"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="level">🎓 Nivel:</label>
          <select
            id="level"
            [(ngModel)]="filters().level"
            (change)="updateFilter('level', $event)"
            class="filter-select"
          >
            <option value="all">Todos</option>
            <option value="1eso">1º ESO</option>
            <option value="2eso">2º ESO</option>
            <option value="3eso">3º ESO</option>
            <option value="4eso">4º ESO</option>
          </select>
        </div>

        <div class="filter-stats">
          <span class="stats-item">
            Total: {{ filteredCourses().length }}
          </span>
          <span class="stats-item">
            Activos: {{ courseStats().active }}
          </span>
        </div>
      </div>

      <!-- Lista de cursos -->
      <div class="courses-grid">
        @if (isLoading()) {
          <div class="loading-state">
            <div class="loading-spinner">⏳</div>
            <p>Cargando cursos...</p>
          </div>
        } @else if (filteredCourses().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No se encontraron cursos</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        } @else {
          @for (course of paginatedCourses(); track course.id) {
            <div class="course-card" [class]="'course-' + course.status">
              <div class="course-header">
                <h3 class="course-title">{{ course.name }}</h3>
                <span class="course-status" [class]="'status-' + course.status">
                  {{ getStatusLabel(course.status) }}
                </span>
              </div>

              <div class="course-info">
                <div class="course-detail">
                  <span class="detail-label">📋 Código:</span>
                  <span class="detail-value">{{ course.code }}</span>
                </div>

                <div class="course-detail">
                  <span class="detail-label">🎓 Nivel:</span>
                  <span class="detail-value">{{ course.level }}º ESO</span>
                </div>

                <div class="course-detail">
                  <span class="detail-label">👥 Estudiantes:</span>
                  <span class="detail-value">{{ course.studentsCount }}</span>
                </div>

                <div class="course-detail">
                  <span class="detail-label">👨‍🏫 Profesor:</span>
                  <span class="detail-value">{{ course.teacher }}</span>
                </div>

                @if (course.description) {
                  <div class="course-description">
                    {{ course.description }}
                  </div>
                }
              </div>

              <div class="course-actions">
                <button
                  class="btn btn-outline-primary"
                  (click)="viewCourse(course)"
                >
                  👁️ Ver
                </button>

                <button
                  class="btn btn-outline-secondary"
                  *appHasRole="[UserRole.ADMIN, UserRole.TEACHER]"
                  (click)="editCourse(course)"
                >
                  ✏️ Editar
                </button>

                <button
                  class="btn btn-outline-danger"
                  *appHasRole="UserRole.ADMIN"
                  (click)="deleteCourse(course)"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          }
        }
      </div>

      <!-- Paginación -->
      @if (totalPages() > 1) {
        <div class="pagination">
          <button
            class="btn btn-outline-secondary"
            [disabled]="currentPage() === 1"
            (click)="goToPage(currentPage() - 1)"
          >
            ⬅️ Anterior
          </button>

          <span class="pagination-info">
            Página {{ currentPage() }} de {{ totalPages() }}
          </span>

          <button
            class="btn btn-outline-secondary"
            [disabled]="currentPage() === totalPages()"
            (click)="goToPage(currentPage() + 1)"
          >
            Siguiente ➡️
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .courses-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .courses-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .courses-header h2 {
      margin: 0;
      color: #333;
    }

    .courses-filters {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 24px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-group label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .filter-input,
    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .filter-stats {
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: right;
    }

    .stats-item {
      font-size: 0.85rem;
      color: #666;
      background: white;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .course-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .course-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .course-title {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
      line-height: 1.3;
    }

    .course-status {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-completed {
      background: #d1ecf1;
      color: #0c5460;
    }

    .course-info {
      margin-bottom: 16px;
    }

    .course-detail {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 0.9rem;
    }

    .detail-label {
      color: #666;
      font-weight: 500;
    }

    .detail-value {
      color: #333;
    }

    .course-description {
      margin-top: 12px;
      padding: 8px 0;
      color: #666;
      font-size: 0.85rem;
      line-height: 1.4;
      border-top: 1px solid #f0f0f0;
    }

    .course-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 6px 12px;
      border: 1px solid;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .btn-outline-primary {
      background: transparent;
      color: #007bff;
      border-color: #007bff;
    }

    .btn-outline-secondary {
      background: transparent;
      color: #6c757d;
      border-color: #6c757d;
    }

    .btn-outline-danger {
      background: transparent;
      color: #dc3545;
      border-color: #dc3545;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading-state,
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-spinner,
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 20px 0;
    }

    .pagination-info {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .courses-filters {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .filter-stats {
        text-align: left;
      }

      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CoursesListComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  // Hacer accesible UserRole en el template
  readonly UserRole = UserRole;

  // Estado del componente
  private readonly _courses = signal<Course[]>([]);
  private readonly _filters = signal<CourseFilter>({
    search: '',
    status: 'all',
    level: 'all'
  });
  private readonly _currentPage = signal(1);
  private readonly _isLoading = signal(true);

  // Configuración
  private readonly pageSize = 9;

  // Computed signals
  readonly courses = this._courses.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly filteredCourses = computed(() => {
    const courses = this.courses();
    const { search, status, level } = this.filters();

    return courses.filter(course => {
      const matchesSearch = search === '' ||
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.code.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'all' || course.status === status;

      const matchesLevel = level === 'all' || course.level.toString() === level.replace('eso', '');

      return matchesSearch && matchesStatus && matchesLevel;
    });
  });

  readonly paginatedCourses = computed(() => {
    const filtered = this.filteredCourses();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    return filtered.slice(start, end);
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.filteredCourses().length / this.pageSize)
  );

  readonly courseStats = computed(() => {
    const courses = this.filteredCourses();
    return {
      total: courses.length,
      active: courses.filter(c => c.status === 'active').length,
      pending: courses.filter(c => c.status === 'pending').length,
      completed: courses.filter(c => c.status === 'completed').length
    };
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  updateFilter(key: keyof CourseFilter, event: any): void {
    const value = event.target?.value || event;
    this._filters.update(filters => ({
      ...filters,
      [key]: value
    }));

    // Reset a primera página cuando cambian los filtros
    this._currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._currentPage.set(page);
    }
  }

  createCourse(): void {
    this.notificationService.info(
      'Crear curso',
      'Funcionalidad en desarrollo - Sesión 3'
    );
  }

  viewCourse(course: Course): void {
    this.notificationService.info(
      'Ver curso',
      `Abriendo detalles del curso: ${course.name}`
    );
  }

  editCourse(course: Course): void {
    this.notificationService.info(
      'Editar curso',
      `Editando curso: ${course.name}`
    );
  }

  deleteCourse(course: Course): void {
    if (confirm(`¿Estás seguro de eliminar el curso "${course.name}"?`)) {
      this._courses.update(courses =>
        courses.filter(c => c.id !== course.id)
      );
      this.notificationService.success(
        'Curso eliminado',
        `El curso "${course.name}" ha sido eliminado`
      );
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completado';
      default: return status;
    }
  }

  private loadCourses(): void {
    // Simular carga con delay
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          id: '1',
          name: 'Matemáticas Básicas',
          code: 'MAT-1ESO-A',
          level: 1,
          description: 'Curso introductorio de matemáticas para 1º ESO',
          teacher: 'Prof. García',
          studentsCount: 25,
          status: 'active',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2025-06-30')
        },
        {
          id: '2',
          name: 'Lengua y Literatura',
          code: 'LEN-1ESO-A',
          level: 1,
          description: 'Desarrollo de competencias lingüísticas y literarias',
          teacher: 'Prof. Martínez',
          studentsCount: 23,
          status: 'active',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2025-06-30')
        },
        {
          id: '3',
          name: 'Historia Medieval',
          code: 'HIS-2ESO-B',
          level: 2,
          description: 'Estudio de la historia medieval europea',
          teacher: 'Prof. López',
          studentsCount: 28,
          status: 'active',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2025-06-30')
        },
        {
          id: '4',
          name: 'Biología Celular',
          code: 'BIO-3ESO-A',
          level: 3,
          description: 'Introducción a la biología celular y molecular',
          teacher: 'Prof. Rodríguez',
          studentsCount: 22,
          status: 'pending',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-06-30')
        },
        {
          id: '5',
          name: 'Física Moderna',
          code: 'FIS-4ESO-A',
          level: 4,
          description: 'Conceptos fundamentales de física moderna',
          teacher: 'Prof. Sánchez',
          studentsCount: 20,
          status: 'completed',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-06-30')
        },
        {
          id: '6',
          name: 'Inglés Avanzado',
          code: 'ING-3ESO-B',
          level: 3,
          description: 'Curso avanzado de inglés con énfasis en conversación',
          teacher: 'Prof. Wilson',
          studentsCount: 26,
          status: 'active',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2025-06-30')
        }
      ];

      this._courses.set(mockCourses);
      this._isLoading.set(false);

      this.notificationService.success(
        'Cursos cargados',
        `Se han cargado ${mockCourses.length} cursos correctamente`
      );
    }, 1500);
  }
}
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  count?: number;
}

interface RecentActivity {
  id: string;
  type: 'assignment' | 'grade' | 'message' | 'event';
  title: string;
  description: string;
  date: Date;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals para el estado del dashboard
  private readonly _recentActivities = signal<RecentActivity[]>([]);
  private readonly _currentTime = signal(new Date());

  // Computed signals
  readonly currentUser = this.authService.currentUser;
  readonly userRole = this.authService.userRole;
  readonly recentActivities = this._recentActivities.asReadonly();
  readonly currentTime = this._currentTime.asReadonly();

  // Computed cards basado en el rol
  readonly dashboardCards = computed(() => {
    const role = this.userRole();
    const baseCards: DashboardCard[] = [];

    switch (role) {
      case UserRole.STUDENT:
        return [
          {
            title: 'Mis Asignaturas',
            description: 'Ver todas mis asignaturas',
            icon: '📚',
            route: '/subjects',
            color: 'blue',
            count: 6
          },
          {
            title: 'Tareas Pendientes',
            description: 'Tareas por entregar',
            icon: '📝',
            route: '/assignments',
            color: 'orange',
            count: 3
          },
          {
            title: 'Horario',
            description: 'Ver mi horario de clases',
            icon: '📅',
            route: '/schedule',
            color: 'green'
          },
          {
            title: 'Calificaciones',
            description: 'Ver mis calificaciones',
            icon: '📊',
            route: '/grades',
            color: 'purple'
          },
          {
            title: 'Mensajes',
            description: 'Mensajes de profesores',
            icon: '💬',
            route: '/messages',
            color: 'teal',
            count: 2
          },
          {
            title: 'Recursos',
            description: 'Material de estudio',
            icon: '🎯',
            route: '/resources',
            color: 'indigo'
          }
        ];

      case UserRole.TEACHER:
        return [
          {
            title: 'Mis Clases',
            description: 'Gestionar mis clases',
            icon: '🏫',
            route: '/classes',
            color: 'blue',
            count: 4
          },
          {
            title: 'Estudiantes',
            description: 'Ver lista de estudiantes',
            icon: '👥',
            route: '/students',
            color: 'green',
            count: 120
          },
          {
            title: 'Tareas',
            description: 'Crear y revisar tareas',
            icon: '📋',
            route: '/assignments',
            color: 'orange',
            count: 15
          },
          {
            title: 'Calificaciones',
            description: 'Gestionar calificaciones',
            icon: '📊',
            route: '/grading',
            color: 'purple'
          },
          {
            title: 'Horario',
            description: 'Mi horario de clases',
            icon: '📅',
            route: '/schedule',
            color: 'teal'
          },
          {
            title: 'Reportes',
            description: 'Informes de progreso',
            icon: '📈',
            route: '/reports',
            color: 'indigo'
          }
        ];

      case UserRole.ADMIN:
        return [
          {
            title: 'Usuarios',
            description: 'Gestionar usuarios',
            icon: '👤',
            route: '/admin/users',
            color: 'blue',
            count: 450
          },
          {
            title: 'Cursos',
            description: 'Administrar cursos',
            icon: '🎓',
            route: '/admin/courses',
            color: 'green',
            count: 12
          },
          {
            title: 'Asignaturas',
            description: 'Configurar asignaturas',
            icon: '📚',
            route: '/admin/subjects',
            color: 'orange',
            count: 45
          },
          {
            title: 'Profesores',
            description: 'Gestionar profesores',
            icon: '👨‍🏫',
            route: '/admin/teachers',
            color: 'purple',
            count: 25
          },
          {
            title: 'Configuración',
            description: 'Configuración del sistema',
            icon: '⚙️',
            route: '/admin/settings',
            color: 'teal'
          },
          {
            title: 'Reportes',
            description: 'Informes generales',
            icon: '📊',
            route: '/admin/reports',
            color: 'indigo'
          }
        ];

      default:
        return [];
    }
  });

  readonly welcomeMessage = computed(() => {
    const user = this.currentUser();
    const time = this.currentTime();
    const hour = time.getHours();

    let greeting = '';
    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';

    return `${greeting}, ${user?.name || 'Usuario'}`;
  });

  readonly roleDisplayName = computed(() => {
    const role = this.userRole();
    switch (role) {
      case UserRole.STUDENT: return 'Estudiante';
      case UserRole.TEACHER: return 'Profesor/a';
      case UserRole.ADMIN: return 'Administrador/a';
      default: return 'Usuario';
    }
  });

  ngOnInit(): void {
    this.loadRecentActivities();
    this.startClock();
  }

  /**
   * Navegar a una ruta específica
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Ir al perfil
   */
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * Cargar actividades recientes
   */
  private loadRecentActivities(): void {
    // Simulación de actividades recientes
    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'assignment',
        title: 'Nueva tarea disponible',
        description: 'Matemáticas - Ejercicios de álgebra',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        icon: '📝'
      },
      {
        id: '2',
        type: 'grade',
        title: 'Calificación publicada',
        description: 'Historia - Examen del tema 3: 8.5/10',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
        icon: '📊'
      },
      {
        id: '3',
        type: 'message',
        title: 'Nuevo mensaje',
        description: 'Profesor García: Recordatorio sobre la excursión',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
        icon: '💬'
      },
      {
        id: '4',
        type: 'event',
        title: 'Próximo evento',
        description: 'Reunión de padres - 15 de noviembre',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        icon: '📅'
      }
    ];

    this._recentActivities.set(mockActivities);
  }

  /**
   * Iniciar reloj en tiempo real
   */
  private startClock(): void {
    setInterval(() => {
      this._currentTime.set(new Date());
    }, 1000);
  }

  /**
   * Formatear fecha relativa
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `hace ${minutes} minutos`;
    } else if (hours < 24) {
      return `hace ${hours} horas`;
    } else {
      return `hace ${days} días`;
    }
  }
}
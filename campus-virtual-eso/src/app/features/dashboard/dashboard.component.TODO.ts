import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationCenterComponent } from '../../shared/components/notification-center/notification-center.component';
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
  imports: [CommonModule, NotificationCenterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // TODO: Implementar estrategia OnPush para optimizar el rendimiento
  // Hint: Usar ChangeDetectionStrategy.OnPush
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  // TODO: Convertir _recentActivities a signal
  // Hint: private readonly _recentActivities = signal<RecentActivity[]>([]);
  private _recentActivities: RecentActivity[] = [];

  // TODO: Convertir _currentTime a signal para reactividad
  // Hint: private readonly _currentTime = signal(new Date());
  private _currentTime = new Date();

  // Signals del servicio de autenticación
  readonly currentUser = this.authService.currentUser;
  readonly userRole = this.authService.userRole;

  // TODO: Exponer recentActivities como readonly signal
  // Hint: readonly recentActivities = this._recentActivities.asReadonly();
  get recentActivities() {
    return this._recentActivities;
  }

  // TODO: Exponer currentTime como readonly signal
  // Hint: readonly currentTime = this._currentTime.asReadonly();
  get currentTime() {
    return this._currentTime;
  }

  // TODO: Implementar dashboardCards como computed signal basado en el rol
  // Hint: readonly dashboardCards = computed(() => { ... });
  // El computed debe retornar diferentes cards según el rol: STUDENT, TEACHER, ADMIN
  readonly dashboardCards = computed(() => {
    const role = this.userRole();
    // Implementar la lógica aquí
    return [];
  });

  // TODO: Implementar welcomeMessage como computed signal
  // Hint: Debe retornar un saludo basado en la hora del día (Buenos días/Buenas tardes/Buenas noches)
  // y el nombre del usuario
  readonly welcomeMessage = computed(() => {
    // Implementar la lógica aquí
    return 'Bienvenido';
  });

  // TODO: Implementar roleDisplayName como computed signal
  // Hint: Debe convertir el UserRole enum a texto legible en español
  readonly roleDisplayName = computed(() => {
    // Implementar la lógica aquí
    return 'Usuario';
  });

  ngOnInit(): void {
    this.loadRecentActivities();

    // TODO: Actualizar el reloj usando signals
    // Hint: Usar setInterval para actualizar _currentTime cada minuto
    // setInterval(() => { this._currentTime.set(new Date()); }, 60000);

    // Inicializar notificaciones de ejemplo tras un pequeño delay
    setTimeout(() => {
      this.notificationService.addMockNotifications();
    }, 2000);
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
    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'assignment',
        title: 'Nueva tarea disponible',
        description: 'Matemáticas - Ejercicios de álgebra',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: '📝'
      },
      {
        id: '2',
        type: 'grade',
        title: 'Calificación publicada',
        description: 'Historia - Examen del tema 3: 8.5/10',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        icon: '📊'
      },
      {
        id: '3',
        type: 'message',
        title: 'Nuevo mensaje',
        description: 'Profesor García: Recordatorio sobre la excursión',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        icon: '💬'
      },
      {
        id: '4',
        type: 'event',
        title: 'Próximo evento',
        description: 'Reunión de padres - 15 de noviembre',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: '📅'
      }
    ];

    // TODO: Actualizar usando signal en lugar de asignación directa
    // Hint: this._recentActivities.set(mockActivities);
    this._recentActivities = mockActivities;
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

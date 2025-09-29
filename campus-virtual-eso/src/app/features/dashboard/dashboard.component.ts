import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="header">
        <h1>¡Bienvenido {{ currentUser()?.name }}!</h1>
        <div class="user-info">
          <span class="role">{{ roleDisplayName() }}</span>
          <button (click)="logout()" class="logout-btn">Salir</button>
        </div>
      </header>

      <!-- Main content -->
      <main class="content">
        @if (currentUser()?.role === UserRole.STUDENT) {
          <!-- Vista Estudiante -->
          <div class="role-section">
            <h2>📚 Panel del Estudiante</h2>
            <div class="cards">
              <div class="card">
                <h3>Materias</h3>
                <p class="big-number">6</p>
                <small>Materias activas</small>
              </div>
              <div class="card">
                <h3>Tareas</h3>
                <p class="big-number">3</p>
                <small>Pendientes</small>
              </div>
              <div class="card">
                <h3>Promedio</h3>
                <p class="big-number">8.5</p>
                <small>Calificación</small>
              </div>
            </div>
          </div>
        }

        @if (currentUser()?.role === UserRole.TEACHER) {
          <!-- Vista Profesor -->
          <div class="role-section">
            <h2>👨‍🏫 Panel del Profesor</h2>
            <div class="cards">
              <div class="card">
                <h3>Grupos</h3>
                <p class="big-number">4</p>
                <small>Asignados</small>
              </div>
              <div class="card">
                <h3>Estudiantes</h3>
                <p class="big-number">85</p>
                <small>Total</small>
              </div>
              <div class="card">
                <h3>Tareas</h3>
                <p class="big-number">12</p>
                <small>Por revisar</small>
              </div>
            </div>
          </div>
        }

        @if (currentUser()?.role === UserRole.ADMIN) {
          <!-- Vista Admin -->
          <div class="role-section">
            <h2>👨‍💼 Panel Administrativo</h2>
            <div class="cards">
              <div class="card">
                <h3>Estudiantes</h3>
                <p class="big-number">324</p>
                <small>Total</small>
              </div>
              <div class="card">
                <h3>Profesores</h3>
                <p class="big-number">28</p>
                <small>Activos</small>
              </div>
              <div class="card">
                <h3>Cursos</h3>
                <p class="big-number">15</p>
                <small>En progreso</small>
              </div>
            </div>
          </div>
        }

        <!-- Acciones rápidas -->
        <section class="actions">
          <h2>⚡ Acciones Rápidas</h2>
          <div class="action-buttons">
            <button class="action-btn">📅 Horario</button>
            <button class="action-btn" (click)="navigateToTasks()">📝 Tareas</button>
            <button class="action-btn">📊 Reportes</button>
            <button class="action-btn">⚙️ Configuración</button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f7fafc;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      margin: 0;
      font-size: 1.8rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .role {
      background: rgba(255,255,255,0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .logout-btn {
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .role-section {
      margin-bottom: 3rem;
    }

    .role-section h2 {
      color: #2d3748;
      margin-bottom: 1.5rem;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .card h3 {
      margin: 0 0 1rem 0;
      color: #4a5568;
      font-size: 1rem;
    }

    .big-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
      margin: 0;
    }

    .card small {
      color: #718096;
    }

    .actions h2 {
      color: #2d3748;
      margin-bottom: 1rem;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .action-btn:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102,126,234,0.2);
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .cards {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
  export class DashboardComponent {
    currentUser: any;
    roleDisplayName: any;

    // Exponer UserRole enum para usar en template
    readonly UserRole = UserRole;

    constructor(public authService: AuthService, private router: Router) {
      this.currentUser = this.authService.currentUser;
      this.roleDisplayName = computed(() => {
        const user = this.currentUser();
        if (!user?.role) return 'Usuario';

        const roleNames: Record<UserRole, string> = {
          [UserRole.STUDENT]: 'Estudiante',
          [UserRole.TEACHER]: 'Profesor',
          [UserRole.ADMIN]: 'Administrador'
        };

        return roleNames[user.role as UserRole] || 'Usuario';
      });
    }

    logout(): void {
      this.authService.logout();
    }

    navigateToTasks(): void {
      this.router.navigate(['/tasks']);
    }
  }
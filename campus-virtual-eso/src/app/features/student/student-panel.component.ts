import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-student-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-panel">
      <h1>📚 Panel del Estudiante</h1>

      <div class="welcome-message">
        <p>Bienvenido, <strong>{{ authService.currentUser()?.name }}</strong></p>
        <p>Acceso exclusivo para <span class="role-badge student">Estudiantes</span></p>
      </div>

      <div class="student-sections">
        <div class="section">
          <h2>📖 Mis Cursos</h2>
          <div class="course-progress">
            <div class="progress-item">
              <span>Angular 20 Avanzado</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 75%"></div>
              </div>
              <span>75%</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>✅ Mis Tareas</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">3</span>
              <span class="label">Pendientes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-panel { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .welcome-message { background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
    .role-badge.student { background: rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 20px; }
    .student-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
    .section { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #17a2b8; }
    .progress-item { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
    .progress-bar { flex: 1; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: #17a2b8; }
    .stats { display: flex; gap: 15px; }
    .stat { text-align: center; flex: 1; }
    .stat .number { display: block; font-size: 24px; font-weight: bold; color: #17a2b8; }
    .stat .label { display: block; font-size: 12px; color: #6c757d; margin-top: 5px; }
  `]
})
export class StudentPanelComponent {
  authService = inject(AuthService);
}
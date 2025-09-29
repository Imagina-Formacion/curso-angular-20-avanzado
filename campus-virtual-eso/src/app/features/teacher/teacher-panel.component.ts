import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-teacher-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="teacher-panel">
      <h1>👨‍🏫 Panel del Profesor</h1>

      <div class="welcome-message">
        <p>Bienvenido, <strong>{{ authService.currentUser()?.name }}</strong></p>
        <p>Panel exclusivo para <span class="role-badge teacher">Profesores</span></p>
      </div>

      <div class="teacher-sections">
        <div class="section">
          <h2>📚 Mis Cursos</h2>
          <div class="course-list">
            <div class="course-item">Angular 20 Avanzado</div>
            <div class="course-item">JavaScript Moderno</div>
            <div class="course-item">TypeScript Fundamentals</div>
          </div>
        </div>

        <div class="section">
          <h2>👥 Mis Estudiantes</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">85</span>
              <span class="label">Estudiantes Activos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .teacher-panel { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .welcome-message { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
    .role-badge.teacher { background: rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 20px; }
    .teacher-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
    .section { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #28a745; }
    .course-item { padding: 10px; background: #f8f9fa; margin: 5px 0; border-radius: 5px; }
    .stats { display: flex; gap: 15px; }
    .stat { text-align: center; flex: 1; }
    .stat .number { display: block; font-size: 24px; font-weight: bold; color: #28a745; }
    .stat .label { display: block; font-size: 12px; color: #6c757d; margin-top: 5px; }
  `]
})
export class TeacherPanelComponent {
  authService = inject(AuthService);
}
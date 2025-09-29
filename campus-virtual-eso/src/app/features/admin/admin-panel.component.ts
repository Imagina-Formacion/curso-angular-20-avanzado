import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-panel">
      <h1>🛠️ Panel de Administración</h1>

      <div class="welcome-message">
        <p>Bienvenido, <strong>{{ authService.currentUser()?.name }}</strong></p>
        <p>Tienes acceso completo al sistema como <span class="role-badge admin">Administrador</span></p>
      </div>

      <div class="admin-sections">
        <div class="section">
          <h2>👥 Gestión de Usuarios</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">324</span>
              <span class="label">Estudiantes</span>
            </div>
            <div class="stat">
              <span class="number">28</span>
              <span class="label">Profesores</span>
            </div>
            <div class="stat">
              <span class="number">3</span>
              <span class="label">Administradores</span>
            </div>
          </div>
          <button class="btn btn-primary">Gestionar Usuarios</button>
        </div>

        <div class="section">
          <h2>📚 Gestión de Cursos</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">15</span>
              <span class="label">Cursos Activos</span>
            </div>
            <div class="stat">
              <span class="number">42</span>
              <span class="label">Módulos</span>
            </div>
            <div class="stat">
              <span class="number">1,247</span>
              <span class="label">Ejercicios</span>
            </div>
          </div>
          <button class="btn btn-primary">Gestionar Cursos</button>
        </div>

        <div class="section">
          <h2>📊 Reportes y Estadísticas</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">89%</span>
              <span class="label">Tasa Completado</span>
            </div>
            <div class="stat">
              <span class="number">4.7</span>
              <span class="label">Satisfacción</span>
            </div>
            <div class="stat">
              <span class="number">2,156</span>
              <span class="label">Horas Estudiadas</span>
            </div>
          </div>
          <button class="btn btn-primary">Ver Reportes</button>
        </div>

        <div class="section">
          <h2>⚙️ Configuración del Sistema</h2>
          <div class="config-items">
            <div class="config-item">
              <span>Modo mantenimiento</span>
              <span class="status inactive">Inactivo</span>
            </div>
            <div class="config-item">
              <span>Backups automáticos</span>
              <span class="status active">Activo</span>
            </div>
            <div class="config-item">
              <span>Notificaciones</span>
              <span class="status active">Activo</span>
            </div>
          </div>
          <button class="btn btn-secondary">Configurar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }

    .welcome-message {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }

    .role-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .role-badge.admin {
      background: rgba(255,255,255,0.3);
      color: white;
    }

    .admin-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
    }

    .section {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-left: 4px solid #3498db;
    }

    .section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 18px;
    }

    .stats {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .stat {
      text-align: center;
      flex: 1;
    }

    .stat .number {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #3498db;
    }

    .stat .label {
      display: block;
      font-size: 12px;
      color: #7f8c8d;
      margin-top: 5px;
    }

    .config-items {
      margin-bottom: 20px;
    }

    .config-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    .status.active {
      background: #d5f4e6;
      color: #27ae60;
    }

    .status.inactive {
      background: #fadbd8;
      color: #e74c3c;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .admin-sections {
        grid-template-columns: 1fr;
      }

      .stats {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class AdminPanelComponent {
  authService = inject(AuthService);
}
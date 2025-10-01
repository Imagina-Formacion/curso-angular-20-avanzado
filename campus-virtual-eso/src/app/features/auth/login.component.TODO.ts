import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models';

// TODO: Convertir a componente standalone
// Hint: Agregar standalone: true y los imports necesarios en el decorador
@Component({
  selector: 'app-login',
  // TODO: Agregar propiedad standalone: true aquí

  // TODO: Agregar imports array con los módulos necesarios
  // Hint: imports: [CommonModule, ReactiveFormsModule]

  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Campus Virtual ESO</h1>
        <p>Accede a tu plataforma educativa</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Email -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="tu@email.com"
            />
            <!-- TODO: Migrar *ngIf a @if (control flow moderno) -->
            <!-- Hint: @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) { ... } -->
            <span class="error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Email es requerido
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Tu contraseña"
            />
            <!-- TODO: Migrar *ngIf a @if (control flow moderno) -->
            <span class="error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Contraseña es requerida
            </span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="!canSubmit()"
            [class.loading]="authService.isLoading()"
          >
            <!-- TODO: Migrar *ngIf/*ngElse a @if/@else (control flow moderno) -->
            <!-- Hint: @if (authService.isLoading()) { ... } @else { ... } -->
            <span *ngIf="authService.isLoading(); else notLoading">
              Iniciando sesión...
            </span>
            <ng-template #notLoading>
              Iniciar Sesión
            </ng-template>
          </button>
        </form>

        <!-- Usuarios demo -->
        <div class="demo-section">
          <h3>👥 Usuarios Demo</h3>
          <button type="button" (click)="quickLogin('student@campus.com')">
            👨‍🎓 Estudiante
          </button>
          <button type="button" (click)="quickLogin('teacher@campus.com')">
            👨‍🏫 Profesor
          </button>
          <button type="button" (click)="quickLogin('admin@campus.com')">
            👨‍💼 Admin
          </button>
          <p><small>Contraseña: <code>password123</code></small></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    h1 {
      text-align: center;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    p {
      text-align: center;
      color: #718096;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #4a5568;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    .error {
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 2rem;
    }

    button[type="submit"]:hover:not(:disabled) {
      background-color: #5a67d8;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-section {
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
      text-align: center;
    }

    .demo-section h3 {
      margin-bottom: 1rem;
      color: #4a5568;
    }

    .demo-section button {
      margin: 0.25rem;
      padding: 0.5rem 1rem;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .demo-section button:hover {
      background: #edf2f7;
    }

    code {
      background: #f1f5f9;
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      font-family: monospace;
    }
  `]
})
export class LoginComponent {
  // TODO: Inyectar AuthService usando inject() en lugar de constructor
  // Hint: private authService = inject(AuthService);
  // Hint: private fb = inject(FormBuilder);

  // Declaración del formulario
  loginForm: any;

  // Constructor tradicional (migrar a inject())
  constructor(public authService: AuthService, private fb: FormBuilder) {
    // Inicialización del formulario
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  // TODO: Implementar computed signal para habilitar/deshabilitar submit
  // Hint: canSubmit = computed(() => this.loginForm.valid && !this.authService.isLoading());
  canSubmit(): boolean {
    return this.loginForm.valid && !this.authService.isLoading();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const credentials: LoginCredentials = {
        email: formValue.email!,
        password: formValue.password!
      };
      this.authService.login(credentials);
    } else {
      // Marcar campos como touched para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  quickLogin(email: string): void {
    this.loginForm.patchValue({
      email: email,
      password: 'password123'
    });
    this.onSubmit();
  }
}

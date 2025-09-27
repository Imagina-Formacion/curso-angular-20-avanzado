import { Component, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Injection con inject() function (Angular 14+)
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Signals para el estado del componente
  private readonly _showPassword = signal(false);
  private readonly _rememberMe = signal(false);

  // Computed signals
  readonly showPassword = this._showPassword.asReadonly();
  readonly rememberMe = this._rememberMe.asReadonly();

  // Form signals
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Computed form validation
  readonly isFormValid = computed(() => this.loginForm.valid);
  readonly emailError = computed(() => {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.invalid && emailControl?.touched) {
      if (emailControl.errors?.['required']) return 'El email es requerido';
      if (emailControl.errors?.['email']) return 'Email inválido';
    }
    return null;
  });

  readonly passwordError = computed(() => {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.invalid && passwordControl?.touched) {
      if (passwordControl.errors?.['required']) return 'La contraseña es requerida';
      if (passwordControl.errors?.['minlength']) return 'Mínimo 6 caracteres';
    }
    return null;
  });

  // Acceso a signals del servicio
  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;
  readonly isAuthenticated = this.authService.isAuthenticated;

  constructor() {
    // Effect para redireccionar cuando se autentica
    effect(() => {
      if (this.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });

    // Cargar credenciales guardadas si existe
    this.loadRememberedCredentials();
  }

  /**
   * Submit del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          if (this.rememberMe()) {
            this.saveCredentials(credentials.email);
          } else {
            this.clearSavedCredentials();
          }
        },
        error: (error) => {
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this._showPassword.update(show => !show);
  }

  /**
   * Toggle remember me
   */
  toggleRememberMe(): void {
    this._rememberMe.update(remember => !remember);
  }

  /**
   * Login rápido con usuarios de prueba
   */
  quickLogin(role: 'student' | 'teacher' | 'admin'): void {
    const credentials = {
      student: { email: 'student@campus.com', password: 'password123' },
      teacher: { email: 'teacher@campus.com', password: 'password123' },
      admin: { email: 'admin@campus.com', password: 'password123' }
    };

    this.loginForm.patchValue(credentials[role]);
    this.onSubmit();
  }

  /**
   * Ir a registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Guardar credenciales en localStorage
   */
  private saveCredentials(email: string): void {
    localStorage.setItem('remembered_email', email);
  }

  /**
   * Cargar credenciales guardadas
   */
  private loadRememberedCredentials(): void {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      this.loginForm.patchValue({ email: rememberedEmail });
      this._rememberMe.set(true);
    }
  }

  /**
   * Limpiar credenciales guardadas
   */
  private clearSavedCredentials(): void {
    localStorage.removeItem('remembered_email');
  }
}
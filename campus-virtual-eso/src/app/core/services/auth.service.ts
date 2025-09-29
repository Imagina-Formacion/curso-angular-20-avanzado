import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { User, LoginCredentials, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals básicos para el estado
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);

  // Computed signals - solo los necesarios
  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isLoading = computed(() => this._isLoading());

  // Usuarios demo para la sesión
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'student@campus.com',
      name: 'Ana García',
      role: UserRole.STUDENT
    },
    {
      id: '2',
      email: 'teacher@campus.com',
      name: 'Carlos López',
      role: UserRole.TEACHER
    },
    {
      id: '3',
      email: 'admin@campus.com',
      name: 'María Rodríguez',
      role: UserRole.ADMIN
    }
  ];

  constructor(private router: Router) {
    // Cargar usuario desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Login simple con validación básica
   */
  login(credentials: LoginCredentials): boolean {
    this._isLoading.set(true);

    // Simular delay de red
    setTimeout(() => {
      const user = this.mockUsers.find(u => u.email === credentials.email);

      if (user && credentials.password === 'password123') {
        this._currentUser.set(user);
        localStorage.setItem('campus_user', JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      } else {
        alert('Credenciales inválidas. Usa password123 para cualquier usuario.');
      }

      this._isLoading.set(false);
    }, 1000);

    return true;
  }

  /**
   * Logout simple
   */
  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('campus_user');
    this.router.navigate(['/login']);
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('campus_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this._currentUser.set(user);
      } catch {
        localStorage.removeItem('campus_user');
      }
    }
  }
}
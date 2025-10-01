import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User, LoginCredentials, UserRole } from '../models';

// TODO: Implementar servicio con Signals básicos
// El servicio ya tiene @Injectable, pero necesita signals para gestionar estado reactivo

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO: Crear signal privado para currentUser
  // Hint: private _currentUser = signal<User | null>(null);
  private _currentUser: User | null = null;

  // TODO: Crear signal privado para isLoading
  // Hint: private _isLoading = signal<boolean>(false);
  private _isLoading: boolean = false;

  // TODO: Crear computed signal para currentUser (readonly)
  // Hint: readonly currentUser = computed(() => this._currentUser());
  get currentUser(): User | null {
    return this._currentUser;
  }

  // TODO: Crear computed signal para isAuthenticated
  // Hint: readonly isAuthenticated = computed(() => !!this._currentUser());
  get isAuthenticated(): boolean {
    return !!this._currentUser;
  }

  // TODO: Crear computed signal para isLoading
  // Hint: readonly isLoading = computed(() => this._isLoading());
  get isLoading(): boolean {
    return this._isLoading;
  }

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
    // TODO: Usar .set() para actualizar el signal _isLoading a true
    // Hint: this._isLoading.set(true);
    this._isLoading = true;

    // Simular delay de red
    setTimeout(() => {
      const user = this.mockUsers.find(u => u.email === credentials.email);

      if (user && credentials.password === 'password123') {
        // TODO: Usar .set() para actualizar el signal _currentUser
        // Hint: this._currentUser.set(user);
        this._currentUser = user;

        localStorage.setItem('campus_user', JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      } else {
        alert('Credenciales inválidas. Usa password123 para cualquier usuario.');
      }

      // TODO: Usar .set() para actualizar el signal _isLoading a false
      // Hint: this._isLoading.set(false);
      this._isLoading = false;
    }, 1000);

    return true;
  }

  /**
   * Logout simple
   */
  logout(): void {
    // TODO: Usar .set() para limpiar el signal _currentUser
    // Hint: this._currentUser.set(null);
    this._currentUser = null;

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
        // TODO: Usar .set() para actualizar el signal _currentUser
        // Hint: this._currentUser.set(user);
        this._currentUser = user;
      } catch {
        localStorage.removeItem('campus_user');
      }
    }
  }
}

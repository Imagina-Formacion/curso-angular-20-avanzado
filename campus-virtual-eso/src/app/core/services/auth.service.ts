import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  User,
  AuthUser,
  LoginCredentials,
  RegisterData,
  UserRole,
  LoginResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  // Signals para el estado de autenticación
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Signals computados (readonly)
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly userRole = computed(() => this._currentUser()?.role || null);
  readonly isStudent = computed(() => this.userRole() === UserRole.STUDENT);
  readonly isTeacher = computed(() => this.userRole() === UserRole.TEACHER);
  readonly isAdmin = computed(() => this.userRole() === UserRole.ADMIN);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Effect para guardar token en localStorage
    effect(() => {
      const user = this._currentUser();
      if (user?.token) {
        localStorage.setItem('auth_token', user.token);
        localStorage.setItem('refresh_token', user.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(user));
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    });

    // Recuperar usuario del localStorage al inicializar
    this.loadUserFromStorage();
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const user: AuthUser = JSON.parse(userData);
        this._currentUser.set(user);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearStorage();
    }
  }

  /**
   * Login con credenciales
   */
  login(credentials: LoginCredentials): Observable<AuthUser> {
    this._isLoading.set(true);
    this._error.set(null);

    // Simulación de API - En producción usar HTTP real
    return this.simulateLogin(credentials).pipe(
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._error.set(error.message || 'Error en el login');
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registro de nuevo usuario
   */
  register(userData: RegisterData): Observable<AuthUser> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.simulateRegister(userData).pipe(
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._error.set(error.message || 'Error en el registro');
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this._currentUser.set(null);
    this._error.set(null);
    this.clearStorage();
    this.router.navigate(['/login']);
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.simulateRefreshToken(refreshToken).pipe(
      tap(newToken => {
        const currentUser = this._currentUser();
        if (currentUser) {
          this._currentUser.set({
            ...currentUser,
            token: newToken
          });
        }
      })
    );
  }

  /**
   * Verificar si el token es válido
   */
  isTokenValid(): boolean {
    const user = this._currentUser();
    if (!user?.token) return false;

    try {
      // Simular validación de token - en producción verificar expiración
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  /**
   * Limpiar storage
   */
  private clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  /**
   * Simulación de login (reemplazar con HTTP real)
   */
  private simulateLogin(credentials: LoginCredentials): Observable<AuthUser> {
    // Usuarios de prueba
    const mockUsers: AuthUser[] = [
      {
        id: '1',
        email: 'student@campus.com',
        name: 'Ana',
        lastName: 'García',
        role: UserRole.STUDENT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        token: this.generateMockToken('1', UserRole.STUDENT),
        refreshToken: 'refresh_token_student'
      },
      {
        id: '2',
        email: 'teacher@campus.com',
        name: 'Carlos',
        lastName: 'López',
        role: UserRole.TEACHER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        token: this.generateMockToken('2', UserRole.TEACHER),
        refreshToken: 'refresh_token_teacher'
      },
      {
        id: '3',
        email: 'admin@campus.com',
        name: 'María',
        lastName: 'Rodríguez',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        token: this.generateMockToken('3', UserRole.ADMIN),
        refreshToken: 'refresh_token_admin'
      }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === credentials.email);

        if (user && credentials.password === 'password123') {
          observer.next(user);
          observer.complete();
        } else {
          observer.error(new Error('Credenciales inválidas'));
        }
      }, 1000); // Simular delay de red
    });
  }

  /**
   * Simulación de registro
   */
  private simulateRegister(userData: RegisterData): Observable<AuthUser> {
    return new Observable(observer => {
      setTimeout(() => {
        const newUser: AuthUser = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          lastName: userData.lastName,
          role: userData.role,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          token: this.generateMockToken(Date.now().toString(), userData.role),
          refreshToken: `refresh_token_${Date.now()}`
        };

        observer.next(newUser);
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Simulación de refresh token
   */
  private simulateRefreshToken(refreshToken: string): Observable<string> {
    return new Observable(observer => {
      setTimeout(() => {
        const newToken = this.generateMockToken('1', UserRole.STUDENT);
        observer.next(newToken);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Generar token mock para testing
   */
  private generateMockToken(userId: string, role: UserRole): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: userId,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    }));
    const signature = btoa('mock_signature');

    return `${header}.${payload}.${signature}`;
  }
}
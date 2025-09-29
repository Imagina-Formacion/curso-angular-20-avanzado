import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { CacheService } from './cache.service';
import { User, UserRole } from '../models/user.model';

export interface UserProfile extends User {
  bio?: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
  };
}

export interface UserStats {
  coursesCompleted: number;
  tasksCompleted: number;
  totalPoints: number;
  streak: number;
  lastActivity: Date;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserSearchFilters {
  role?: UserRole;
  search?: string;
  active?: boolean;
  courseId?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly cacheService = inject(CacheService);

  // Obtener perfil del usuario actual
  getCurrentUser(): Observable<UserProfile> {
    const cacheKey = 'user:current';

    return this.cacheService.get(
      cacheKey,
      () => this.apiService.get<UserProfile>('/users/me').pipe(
        map(response => response.data)
      ),
      { ttl: 300000, tags: ['user', 'current-user'] } // 5 minutos
    );
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<UserProfile> {
    const cacheKey = `user:${id}`;

    return this.cacheService.get(
      cacheKey,
      () => this.apiService.get<UserProfile>(`/users/${id}`).pipe(
        map(response => response.data)
      ),
      { ttl: 600000, tags: ['user'] } // 10 minutos
    );
  }

  // Obtener múltiples usuarios
  getUsers(filters?: UserSearchFilters): Observable<{
    users: UserProfile[];
    total: number;
    page: number;
    limit: number;
  }> {
    const cacheKey = `users:${JSON.stringify(filters || {})}`;

    return this.cacheService.get(
      cacheKey,
      () => this.apiService.get<{
        users: UserProfile[];
        total: number;
        page: number;
        limit: number;
      }>('/users', filters).pipe(
        map(response => response.data)
      ),
      { ttl: 180000, tags: ['users', 'user-list'] } // 3 minutos
    );
  }

  // Buscar usuarios
  searchUsers(query: string, limit: number = 10): Observable<UserProfile[]> {
    return this.getUsers({
      search: query,
      limit,
      page: 1
    }).pipe(
      map(response => response.users)
    );
  }

  // Obtener usuarios por rol
  getUsersByRole(role: UserRole): Observable<UserProfile[]> {
    const cacheKey = `users:role:${role}`;

    return this.cacheService.get(
      cacheKey,
      () => this.getUsers({ role }).pipe(
        map(response => response.users)
      ),
      { ttl: 600000, tags: ['users', 'user-role'] } // 10 minutos
    );
  }

  // Actualizar perfil del usuario actual
  updateCurrentUser(updates: UpdateUserRequest): Observable<UserProfile> {
    return this.apiService.put<UserProfile>('/users/me', updates).pipe(
      map(response => response.data),
      switchMap(updatedUser => {
        // Invalidar cache relacionado
        this.cacheService.invalidateByTag('current-user');
        this.cacheService.delete(`user:${updatedUser.id}`);

        // Actualizar cache con nuevos datos
        this.cacheService.set('user:current', updatedUser, {
          ttl: 300000,
          tags: ['user', 'current-user']
        });

        return [updatedUser];
      })
    );
  }

  // Actualizar avatar
  updateAvatar(file: File): Observable<{ avatarUrl: string }> {
    return this.apiService.uploadFile<{ avatarUrl: string }>('/users/me/avatar', file).pipe(
      map(response => response.data),
      switchMap(result => {
        // Invalidar cache del usuario actual
        this.cacheService.invalidateByTag('current-user');
        return [result];
      })
    );
  }

  // Actualizar preferencias
  updatePreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    return this.apiService.patch<UserPreferences>('/users/me/preferences', preferences).pipe(
      map(response => response.data),
      switchMap(updatedPreferences => {
        // Invalidar cache relacionado
        this.cacheService.invalidateByTag('current-user');
        return [updatedPreferences];
      })
    );
  }

  // Obtener estadísticas del usuario
  getUserStats(userId?: string): Observable<UserStats> {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/me/stats';
    const cacheKey = userId ? `user-stats:${userId}` : 'user-stats:current';

    return this.cacheService.get(
      cacheKey,
      () => this.apiService.get<UserStats>(endpoint).pipe(
        map(response => response.data)
      ),
      { ttl: 300000, tags: ['user-stats'] } // 5 minutos
    );
  }

  // Seguir/dejar de seguir usuario
  followUser(userId: string): Observable<boolean> {
    return this.apiService.post<{ following: boolean }>(`/users/${userId}/follow`, {}).pipe(
      map(response => response.data.following),
      switchMap(following => {
        // Invalidar cache relacionado
        this.cacheService.delete(`user:${userId}`);
        this.cacheService.invalidateByTag('current-user');
        return [following];
      })
    );
  }

  unfollowUser(userId: string): Observable<boolean> {
    return this.apiService.delete<{ following: boolean }>(`/users/${userId}/follow`).pipe(
      map(response => response.data.following),
      switchMap(following => {
        // Invalidar cache relacionado
        this.cacheService.delete(`user:${userId}`);
        this.cacheService.invalidateByTag('current-user');
        return [following];
      })
    );
  }

  // Obtener seguidores
  getFollowers(userId?: string): Observable<UserProfile[]> {
    const endpoint = userId ? `/users/${userId}/followers` : '/users/me/followers';
    const cacheKey = userId ? `followers:${userId}` : 'followers:current';

    return this.cacheService.get(
      cacheKey,
      () => this.apiService.get<UserProfile[]>(endpoint).pipe(
        map(response => response.data)
      ),
      { ttl: 300000, tags: ['followers'] } // 5 minutos
    );
  }

  // Obtener usuarios seguidos
  getFollowing(userId?: string): Observable<UserProfile[]> {
    const endpoint = userId ? `/users/${userId}/following` : '/users/me/following';
    const cacheKey = userId ? `following:${userId}` : 'following:current';

    return this.cacheService.get(
      cacheKey,
      () => this.apiService.get<UserProfile[]>(endpoint).pipe(
        map(response => response.data)
      ),
      { ttl: 300000, tags: ['following'] } // 5 minutos
    );
  }

  // Verificar disponibilidad de email
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.apiService.get<{ available: boolean }>('/users/check-email', { email }).pipe(
      map(response => response.data.available)
    );
  }

  // Cambiar contraseña
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.apiService.patch<{ success: boolean }>('/users/me/password', {
      currentPassword,
      newPassword
    }).pipe(
      map(response => response.data.success)
    );
  }

  // Eliminar cuenta
  deleteAccount(password: string): Observable<boolean> {
    return this.apiService.post<{ success: boolean }>('/users/me/delete', { password }).pipe(
      map(response => response.data.success),
      switchMap(success => {
        if (success) {
          // Limpiar todo el cache del usuario
          this.cacheService.clear();
        }
        return [success];
      })
    );
  }

  // Exportar datos del usuario
  exportUserData(): Observable<Blob> {
    return this.apiService.get<Blob>('/users/me/export').pipe(
      map(response => response.data)
    );
  }

  // Métodos utilitarios

  // Verificar si el usuario actual puede editar otro perfil
  canEditUser(targetUserId: string): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(currentUser => {
        if (currentUser.id === targetUserId) return true;
        if (currentUser.role === UserRole.ADMIN) return true;
        return false;
      })
    );
  }

  // Obtener nombre completo formateado
  getDisplayName(user: User): string {
    return user.name || user.email.split('@')[0];
  }

  // Verificar si usuario tiene rol específico
  hasRole(user: User, role: UserRole): boolean {
    return user.role === role;
  }

  // Verificar si usuario es administrador
  isAdmin(user: User): boolean {
    return this.hasRole(user, UserRole.ADMIN);
  }

  // Verificar si usuario es profesor
  isTeacher(user: User): boolean {
    return this.hasRole(user, UserRole.TEACHER);
  }

  // Verificar si usuario es estudiante
  isStudent(user: User): boolean {
    return this.hasRole(user, UserRole.STUDENT);
  }
}
import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  autoClose?: boolean;
  duration?: number; // milisegundos
}

export type NotificationType = Notification['type'];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  // Signals públicos de solo lectura
  readonly notifications = this._notifications.asReadonly();

  // Computed signals
  readonly unreadCount = computed(() =>
    this._notifications().filter(n => !n.read).length
  );

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  readonly recentNotifications = computed(() =>
    this._notifications().slice(0, 5) // Solo las 5 más recientes
  );

  readonly notificationsByType = computed(() => {
    const notifications = this._notifications();
    return {
      info: notifications.filter(n => n.type === 'info').length,
      success: notifications.filter(n => n.type === 'success').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      error: notifications.filter(n => n.type === 'error').length
    };
  });

  /**
   * Agregar una nueva notificación
   */
  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
      autoClose: notification.type !== 'error', // Los errores no se cierran automáticamente
      duration: this.getDefaultDuration(notification.type),
      ...notification
    };

    // Agregar al inicio de la lista y limitar a 50 notificaciones máximo
    this._notifications.update(notifications =>
      [newNotification, ...notifications].slice(0, 50)
    );

    // Auto-cerrar si está configurado
    if (newNotification.autoClose && newNotification.duration) {
      setTimeout(() => {
        this.remove(newNotification.id);
      }, newNotification.duration);
    }

    return newNotification.id;
  }

  /**
   * Métodos de conveniencia para diferentes tipos de notificación
   */
  info(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      title,
      message,
      type: 'info',
      ...options
    });
  }

  success(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      title,
      message,
      type: 'success',
      ...options
    });
  }

  warning(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      title,
      message,
      type: 'warning',
      ...options
    });
  }

  error(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      title,
      message,
      type: 'error',
      autoClose: false, // Los errores requieren acción manual
      ...options
    });
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(id: string): void {
    this._notifications.update(notifications =>
      notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllAsRead(): void {
    this._notifications.update(notifications =>
      notifications.map(n => ({ ...n, read: true }))
    );
  }

  /**
   * Remover una notificación específica
   */
  remove(id: string): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Limpiar todas las notificaciones
   */
  clear(): void {
    this._notifications.set([]);
  }

  /**
   * Limpiar solo las notificaciones leídas
   */
  clearRead(): void {
    this._notifications.update(notifications =>
      notifications.filter(n => !n.read)
    );
  }

  /**
   * Obtener una notificación específica por ID
   */
  getById(id: string): Notification | undefined {
    return this._notifications().find(n => n.id === id);
  }

  /**
   * Simular notificaciones de ejemplo para demostración
   */
  addMockNotifications(): void {
    // Agregar algunas notificaciones de ejemplo
    setTimeout(() => {
      this.info(
        'Bienvenido al Campus Virtual',
        'Has iniciado sesión correctamente en el sistema'
      );
    }, 1000);

    setTimeout(() => {
      this.success(
        'Tarea entregada',
        'Tu tarea de Matemáticas ha sido entregada exitosamente'
      );
    }, 3000);

    setTimeout(() => {
      this.warning(
        'Recordatorio',
        'Tienes una evaluación de Historia programada para mañana'
      );
    }, 5000);

    // Solo mostrar error de ejemplo en desarrollo
    if (!this.isProduction()) {
      setTimeout(() => {
        this.error(
          'Error de conexión',
          'No se pudo conectar con el servidor de calificaciones'
        );
      }, 7000);
    }
  }

  /**
   * Generar ID único para notificaciones
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtener duración por defecto según el tipo
   */
  private getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case 'success': return 4000;
      case 'info': return 5000;
      case 'warning': return 6000;
      case 'error': return 0; // Sin auto-close
      default: return 5000;
    }
  }

  /**
   * Verificar si estamos en producción
   */
  private isProduction(): boolean {
    return false; // Por ahora siempre en desarrollo
  }
}
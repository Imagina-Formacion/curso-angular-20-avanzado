import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  autoClose?: boolean;
  duration?: number;
}

export type NotificationType = Notification['type'];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // TODO: Crear signal privado para almacenar notificaciones
  // Hint: private readonly _notifications = signal<Notification[]>([]);
  private _notifications: Notification[] = [];

  // TODO: Exponer notifications como readonly signal
  // Hint: readonly notifications = this._notifications.asReadonly();
  get notifications() {
    return this._notifications;
  }

  // TODO: Implementar unreadCount como computed signal
  // Hint: Debe contar las notificaciones que tienen read === false
  // readonly unreadCount = computed(() => this._notifications().filter(n => !n.read).length);
  get unreadCount() {
    return this._notifications.filter(n => !n.read).length;
  }

  // TODO: Implementar hasUnread como computed signal
  // Hint: Debe retornar true si hay al menos una notificación no leída
  // readonly hasUnread = computed(() => this.unreadCount() > 0);
  get hasUnread() {
    return this.unreadCount > 0;
  }

  // TODO: Implementar recentNotifications como computed signal
  // Hint: Debe retornar solo las 5 notificaciones más recientes
  // readonly recentNotifications = computed(() => this._notifications().slice(0, 5));
  get recentNotifications() {
    return this._notifications.slice(0, 5);
  }

  // TODO: Implementar notificationsByType como computed signal
  // Hint: Debe retornar un objeto con el conteo de notificaciones por tipo
  // readonly notificationsByType = computed(() => { ... });
  get notificationsByType() {
    return {
      info: 0,
      success: 0,
      warning: 0,
      error: 0
    };
  }

  /**
   * Agregar una nueva notificación
   */
  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
      autoClose: notification.type !== 'error',
      duration: this.getDefaultDuration(notification.type),
      ...notification
    };

    // TODO: Usar update() para agregar la notificación de forma inmutable
    // Hint: this._notifications.update(notifications => [newNotification, ...notifications].slice(0, 50));
    this._notifications = [newNotification, ...this._notifications].slice(0, 50);

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
      autoClose: false,
      ...options
    });
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(id: string): void {
    // TODO: Usar update() con map para marcar como leída de forma inmutable
    // Hint: this._notifications.update(notifications =>
    //   notifications.map(n => n.id === id ? { ...n, read: true } : n)
    // );
    const notification = this._notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllAsRead(): void {
    // TODO: Usar update() con map para marcar todas como leídas
    // Hint: this._notifications.update(notifications =>
    //   notifications.map(n => ({ ...n, read: true }))
    // );
    this._notifications.forEach(n => n.read = true);
  }

  /**
   * Remover una notificación específica
   */
  remove(id: string): void {
    // TODO: Usar update() con filter para remover de forma inmutable
    // Hint: this._notifications.update(notifications =>
    //   notifications.filter(n => n.id !== id)
    // );
    this._notifications = this._notifications.filter(n => n.id !== id);
  }

  /**
   * Limpiar todas las notificaciones
   */
  clear(): void {
    // TODO: Usar set() para limpiar el array
    // Hint: this._notifications.set([]);
    this._notifications = [];
  }

  /**
   * Limpiar solo las notificaciones leídas
   */
  clearRead(): void {
    // TODO: Usar update() con filter para mantener solo las no leídas
    // Hint: this._notifications.update(notifications =>
    //   notifications.filter(n => !n.read)
    // );
    this._notifications = this._notifications.filter(n => !n.read);
  }

  /**
   * Obtener una notificación específica por ID
   */
  getById(id: string): Notification | undefined {
    // TODO: Acceder al signal usando ()
    // Hint: return this._notifications().find(n => n.id === id);
    return this._notifications.find(n => n.id === id);
  }

  /**
   * Simular notificaciones de ejemplo para demostración
   */
  addMockNotifications(): void {
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

    if (!this.isProduction()) {
      setTimeout(() => {
        this.error(
          'Error de conexión',
          'No se pudo conectar con el servidor de calificaciones'
        );
      }, 7000);
    }
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case 'success': return 4000;
      case 'info': return 5000;
      case 'warning': return 6000;
      case 'error': return 0;
      default: return 5000;
    }
  }

  private isProduction(): boolean {
    return false;
  }
}

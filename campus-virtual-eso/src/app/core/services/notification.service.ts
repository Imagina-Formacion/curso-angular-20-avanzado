import { Injectable, signal } from '@angular/core';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  private readonly defaultDurations = {
    [NotificationType.INFO]: 4000,
    [NotificationType.SUCCESS]: 3000,
    [NotificationType.WARNING]: 5000,
    [NotificationType.ERROR]: 7000
  };

  // Métodos principales para mostrar notificaciones
  info(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: NotificationType.INFO,
      title,
      message,
      ...options
    });
  }

  success(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: NotificationType.SUCCESS,
      title,
      message,
      ...options
    });
  }

  warning(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: NotificationType.WARNING,
      title,
      message,
      ...options
    });
  }

  error(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: NotificationType.ERROR,
      title,
      message,
      ...options
    });
  }

  // Método genérico para mostrar notificaciones
  show(notification: Partial<Notification> & { type: NotificationType; message: string }): string {
    const id = this.generateId();
    const duration = notification.duration ?? this.defaultDurations[notification.type];

    const fullNotification: Notification = {
      id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      duration,
      persistent: notification.persistent ?? false,
      actions: notification.actions,
      timestamp: new Date()
    };

    // Añadir notificación
    this._notifications.update(notifications => [...notifications, fullNotification]);

    // Auto-dismiss si no es persistente
    if (!fullNotification.persistent && duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  // Descartar notificación específica
  dismiss(id: string): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  // Descartar todas las notificaciones
  dismissAll(): void {
    this._notifications.set([]);
  }

  // Descartar por tipo
  dismissByType(type: NotificationType): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.type !== type)
    );
  }

  // Obtener notificación específica
  getNotification(id: string): Notification | undefined {
    return this._notifications().find(n => n.id === id);
  }

  // Contar notificaciones por tipo
  getCountByType(type: NotificationType): number {
    return this._notifications().filter(n => n.type === type).length;
  }

  // Verificar si hay notificaciones de error
  hasErrors(): boolean {
    return this.getCountByType(NotificationType.ERROR) > 0;
  }

  // Obtener todas las notificaciones de error
  getErrors(): Notification[] {
    return this._notifications().filter(n => n.type === NotificationType.ERROR);
  }

  // Generar ID único para notificaciones
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos de conveniencia para casos específicos
  confirmAction(message: string, onConfirm: () => void, onCancel?: () => void): string {
    return this.show({
      type: NotificationType.WARNING,
      title: 'Confirmar acción',
      message,
      persistent: true,
      actions: [
        {
          label: 'Confirmar',
          action: () => {
            onConfirm();
            this.dismiss(this.generateId());
          },
          style: 'primary'
        },
        {
          label: 'Cancelar',
          action: () => {
            if (onCancel) onCancel();
            this.dismiss(this.generateId());
          },
          style: 'secondary'
        }
      ]
    });
  }

  showProgress(message: string, title?: string): string {
    return this.show({
      type: NotificationType.INFO,
      title,
      message,
      persistent: true
    });
  }

  updateProgress(id: string, message: string): void {
    this._notifications.update(notifications =>
      notifications.map(n =>
        n.id === id ? { ...n, message } : n
      )
    );
  }

  completeProgress(id: string, successMessage?: string): void {
    if (successMessage) {
      this.success(successMessage);
    }
    this.dismiss(id);
  }

  // Limpiar notificaciones antiguas (más de 24 horas)
  cleanup(): void {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    this._notifications.update(notifications =>
      notifications.filter(n => n.timestamp > oneDayAgo || n.persistent)
    );
  }
}
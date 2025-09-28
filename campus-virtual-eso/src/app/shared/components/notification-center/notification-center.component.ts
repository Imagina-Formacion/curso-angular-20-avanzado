import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService, Notification } from '../../../core/services/notification.service';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, HasRoleDirective],
  template: `
    <div class="notification-center">
      <!-- Botón de notificaciones -->
      <button
        class="notification-button"
        (click)="togglePanel()"
        [class.has-unread]="notificationService.hasUnread()"
      >
        <span class="notification-icon">🔔</span>
        @if (notificationService.unreadCount() > 0) {
          <span class="notification-badge">
            {{ notificationService.unreadCount() }}
          </span>
        }
      </button>

      <!-- Panel de notificaciones -->
      @if (showPanel()) {
        <div class="notification-panel">
          <div class="notification-header">
            <h3>Notificaciones</h3>
            <div class="notification-actions">
              @if (notificationService.hasUnread()) {
                <button
                  class="mark-all-read-btn"
                  (click)="markAllAsRead()"
                  title="Marcar todas como leídas"
                >
                  ✓ Todas
                </button>
              }
              <button
                class="clear-btn"
                (click)="clearRead()"
                title="Limpiar leídas"
                *appHasRole="[UserRole.ADMIN, UserRole.TEACHER]"
              >
                🗑️
              </button>
            </div>
          </div>

          <div class="notifications-list">
            @if (notificationService.notifications().length === 0) {
              <div class="no-notifications">
                <span class="no-notifications-icon">📭</span>
                <p>No hay notificaciones</p>
              </div>
            } @else {
              @for (notification of notificationService.notifications(); track notification.id) {
                <div
                  class="notification-item"
                  [class.unread]="!notification.read"
                  [class]="'notification-' + notification.type"
                  (click)="markAsRead(notification.id)"
                >
                  <div class="notification-content">
                    <div class="notification-icon-type">
                      {{ getNotificationIcon(notification.type) }}
                    </div>
                    <div class="notification-body">
                      <h4 class="notification-title">{{ notification.title }}</h4>
                      <p class="notification-message">{{ notification.message }}</p>
                      <span class="notification-time">
                        {{ getRelativeTime(notification.timestamp) }}
                      </span>
                    </div>
                    <button
                      class="notification-close"
                      (click)="removeNotification($event, notification.id)"
                      title="Cerrar notificación"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              }
            }
          </div>

          @if (notificationService.notifications().length > 0) {
            <div class="notification-footer">
              <button
                class="clear-all-btn"
                (click)="clearAll()"
                *appHasRole="UserRole.ADMIN"
              >
                Limpiar todas
              </button>
            </div>
          }
        </div>
      }

      <!-- Overlay para cerrar el panel -->
      @if (showPanel()) {
        <div class="notification-overlay" (click)="closePanel()"></div>
      }
    </div>
  `,
  styles: [`
    .notification-center {
      position: relative;
      display: inline-block;
    }

    .notification-button {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .notification-button:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .notification-button.has-unread .notification-icon {
      animation: ring 2s infinite;
    }

    .notification-icon {
      font-size: 1.5rem;
      display: block;
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-weight: bold;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-panel {
      position: absolute;
      top: 100%;
      right: 0;
      width: 380px;
      max-height: 500px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      overflow: hidden;
    }

    .notification-header {
      padding: 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }

    .notification-actions {
      display: flex;
      gap: 8px;
    }

    .mark-all-read-btn,
    .clear-btn {
      background: none;
      border: 1px solid #ddd;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .mark-all-read-btn:hover,
    .clear-btn:hover {
      background: #f0f0f0;
    }

    .notifications-list {
      max-height: 350px;
      overflow-y: auto;
    }

    .no-notifications {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-notifications-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 8px;
    }

    .notification-item {
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .notification-item:hover {
      background-color: #f8f9fa;
    }

    .notification-item.unread {
      background-color: #f0f8ff;
    }

    .notification-content {
      display: flex;
      padding: 12px 16px;
      gap: 12px;
    }

    .notification-icon-type {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .notification-body {
      flex-grow: 1;
    }

    .notification-title {
      margin: 0 0 4px 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
    }

    .notification-message {
      margin: 0 0 6px 0;
      font-size: 0.85rem;
      color: #666;
      line-height: 1.3;
    }

    .notification-time {
      font-size: 0.75rem;
      color: #999;
    }

    .notification-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      padding: 4px;
      border-radius: 4px;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .notification-item:hover .notification-close {
      opacity: 1;
    }

    .notification-close:hover {
      background: #f0f0f0;
      color: #666;
    }

    .notification-footer {
      padding: 12px 16px;
      background: #f8f9fa;
      border-top: 1px solid #eee;
      text-align: center;
    }

    .clear-all-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: background-color 0.2s ease;
    }

    .clear-all-btn:hover {
      background: #c82333;
    }

    .notification-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    }

    /* Estilos por tipo de notificación */
    .notification-info .notification-icon-type { color: #17a2b8; }
    .notification-success .notification-icon-type { color: #28a745; }
    .notification-warning .notification-icon-type { color: #ffc107; }
    .notification-error .notification-icon-type { color: #dc3545; }

    @keyframes ring {
      0%, 100% { transform: rotate(0deg); }
      10%, 30% { transform: rotate(-10deg); }
      20% { transform: rotate(10deg); }
    }
  `]
})
export class NotificationCenterComponent {
  readonly notificationService = inject(NotificationService);
  readonly UserRole = UserRole;

  private readonly _showPanel = signal(false);
  readonly showPanel = this._showPanel.asReadonly();

  togglePanel(): void {
    this._showPanel.update(show => !show);
  }

  closePanel(): void {
    this._showPanel.set(false);
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(event: Event, id: string): void {
    event.stopPropagation();
    this.notificationService.remove(id);
  }

  clearRead(): void {
    this.notificationService.clearRead();
  }

  clearAll(): void {
    this.notificationService.clear();
    this.closePanel();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📢';
    }
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'Ahora mismo';
    } else if (minutes < 60) {
      return `hace ${minutes} min`;
    } else if (hours < 24) {
      return `hace ${hours}h`;
    } else {
      return `hace ${days}d`;
    }
  }
}
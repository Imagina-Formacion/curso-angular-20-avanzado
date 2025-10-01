import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect
} from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';

/**
 * Directiva estructural que muestra/oculta elementos basado en roles de usuario
 *
 * @example
 * ```html
 * <button *appHasRole="['admin', 'teacher']">
 *   Solo administradores y profesores
 * </button>
 *
 * <div *appHasRole="'student'">
 *   Solo estudiantes
 * </div>
 * ```
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  // TODO: Inyectar AuthService
  // Hint: private readonly authService = inject(AuthService);

  // TODO: Inyectar TemplateRef para acceder al template
  // Hint: private readonly templateRef = inject(TemplateRef);

  // TODO: Inyectar ViewContainerRef para manipular la vista
  // Hint: private readonly viewContainer = inject(ViewContainerRef);

  private allowedRoles: UserRole[] = [];

  constructor() {
    // TODO: Implementar effect reactivo que llame a updateView()
    // Hint: effect(() => { this.updateView(); });
    // El effect debe configurarse en el constructor para tener injection context
  }

  @Input()
  set appHasRole(roles: UserRole | UserRole[]) {
    // TODO: Normalizar entrada a array
    // Hint: this.allowedRoles = Array.isArray(roles) ? roles : [roles];

    // TODO: Actualizar vista inmediatamente
    // Hint: this.updateView();
  }

  /**
   * Actualiza la vista basado en el rol actual del usuario
   */
  private updateView(): void {
    // TODO: Obtener el rol actual del usuario desde el signal
    // Hint: const currentUserRole = this.authService.userRole();

    // TODO: Verificar si el usuario tiene alguno de los roles permitidos
    // Hint: const hasPermission = currentUserRole !== null && this.allowedRoles.includes(currentUserRole);

    // TODO: Implementar lógica condicional:
    // Si tiene permiso:
    //   - Verificar si la vista ya está creada (this.viewContainer.length === 0)
    //   - Si no está creada, crear embedded view: this.viewContainer.createEmbeddedView(this.templateRef)
    // Si no tiene permiso:
    //   - Limpiar el contenedor: this.viewContainer.clear()
  }
}

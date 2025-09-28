import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  DestroyRef
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
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private allowedRoles: UserRole[] = [];

  constructor() {
    // Effect reactivo configurado en constructor
    effect(() => {
      this.updateView();
    });
  }

  @Input()
  set appHasRole(roles: UserRole | UserRole[]) {
    // Normalizar entrada a array
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    // Actualizar vista inmediatamente
    this.updateView();
  }

  /**
   * Actualiza la vista basado en el rol actual del usuario
   */
  private updateView(): void {
    const currentUserRole = this.authService.userRole();

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasPermission = currentUserRole !== null && this.allowedRoles.includes(currentUserRole);

    if (hasPermission) {
      // Mostrar el elemento si tiene permisos
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      // Ocultar el elemento si no tiene permisos
      this.viewContainer.clear();
    }
  }
}
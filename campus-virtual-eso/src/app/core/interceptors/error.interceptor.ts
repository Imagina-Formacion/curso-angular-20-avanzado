import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
  timestamp: string;
  code?: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = normalizeError(error);

      // Log del error
      console.error('HTTP Error:', {
        url: req.url,
        method: req.method,
        error: apiError
      });

      // Manejar errores según el código de estado
      handleErrorByStatus(apiError, notificationService);

      return throwError(() => apiError);
    })
  );
};

function normalizeError(error: HttpErrorResponse): ApiError {
  let apiError: ApiError;

  if (error.status === 0) {
    // Error de red
    apiError = {
      message: 'Error de conexión. Verifica tu conexión a internet.',
      status: 0,
      timestamp: new Date().toISOString(),
      code: 'NETWORK_ERROR'
    };
  } else if (error.error && typeof error.error === 'object') {
    // Error de API estructurado
    apiError = {
      message: error.error.message || 'Error desconocido',
      status: error.status,
      errors: error.error.errors || [],
      timestamp: new Date().toISOString(),
      code: error.error.code || `HTTP_${error.status}`
    };
  } else {
    // Error genérico
    apiError = {
      message: error.message || getDefaultErrorMessage(error.status),
      status: error.status || 500,
      timestamp: new Date().toISOString(),
      code: `HTTP_${error.status || 500}`
    };
  }

  return apiError;
}

function handleErrorByStatus(error: ApiError, notificationService: NotificationService): void {
  switch (error.status) {
    case 400:
      notificationService.warning(
        error.message || 'Los datos enviados no son válidos.'
      );
      break;

    case 401:
      // No mostrar notificación para 401, se maneja en authInterceptor
      break;

    case 403:
      notificationService.error(
        'No tienes permisos para realizar esta acción.'
      );
      break;

    case 404:
      notificationService.info(
        error.message || 'El recurso solicitado no fue encontrado.'
      );
      break;

    case 409:
      notificationService.warning(
        error.message || 'Conflicto con el estado actual del recurso.'
      );
      break;

    case 422:
      // Errores de validación - mostrar errores específicos
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => notificationService.warning(err));
      } else {
        notificationService.warning(error.message || 'Datos no válidos.');
      }
      break;

    case 429:
      notificationService.warning(
        'Demasiadas peticiones. Intenta nuevamente en unos minutos.'
      );
      break;

    case 500:
      notificationService.error(
        'Error interno del servidor. Nuestro equipo ha sido notificado.'
      );
      break;

    case 502:
    case 503:
    case 504:
      notificationService.error(
        'El servicio no está disponible temporalmente. Intenta más tarde.'
      );
      break;

    case 0:
      notificationService.error(
        'Error de conexión. Verifica tu conexión a internet.'
      );
      break;

    default:
      // Para códigos de error no manejados específicamente
      if (error.status >= 400 && error.status < 500) {
        // Errores del cliente
        notificationService.warning(error.message || 'Error en la petición.');
      } else if (error.status >= 500) {
        // Errores del servidor
        notificationService.error(error.message || 'Error del servidor.');
      }
      break;
  }
}

function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Petición incorrecta',
    401: 'No autorizado',
    403: 'Acceso prohibido',
    404: 'Recurso no encontrado',
    409: 'Conflicto',
    422: 'Datos no procesables',
    429: 'Demasiadas peticiones',
    500: 'Error interno del servidor',
    502: 'Gateway incorrecto',
    503: 'Servicio no disponible',
    504: 'Tiempo de espera agotado'
  };

  return messages[status] || `Error HTTP ${status}`;
}
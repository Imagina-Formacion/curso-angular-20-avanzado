import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || 'https://api.campus-virtual.edu';

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Obtener token del localStorage (en producción vendría del AuthService)
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  private handleError = (error: any): Observable<never> => {
    let apiError: ApiError;

    if (error.status === 0) {
      // Network error
      apiError = {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
        timestamp: new Date().toISOString()
      };
    } else if (error.error && typeof error.error === 'object') {
      // API error response
      apiError = {
        message: error.error.message || 'Error desconocido',
        status: error.status,
        errors: error.error.errors || [],
        timestamp: new Date().toISOString()
      };
    } else {
      // Generic error
      apiError = {
        message: error.message || 'Error interno del servidor',
        status: error.status || 500,
        timestamp: new Date().toISOString()
      };
    }

    console.error('API Error:', apiError);
    return throwError(() => apiError);
  };

  // GET request
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => {
              httpParams = httpParams.append(key, value.toString());
            });
          } else {
            httpParams = httpParams.append(key, params[key].toString());
          }
        }
      });
    }

    return this.http.get<ApiResponse<T>>(this.buildUrl(endpoint), {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // POST request
  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.buildUrl(endpoint), body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT request
  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.buildUrl(endpoint), body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // PATCH request
  patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.buildUrl(endpoint), body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.buildUrl(endpoint), {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Upload file
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers = new HttpHeaders();
    // No establecer Content-Type para multipart/form-data, el browser lo hace automáticamente

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<ApiResponse<T>>(this.buildUrl(endpoint), formData, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Health check
  healthCheck(): Observable<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  // Batch requests
  batch<T>(requests: Array<{ method: string; endpoint: string; body?: any }>): Observable<ApiResponse<T[]>> {
    return this.post('/batch', { requests });
  }
}
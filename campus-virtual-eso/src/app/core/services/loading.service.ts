import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _requestCount = signal(0);
  private readonly _isLoading = signal(false);

  readonly requestCount = this._requestCount.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  show(): void {
    this._requestCount.update(count => {
      const newCount = count + 1;
      this._isLoading.set(newCount > 0);
      return newCount;
    });
  }

  hide(): void {
    this._requestCount.update(count => {
      const newCount = Math.max(0, count - 1);
      this._isLoading.set(newCount > 0);
      return newCount;
    });
  }

  // Forzar reset (para casos de error crítico)
  reset(): void {
    this._requestCount.set(0);
    this._isLoading.set(false);
  }

  // Para mostrar loading manual (fuera de HTTP)
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }
}
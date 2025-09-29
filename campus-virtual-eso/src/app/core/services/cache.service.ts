import { Injectable } from '@angular/core';
import { Observable, of, share, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  observable?: Observable<T>;
  tags?: string[];
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  forceRefresh?: boolean;
  tags?: string[]; // For cache invalidation by tags
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTtl = environment.cache.defaultTtl;
  private readonly maxSize = environment.cache.maxSize;

  // Obtener dato del cache o ejecutar la función proveedora
  get<T>(
    key: string,
    provider: () => Observable<T>,
    options: CacheOptions = {}
  ): Observable<T> {
    const { ttl = this.defaultTtl, forceRefresh = false, tags = [] } = options;

    // Si se fuerza la actualización, eliminar del cache
    if (forceRefresh) {
      this.delete(key);
    }

    const cached = this.cache.get(key);

    // Si existe en cache y no ha expirado
    if (cached && !this.isExpired(cached)) {
      // Si hay una petición en curso, retornar el observable existente
      if (cached.observable) {
        return cached.observable;
      }
      // Si no, retornar los datos cacheados
      return of(cached.data);
    }

    // Si no existe o ha expirado, hacer nueva petición
    const request$ = provider().pipe(
      tap(data => {
        // Guardar en cache cuando se recibe la respuesta
        this.set(key, data, { ttl, tags });
      }),
      share() // Compartir el observable entre múltiples suscriptores
    );

    // Guardar el observable en curso para evitar peticiones duplicadas
    if (cached) {
      cached.observable = request$;
    } else {
      this.cache.set(key, {
        data: null,
        timestamp: Date.now(),
        ttl,
        observable: request$
      });
    }

    return request$;
  }

  // Establecer valor en cache
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const { ttl = this.defaultTtl, tags = [] } = options;

    // Limpiar cache si excede el tamaño máximo
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      tags: tags.length > 0 ? tags : undefined
    });
  }

  // Obtener valor sin ejecutar provider
  getSync<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached || this.isExpired(cached)) {
      return null;
    }

    return cached.data;
  }

  // Verificar si existe una clave
  has(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && !this.isExpired(cached);
  }

  // Eliminar una clave específica
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Eliminar múltiples claves
  deleteMany(keys: string[]): void {
    keys.forEach(key => this.cache.delete(key));
  }

  // Invalidar cache por tags
  invalidateByTag(tag: string): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.tags && entry.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    });

    this.deleteMany(keysToDelete);
  }

  // Limpiar todo el cache
  clear(): void {
    this.cache.clear();
  }

  // Limpiar entradas expiradas
  clearExpired(): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    this.deleteMany(keysToDelete);
  }

  // Obtener estadísticas del cache
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: { key: string; size: number; ttl: number; expired: boolean }[];
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: JSON.stringify(entry.data).length,
      ttl: entry.ttl,
      expired: this.isExpired(entry)
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
      entries
    };
  }

  // Verificar si una entrada ha expirado
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  // Eliminar la entrada más antigua
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Calcular tasa de aciertos (simplificado)
  private calculateHitRate(): number {
    // En una implementación completa, rastrearías hits vs misses
    return 0.85; // Valor simulado
  }

  // Calentar cache con datos iniciales
  warmUp<T>(entries: Array<{ key: string; provider: () => Observable<T>; options?: CacheOptions }>): void {
    entries.forEach(({ key, provider, options }) => {
      this.get(key, provider, options).subscribe({
        next: () => console.log(`Cache warmed up for key: ${key}`),
        error: (error) => console.error(`Failed to warm up cache for key: ${key}`, error)
      });
    });
  }

  // Auto-limpieza periódica
  startAutoCleanup(intervalMs: number = 300000): void { // 5 minutos por defecto
    timer(0, intervalMs).subscribe(() => {
      this.clearExpired();
    });
  }
}
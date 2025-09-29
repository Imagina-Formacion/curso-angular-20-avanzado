import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  // Solo cachear peticiones GET
  if (req.method !== 'GET') {
    return next(req);
  }

  // Excluir ciertas rutas del caché
  const excludePaths = ['/auth/', '/logout', '/refresh-token'];
  if (excludePaths.some(path => req.url.includes(path))) {
    return next(req);
  }

  // Generar clave de caché basada en URL y parámetros
  const cacheKey = generateCacheKey(req.url, req.params.toString());

  // Verificar si hay headers de control de caché personalizados
  const cacheControl = req.headers.get('Cache-Control');
  const forceRefresh = cacheControl === 'no-cache';

  // TTL personalizado desde headers
  const customTtl = req.headers.get('X-Cache-TTL');
  const ttl = customTtl ? parseInt(customTtl, 10) : undefined;

  // Tags personalizados desde headers
  const customTags = req.headers.get('X-Cache-Tags');
  const tags = customTags ? customTags.split(',').map(tag => tag.trim()) : ['http-cache'];

  return cacheService.get(
    cacheKey,
    () => next(req).pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          console.log(`Cacheando respuesta para: ${req.url}`, { ttl, tags });
        }
      })
    ),
    { ttl, forceRefresh, tags }
  );
};

function generateCacheKey(url: string, params: string): string {
  const baseKey = url.replace(/^https?:\/\/[^\/]+/, ''); // Remover dominio
  return params ? `${baseKey}?${params}` : baseKey;
}
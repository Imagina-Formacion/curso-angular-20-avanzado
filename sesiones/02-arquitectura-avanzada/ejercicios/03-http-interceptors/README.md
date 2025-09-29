# Ejercicio 3: HTTP Interceptors Avanzados

## 🎯 Objetivo
Implementar interceptores HTTP funcionais para autenticación, logging, caché y manejo de errores.

## 📋 Descripción
Crear una cadena de interceptores que manejen diferentes aspectos de las comunicaciones HTTP de forma transparente.

## 🔧 Pasos del Ejercicio

### Paso 1: Interceptor de Autenticación
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Añadir token de autorización
  // Manejar renovación automática
  // Redirigir en caso de expiración
};
```

### Paso 2: Interceptor de Logging
- Log de requests y responses
- Tiempo de respuesta
- Análisis de errores
- Métricas de rendimiento

### Paso 3: Interceptor de Caché
- Caché GET requests
- Headers de cache control
- Invalidación inteligente
- Estrategias de cache (fresh, stale-while-revalidate)

### Paso 4: Interceptor de Error Global
- Transformación de errores HTTP
- Notificaciones automáticas
- Retry condicional
- Fallback responses

## 🎨 Código Base

```typescript
// Configuración de interceptores
export const httpInterceptors = [
  authInterceptor,
  loggingInterceptor,
  cacheInterceptor,
  errorInterceptor
];

// En main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors(httpInterceptors)
    )
  ]
});
```

## ✅ Criterios de Aceptación

- [ ] Los interceptores son funcionais (no clases)
- [ ] La autenticación se maneja automáticamente
- [ ] Los logs proporcionan información útil
- [ ] El caché mejora la performance
- [ ] Los errores se transforman consistentemente
- [ ] Los interceptores son composables
- [ ] Los tests verifican cada interceptor

## 💡 Consejos

1. Usa el patrón chain of responsibility
2. Evita side effects en interceptores
3. Considera el orden de ejecución
4. Implementa conditional logic
5. Mantén interceptores focalizados

## 🔗 Recursos

- [HTTP Interceptors](https://angular.dev/guide/http/interceptors)
- [Functional Interceptors](https://angular.dev/guide/http/interceptors#functional-interceptors)
- [Cache Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
# Ejercicio 2: Servicios Avanzados y HTTP

## 🎯 Objetivo
Desarrollar servicios escalables con manejo avanzado de HTTP, caché y gestión de errores.

## 📋 Descripción
Crear un sistema de servicios para una API REST con funcionalidades avanzadas como retry, caché, loading states y error handling.

## 🔧 Pasos del Ejercicio

### Paso 1: Servicio base con generics
```typescript
abstract class BaseApiService<T> {
  protected abstract apiUrl: string;
  protected http = inject(HttpClient);

  // Implementar métodos base CRUD
}
```

### Paso 2: Implementar caché inteligente
- Cache con expiración
- Invalidación selectiva
- Cache compartido entre componentes

### Paso 3: Manejo de errores robusto
- Retry automático con backoff
- Transformación de errores
- Notificaciones de error centralizadas

### Paso 4: Loading states
- Loading indicators por operación
- Estados de loading globales
- Progress tracking para uploads

## 🎨 Código Base

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService<User> {
  protected apiUrl = '/api/users';

  // Estado con signals
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Implementar métodos específicos
}
```

## ✅ Criterios de Aceptación

- [ ] El servicio base proporciona funcionalidad común
- [ ] El caché optimiza las requests repetidas
- [ ] Los errores se manejan de forma consistente
- [ ] Los retry funcionan con exponential backoff
- [ ] Los loading states son precisos
- [ ] La API es type-safe
- [ ] Los tests cubren casos críticos

## 💡 Consejos

1. Usa generics para reutilización
2. Implementa caché con Map o WeakMap
3. Usa operators de RxJS para retry
4. Considera el estado offline
5. Implementa timeout personalizado

## 🔗 Recursos

- [HTTP Client](https://angular.dev/guide/http)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Error Handling](https://angular.dev/guide/http/error-handling)
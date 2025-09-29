# Ejercicio 1: Gestión de Estado Avanzada

## 🎯 Objetivo
Implementar un sistema de gestión de estado escalable usando Angular Signals sin librerías externas.

## 📋 Descripción
Crear un store para gestionar el estado de una lista de tareas con funcionalidades CRUD, filtros y persistencia local.

## 🔧 Pasos del Ejercicio

### Paso 1: Crear el modelo de datos
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  tags: string[];
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
  error: string | null;
}
```

### Paso 2: Implementar el TaskStore
- Crear un servicio `TaskStore` con signals
- Implementar selectores computados
- Añadir métodos para CRUD operations
- Gestionar estado de loading y errores

### Paso 3: Crear componentes de UI
- Lista de tareas con filtros
- Formulario para crear/editar tareas
- Indicadores de estado
- Manejo de errores

### Paso 4: Persistencia
- Guardar estado en localStorage
- Cargar estado al inicializar
- Sincronización automática

## 🎨 Código Base

```typescript
@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  // Implementar aquí el store con signals
}
```

## ✅ Criterios de Aceptación

- [ ] El store maneja todo el estado con signals
- [ ] Los selectores computados optimizan las consultas
- [ ] Las operaciones CRUD actualizan correctamente el estado
- [ ] Los filtros funcionan reactivamente
- [ ] La persistencia se mantiene entre sesiones
- [ ] Los errores se manejan apropiadamente
- [ ] La interfaz es reactiva a cambios de estado

## 💡 Consejos

1. Usa `signal()` para estado mutable
2. Usa `computed()` para derivaciones
3. Usa `effect()` para efectos secundarios
4. Mantén las actualizaciones inmutables
5. Considera el rendimiento en listas grandes

## 🔗 Recursos

- [Angular Signals](https://angular.dev/guide/signals)
- [State Management Patterns](https://angular.dev/guide/signals#state-management)
# Ejercicio 5: Servicios con Signals

## 🎯 Objetivo
Crear un servicio que gestione el estado de la aplicación usando Signals, implementando un patrón de estado reactivo.

## 📋 Requisitos a implementar
- ✅ Servicio con estado basado en signals
- ✅ Gestión de una lista de tareas (TodoService)
- ✅ Métodos para CRUD de tareas
- ✅ Computed properties para estadísticas
- ✅ Estado compartido entre componentes

## 📚 Conceptos a aplicar
- **@Injectable**: Servicio singleton
- **signal()**: Para el estado reactivo
- **computed()**: Para valores derivados
- **update()**: Para modificar el estado
- **Inyección de dependencias**: Para compartir estado

## 🛠️ Instrucciones

### Paso 1: Definir el modelo
1. Crea el archivo `todo.service.ts` en esta carpeta
2. Define una interface `Todo`:
   - `id: number`
   - `text: string`
   - `completed: boolean`
   - `createdAt: Date`

### Paso 2: Crear el servicio
1. Importa `Injectable`, `signal`, `computed` de `@angular/core`
2. Marca el servicio con `@Injectable({ providedIn: 'root' })`
3. Crea un signal privado para almacenar las tareas
4. Expón el signal como readonly para lectura

### Paso 3: Implementar métodos CRUD
1. `agregar(texto: string)`: Agrega nueva tarea
   - Genera ID único
   - Usa `.update()` para modificar el signal
2. `eliminar(id: number)`: Elimina tarea por ID
3. `toggleCompletado(id: number)`: Cambia estado
4. `editarTexto(id: number, nuevoTexto: string)`: Edita texto
5. `limpiarCompletadas()`: Elimina todas las completadas

### Paso 4: Agregar computed properties
1. `totalTareas`: Computed con el total
2. `tareasCompletadas`: Computed con las completadas
3. `tareasPendientes`: Computed con las pendientes
4. `porcentajeCompletado`: Computed con el porcentaje

### Paso 5: Crear componente que use el servicio
1. Inyecta el TodoService
2. Usa los signals del servicio en el template
3. Llama a los métodos del servicio
4. Muestra las estadísticas computadas

## ✅ Verificación

### Comando para verificar tu solución:
```bash
npm run verify:exercise 05-servicios-signals
```

### Criterios de evaluación:
El verificador comprobará que:
- Uses `@Injectable` con providedIn: 'root'
- Uses `signal()` para el estado
- Implementes métodos para agregar/eliminar
- Uses `.update()` para modificar el signal
- La estructura del servicio sea correcta

## 💡 Pistas
- Los signals privados: `private _todos = signal<Todo[]>([])`
- Exponer como readonly: `readonly todos = this._todos.asReadonly()`
- Update con spread: `.update(todos => [...todos, newTodo])`
- Computed se declara como propiedad: `total = computed(() => this._todos().length)`
- El servicio se inyecta en el constructor

## 📖 Recursos útiles
- [Angular Services](https://angular.dev/guide/services)
- [Dependency Injection](https://angular.dev/guide/di)
- [Signals in Services](https://angular.dev/guide/signals#signals-in-services)
- [State Management with Signals](https://angular.dev/guide/signals/model)

## ❓ ¿Necesitas ayuda?
Si encuentras dificultades:
1. Verifica que uses `@Injectable({ providedIn: 'root' })`
2. Los signals deben inicializarse con un array vacío
3. Usa `.update()` para modificar, no asignación directa
4. El archivo debe llamarse exactamente `todo.service.ts`
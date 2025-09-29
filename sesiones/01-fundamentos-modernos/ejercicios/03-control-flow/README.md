# Ejercicio 3: Control Flow Syntax

## 🎯 Objetivo
Dominar la nueva sintaxis de control de flujo de Angular (@if, @for, @empty) para crear interfaces dinámicas.

## 📋 Requisitos a implementar
- ✅ Lista de tareas que se pueda agregar y eliminar elementos
- ✅ Mostrar mensaje cuando la lista esté vacía
- ✅ Condicional para mostrar/ocultar elementos completados
- ✅ Usar track para optimizar el renderizado
- ✅ Botón para alternar vista de completados

## 📚 Conceptos a aplicar
- **@if**: Para condicionales en templates
- **@for**: Para iterar sobre listas
- **@empty**: Para manejar listas vacías
- **track**: Para optimizar el renderizado de listas
- **Signals**: Para el estado reactivo

## 🛠️ Instrucciones

### Paso 1: Crear la estructura
1. Crea el archivo `lista.component.ts` en esta carpeta
2. Define un componente standalone con selector `app-lista`
3. Importa `signal` de `@angular/core`

### Paso 2: Definir el modelo de datos
1. Crea una interface `Tarea` con:
   - `id: number`
   - `texto: string`
   - `completada: boolean`
2. Crea un signal para almacenar un array de tareas
3. Crea un signal booleano para mostrar/ocultar completadas

### Paso 3: Implementar la lógica
1. Método `agregarTarea(texto: string)`
   - Genera un ID único
   - Agrega la nueva tarea al signal
2. Método `eliminarTarea(id: number)`
3. Método `toggleCompletada(id: number)`
4. Método `toggleMostrarCompletadas()`

### Paso 4: Crear el template con control flow
1. Input y botón para agregar tareas
2. Botón para mostrar/ocultar completadas
3. Usa `@for` para iterar las tareas:
   ```html
   @for (tarea of tareas(); track tarea.id) {
     <!-- contenido -->
   } @empty {
     <!-- mensaje cuando no hay tareas -->
   }
   ```
4. Usa `@if` para mostrar/ocultar tareas completadas
5. Implementa checkbox y botón eliminar para cada tarea

### Paso 5: Optimización
1. Asegúrate de usar `track` con el id de cada tarea
2. Esto evita re-renderizar toda la lista cuando cambia

## ✅ Verificación

### Comando para verificar tu solución:
```bash
npm run verify:exercise 03-control-flow
```

### Criterios de evaluación:
El verificador comprobará que:
- Uses `@if` para condicionales
- Uses `@for` para iterar la lista
- Uses `@empty` para el mensaje de lista vacía
- Implementes `track` correctamente

## 💡 Pistas
- La sintaxis `@for` requiere siempre un `track`
- `@empty` va dentro del bloque `@for`
- Puedes anidar `@if` dentro de `@for`
- Para actualizar arrays en signals usa `.update()`
- El track debe ser una propiedad única (como el id)

## 📖 Recursos útiles
- [Control Flow Syntax](https://angular.dev/guide/templates/control-flow)
- [@for block](https://angular.dev/api/core/@for)
- [@if block](https://angular.dev/api/core/@if)

## ❓ ¿Necesitas ayuda?
Si encuentras dificultades:
1. Revisa que uses la sintaxis exacta: `@if`, `@for`, `@empty`
2. No olvides el `track` en `@for`
3. Los signals de arrays se actualizan con `.update(arr => [...arr, nuevoItem])`
4. El archivo debe llamarse exactamente `lista.component.ts`
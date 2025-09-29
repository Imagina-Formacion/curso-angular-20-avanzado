# Ejercicio 4: Componentes Standalone con Comunicación

## 🎯 Objetivo
Crear componentes standalone que se comuniquen entre sí usando las nuevas APIs de Angular (input/output functions).

## 📋 Requisitos a implementar
- ✅ Componente Card standalone reutilizable
- ✅ Comunicación padre-hijo con input()
- ✅ Emisión de eventos con output()
- ✅ Tipado fuerte con interfaces
- ✅ Componente contenedor que gestione múltiples cards

## 📚 Conceptos a aplicar
- **standalone: true**: Componentes independientes
- **input()**: Nueva API para recibir datos
- **output()**: Nueva API para emitir eventos
- **Interfaces**: Para tipado seguro
- **CommonModule**: Para directivas básicas

## 🛠️ Instrucciones

### Paso 1: Definir la interface
1. Crea el archivo `card.component.ts` en esta carpeta
2. Define una interface `CardData` con:
   - `id: number`
   - `title: string`
   - `description: string`
   - `imageUrl: string`
   - `active: boolean`

### Paso 2: Crear el componente Card
1. Importa `Component`, `input`, `output` de `@angular/core`
2. Crea un componente standalone con selector `app-card`
3. Define inputs usando la función `input()`:
   - Un input para recibir los datos de la card
4. Define outputs usando la función `output()`:
   - Un evento para cuando se hace click
   - Un evento para cuando se elimina

### Paso 3: Implementar el template
1. Muestra la imagen (si existe)
2. Muestra título y descripción
3. Indica visualmente si está activa
4. Botones para activar/desactivar y eliminar
5. Usa clases condicionales para el estado

### Paso 4: Crear componente contenedor
1. Crea un array de cards de ejemplo
2. Importa el CardComponent
3. Usa @for para mostrar múltiples cards
4. Maneja los eventos emitidos por las cards
5. Implementa lógica para activar/desactivar y eliminar

### Paso 5: Estilos y presentación
1. Añade estilos para que las cards se vean atractivas
2. Usa CSS Grid o Flexbox para el layout
3. Añade transiciones para los estados

## ✅ Verificación

### Comando para verificar tu solución:
```bash
npm run verify:exercise 04-standalone-components
```

### Criterios de evaluación:
El verificador comprobará que:
- El componente sea `standalone: true`
- Importes `CommonModule`
- Uses `input()` o `@Input` para recibir datos
- Uses `output()` o `@Output` para emitir eventos
- La estructura del componente sea correcta

## 💡 Pistas
- La nueva sintaxis es: `data = input<CardData>()`
- Para outputs: `cardClick = output<number>()`
- Los inputs se leen como signals: `data()`
- Los outputs se emiten con `.emit()`
- No olvides importar CommonModule para usar directivas

## 📖 Recursos útiles
- [Standalone Components](https://angular.dev/guide/components)
- [Component Inputs](https://angular.dev/guide/components/inputs)
- [Component Outputs](https://angular.dev/guide/components/outputs)
- [Signal Inputs](https://angular.dev/guide/signals/inputs)

## ❓ ¿Necesitas ayuda?
Si encuentras dificultades:
1. Verifica que hayas marcado `standalone: true`
2. Asegúrate de importar todos los módulos necesarios
3. Con la nueva API, los inputs son signals
4. El archivo debe llamarse exactamente `card.component.ts`
# Ejercicio 1: Signals Básicos

## 🎯 Objetivo
Crear un componente contador que demuestre el uso básico de Angular Signals y computed properties.

## 📋 Requisitos a implementar
- ✅ Un contador que inicie en 0
- ✅ Mostrar el valor actual del contador
- ✅ Mostrar automáticamente el doble del valor usando computed
- ✅ Botón para incrementar en 1
- ✅ Botón para decrementar en 1

## 📚 Conceptos a aplicar
- **signal()**: Para crear estado reactivo
- **computed()**: Para valores derivados que se actualizan automáticamente
- **update()**: Para modificar el valor del signal

## 🛠️ Instrucciones

### Paso 1: Estructura del componente
1. Crea el archivo `contador.component.ts` en esta carpeta
2. Define un componente standalone con el selector `app-contador`
3. Importa los módulos necesarios (CommonModule)

### Paso 2: Implementar el estado
1. Importa `signal` y `computed` de `@angular/core`
2. Crea una propiedad `contador` usando `signal()` con valor inicial 0
3. Crea una propiedad `doble` usando `computed()` que calcule el doble del contador

### Paso 3: Implementar la lógica
1. Crea un método `incrementar()` que aumente el contador en 1
   - 💡 Tip: Usa `.update()` para modificar el signal
2. Crea un método `decrementar()` que disminuya el contador en 1

### Paso 4: Crear el template
1. Muestra el título "Contador con Signals"
2. Muestra el valor actual del contador
   - 💡 Recuerda: Los signals se leen con `()`
3. Muestra el valor del doble
4. Agrega botones para incrementar y decrementar

## ✅ Verificación

### Comando para verificar tu solución:
```bash
npm run verify:exercise 01-signals-basicos
```

### Criterios de evaluación:
El verificador comprobará que:
- Uses `signal(0)` para inicializar el contador
- Uses `computed()` para calcular el doble
- Existan los métodos `incrementar` y `decrementar`
- El signal se actualice correctamente

## 💡 Pistas
- Los signals son funciones, por eso se leen con `()`
- `computed()` recibe una función que retorna el valor calculado
- `update()` recibe una función que transforma el valor actual
- No olvides importar todo lo necesario de `@angular/core`

## 📖 Recursos útiles
- [Documentación oficial de Signals](https://angular.dev/guide/signals)
- [Guía de computed signals](https://angular.dev/guide/signals#computed-signals)
- Usa el snippet `ang20-signal` si lo tienes configurado

## ❓ ¿Necesitas ayuda?
Si te quedas atascado:
1. Revisa que hayas importado correctamente signal y computed
2. Verifica que estés usando `()` para leer los signals en el template
3. Asegúrate de que el archivo se llame exactamente `contador.component.ts`
4. Consulta con tu instructor si necesitas orientación adicional
# Ejercicio 2: Formularios Reactivos con Signals

## 🎯 Objetivo
Crear un formulario de usuario combinando Reactive Forms con Angular Signals para gestionar el estado y validación.

## 📋 Requisitos a implementar
- ✅ Formulario con campos email y password
- ✅ Validación de email formato correcto
- ✅ Validación de campos obligatorios
- ✅ Botón submit habilitado solo cuando el formulario es válido
- ✅ Mostrar el estado de validación usando computed

## 📚 Conceptos a aplicar
- **FormBuilder**: Para crear formularios reactivos
- **Validators**: Para validaciones (required, email)
- **computed()**: Para derivar el estado de validación
- **Integración** de Reactive Forms con Signals

## 🛠️ Instrucciones

### Paso 1: Configuración inicial
1. Crea el archivo `usuario-form.component.ts` en esta carpeta
2. Importa `ReactiveFormsModule` en los imports del componente
3. Importa `FormBuilder` y `Validators` de `@angular/forms`
4. Importa `computed` de `@angular/core`

### Paso 2: Crear el formulario
1. Inyecta `FormBuilder` en el constructor
2. Crea una propiedad `loginForm` usando `FormBuilder.group()`
3. Define los campos:
   - `email`: Con validaciones required y email
   - `password`: Con validación required

### Paso 3: Implementar validación reactiva
1. Crea un computed `canSubmit` que verifique:
   - Que el formulario sea válido
   - Que no esté en proceso de envío (opcional)
2. Este computed debe retornar true/false

### Paso 4: Crear el template
1. Vincula el formulario con `[formGroup]`
2. Usa `formControlName` para cada campo
3. Vincula el botón submit con el computed `canSubmit()`
4. Muestra mensajes de error cuando los campos sean inválidos y touched

### Paso 5: Implementar el método submit
1. Crea el método `onSubmit()`
2. Valida que el formulario sea válido antes de procesar
3. Si no es válido, marca todos los campos como touched

## ✅ Verificación

### Comando para verificar tu solución:
```bash
npm run verify:exercise 02-formularios-reactivos
```

### Criterios de evaluación:
El verificador comprobará que:
- Uses `FormBuilder` para crear el formulario
- Implementes `Validators.required` y `Validators.email`
- Uses `computed()` para el estado de validación
- El formulario tenga la estructura correcta

## 💡 Pistas
- FormBuilder se inyecta en el constructor: `constructor(private fb: FormBuilder)`
- Las validaciones se pasan como array: `['', [Validators.required, Validators.email]]`
- computed puede acceder al formulario: `computed(() => this.loginForm.valid)`
- Para marcar como touched: `this.loginForm.get('email')?.markAsTouched()`

## 📖 Recursos útiles
- [Reactive Forms Guide](https://angular.dev/guide/forms/reactive-forms)
- [Form Validation](https://angular.dev/guide/forms/form-validation)
- [Signals con Forms](https://angular.dev/guide/signals#signals-and-forms)

## ❓ ¿Necesitas ayuda?
Si encuentras dificultades:
1. Verifica que hayas importado ReactiveFormsModule
2. Asegúrate de usar la sintaxis correcta de FormBuilder
3. Recuerda que computed es una función que retorna el valor calculado
4. El archivo debe llamarse exactamente `usuario-form.component.ts`
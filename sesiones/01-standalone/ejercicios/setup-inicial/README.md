# 🔧 Ejercicio 1: Migración a Standalone Components

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Migrar un componente tradicional a standalone
- Eliminar NgModules de una aplicación simple
- Implementar el nuevo control flow de Angular 20
- Configurar bootstrap moderno sin módulos

## ⏱️ Duración: 15 minutos

---

## 📋 Desafío: Migra tu Primera App a Standalone

### 🎯 **Tu Misión:**
Tienes una aplicación Angular tradicional con NgModules y necesitas migrarla a la nueva arquitectura standalone de Angular 20.

### 📦 **Proyecto Inicial:**
Crea un nuevo proyecto Angular 20:
```bash
ng new welcome-app --standalone --style=scss --routing=false
cd welcome-app
```

### 🚀 **Tareas a Completar:**

#### ✅ **Tarea 1: Componente Welcome Standalone (5 min)**
Crea un componente `WelcomeComponent` que:
- Sea standalone (sin necesidad de NgModule)
- Muestre un mensaje de bienvenida con tu nombre
- Use el nuevo control flow `@if` para mostrar/ocultar contenido
- Implemente un input para capturar el nombre del usuario

**Requisitos técnicos:**
- Usar `standalone: true`
- Importar solo `CommonModule` y `FormsModule`
- Usar `[(ngModel)]` para two-way binding
- Implementar `@if/@else` para lógica condicional

#### ✅ **Tarea 2: Lista de Características (5 min)**
Añade al componente una lista de características que:
- Use el nuevo control flow `@for` para renderizar items
- Muestre las ventajas de standalone components
- Implemente `@switch` para diferentes tipos de características

**Requisitos técnicos:**
- Array de características con tipo y descripción
- `@for` con track function
- `@switch/@case/@default` para íconos según tipo

#### ✅ **Tarea 3: Bootstrap Moderno (5 min)**
Configura el bootstrap de la aplicación:
- Elimina `app.module.ts` si existe
- Configura `main.ts` con `bootstrapApplication()`
- Integra tu WelcomeComponent en AppComponent

**Requisitos técnicos:**
- `bootstrapApplication()` en lugar de `platformBrowserDynamic()`
- AppComponent standalone
- Import directo de WelcomeComponent

### 🎯 **Criterios de Éxito:**

Tu aplicación debe cumplir:

✅ **Componente standalone funcional** - sin NgModule
✅ **Control flow moderno** - usar @if, @for, @switch
✅ **Bootstrap correcto** - sin app.module.ts
✅ **Interactividad básica** - input con two-way binding
✅ **Estructura limpia** - imports explícitos únicamente

### 📚 **Recursos de Ayuda:**

#### 🔧 **Sintaxis Clave:**
```typescript
// Standalone Component
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  // ... resto de la configuración
})

// Nuevo Control Flow
@if (condition) {
  <p>Mostrar cuando sea true</p>
} @else {
  <p>Mostrar cuando sea false</p>
}

@for (item of items; track item.id) {
  <div>{{item.name}}</div>
}

@switch (value) {
  @case ('option1') { <span>Opción 1</span> }
  @default { <span>Por defecto</span> }
}

// Bootstrap Moderno
bootstrapApplication(AppComponent, {
  providers: [
    // Providers opcionales
  ]
});
```

#### 🎯 **Snippets VS Code Disponibles:**
- `ng20-standalone` - Componente standalone básico
- `ng20-control-flow` - Sintaxis de control flow
- `ng20-bootstrap` - Configuración de bootstrap

### 🚨 **Problemas Comunes:**

❌ **Error:** `Cannot find module 'FormsModule'`
✅ **Solución:** Importar desde `@angular/forms` en el componente

❌ **Error:** `@if is not recognized`
✅ **Solución:** Verificar que uses Angular 20+ y sintaxis correcta

❌ **Error:** `app.module.ts still exists`
✅ **Solución:** Eliminar archivo y usar solo `bootstrapApplication()`

### 🎖️ **Bonus Challenge:**
Si terminas antes, añade:
- 🎨 Estilos CSS personalizados
- 🔄 Estado de carga con spinner
- ✨ Animaciones simples con CSS transitions

---

## ✅ **¿Completaste el ejercicio?**

**Revisa que tengas:**
1. ✅ Componente standalone funcionando
2. ✅ Control flow implementado (@if, @for, @switch)
3. ✅ Bootstrap sin NgModules
4. ✅ Interactividad básica

**¡Listo para el siguiente ejercicio!** 🚀

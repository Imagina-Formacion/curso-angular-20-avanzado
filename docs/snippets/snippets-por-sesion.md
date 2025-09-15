# 📖 Guía de Snippets por Sesión

## 🎯 Objetivo
Esta guía te muestra exactamente qué snippets usar en cada sesión del curso Angular 20 Avanzado.

---

## 📅 SESIÓN 1 - Fundamentos Modernos

### 🎯 Snippets Principales
- `ng20-standalone` - Tu primer componente standalone
- `ng20-signals` - Implementar signals básicos
- `ng20-control-flow` - Nuevo @if, @for, @switch

### 🛠️ Ejercicio Práctico
```typescript
// 1. Crear componente de login
ng20-standalone + Tab

// 2. Agregar signals para el estado
ng20-signals + Tab

// 3. Implementar control flow moderno
ng20-control-flow + Tab
```

### ✅ Al final de la sesión tendrás
- ✅ Componente LoginComponent standalone
- ✅ Signals para usuario y loading
- ✅ Template con @if/@for

---

## 📅 SESIÓN 2 - Change Detection y Directivas

### 🎯 Snippets Principales
- `ng20-computed` - Computed signals
- `ng20-effect` - Effects reactivos
- `ng20-directive` - Directiva personalizada

### 🛠️ Ejercicio Práctico
```typescript
// 1. Optimizar el login con computed
ng20-computed + Tab

// 2. Agregar efectos para logging
ng20-effect + Tab

// 3. Crear directiva para permisos
ng20-directive + Tab
```

---

## 📅 SESIÓN 3 - Formularios Enterprise

### 🎯 Snippets Principales
- `ng20-form-signals` - Formulario con signals
- `ng20-typed-form` - Typed forms
- `ng20-validators` - Validadores custom

### 🛠️ Ejercicio Práctico
```typescript
// 1. Formulario de registro
ng20-form-signals + Tab

// 2. Hacer tipado fuerte
ng20-typed-form + Tab

// 3. Validaciones personalizadas
ng20-validators + Tab
```

---

## 📅 SESIÓN 4 - Routing y Optimización

### 🎯 Snippets Principales
- `ng20-guard` - Guards funcionales
- `ng20-resolver` - Resolvers funcionales
- `ng20-lazy-route` - Rutas lazy optimizadas

### 🛠️ Ejercicio Práctico
```typescript
// 1. Guard de autenticación
ng20-guard + Tab

// 2. Resolver datos de usuario
ng20-resolver + Tab

// 3. Routing lazy moderno
ng20-lazy-route + Tab
```

---

## 📅 SESIÓN 5 - SSR e Hydration (⭐ CLAVE)

### 🎯 Snippets Principales
- `ng20-ssr-component` - Componente SSR-ready
- `ng20-hydration` - Hydration config
- `ng20-meta-tags` - SEO dinámico

### 🛠️ Ejercicio Práctico
```typescript
// 1. Dashboard SSR
ng20-ssr-component + Tab

// 2. Configurar hydration
ng20-hydration + Tab

// 3. Meta tags dinámicos
ng20-meta-tags + Tab
```

### 🔥 Tips Especiales SSR
```typescript
// Verificar si estás en browser
@if (isBrowser()) {
  // Código solo cliente
}

// Lazy load después de hydration
@defer (on timer(1000)) {
  <heavy-component />
}
```

---

## 📅 SESIÓN 6 - Testing y PWA

### 🎯 Snippets Principales
- `ng20-test-signals` - Test con signals
- `ng20-test-component` - Test componente
- `ng20-cypress-test` - E2E moderno

### 🛠️ Ejercicio Práctico
```typescript
// 1. Test del login
ng20-test-signals + Tab

// 2. Test del formulario
ng20-test-component + Tab

// 3. E2E del flujo completo
ng20-cypress-test + Tab
```

---

## 📅 SESIÓN 7 - Estado Global e i18n

### 🎯 Snippets Principales
- `ng20-ngrx-signals` - Store con signals
- `ng20-store-feature` - Feature store
- `ng20-i18n` - Internacionalización

### 🛠️ Ejercicio Práctico
```typescript
// 1. Store de autenticación
ng20-ngrx-signals + Tab

// 2. Feature store de cursos
ng20-store-feature + Tab

// 3. i18n con signals
ng20-i18n + Tab
```

---

## 📅 SESIÓN 8 - Librerías y CI/CD

### 🎯 Snippets Principales
- `ng20-library` - Configuración librería
- `ng20-public-api` - API pública
- `ng20-github-action` - CI/CD

### 🛠️ Ejercicio Práctico
```typescript
// 1. Crear librería UI
ng20-library + Tab

// 2. Exportar API pública
ng20-public-api + Tab

// 3. Pipeline automatizado
ng20-github-action + Tab
```

---

## 📅 SESIÓN 9 - Migración y Deploy

### 🎯 Snippets Principales
- `ng20-migration` - Script migración
- `ng20-deployment` - Config deploy
- `ng20-docker` - Containerización

### 🛠️ Ejercicio Final
```typescript
// 1. Migrar componente legacy
ng20-migration + Tab

// 2. Configurar deploy
ng20-deployment + Tab

// 3. Docker para producción
ng20-docker + Tab
```

---

## 🏆 Resumen: Progresión de Snippets

```
Sesión 1-2: ng20-standalone → ng20-signals → ng20-computed
     ⬇️
Sesión 3-4: ng20-form-signals → ng20-guard → ng20-lazy-route
     ⬇️
Sesión 5:   ng20-ssr-component → ng20-hydration (⭐ CLAVE)
     ⬇️
Sesión 6-7: ng20-test-signals → ng20-ngrx-signals
     ⬇️
Sesión 8-9: ng20-library → ng20-deployment
```

## 💡 Tips Finales

1. **Practica los snippets**: Úsalos aunque sepas escribir el código
2. **Personaliza**: Modifica los snippets según tu estilo
3. **Comparte**: Los snippets funcionan en cualquier proyecto Angular 20
4. **Enseña**: Son perfectos para explicar a otros desarrolladores

---

*Estos snippets te ahorrarán horas de desarrollo y te enseñarán las mejores prácticas de Angular 20 automáticamente.*

**Imagina Formación - Angular 20 Avanzado - 2025**
# Curso Angular 20 Avanzado

## 🚨 INICIO RÁPIDO PARA ESTUDIANTES

### 📥 **Clonar desde Tag Inicial (OBLIGATORIO)**
```bash
git clone --branch v0.0.0 https://github.com/Imagina-Formacion/curso-angular-20-avanzado.git
```

### 📋 **Requisitos y Setup**
- 📖 **[LEER PRIMERO: Requisitos Iniciales](./docs/REQUISITOS-INICIALES.md)** ⚠️
- 🔧 Node.js >= 20.11.1, npm >= 10.0.0
- 🖥️ VS Code con extensiones recomendadas
- ⚡ Setup automático: `npm run setup:complete`

---

## 📋 Información del Curso

- **Duración:** 25 horas distribuidas en 9 sesiones
- **Modalidad:** Presencial online (Zoom)
- **Período:** 29 septiembre - 27 octubre 2025
- **Proyecto Base:** Campus Virtual ESO - Mensajería y Gestión de Cursos

## 📁 Estructura del Proyecto

### Archivos de Configuración
- `curso-estructura.json` - Estructura completa del curso con sesiones, módulos y ejercicios
- `.vscode/snippets/` - Snippets de código para Angular 20

### Snippets Disponibles
- `angular-20-components.json` - Snippets para componentes standalone
- `angular-20-forms.json` - Snippets para formularios con Signals
- `angular-20-ssr.json` - Snippets para SSR e Hydration

## 🎯 Objetivos del Curso

1. **Dominar Angular 20** - Standalone components, Signals, control flow moderno
2. **SSR e Hydration** - Optimización de rendimiento y SEO
3. **Arquitecturas Escalables** - NgRx, microfrontends, testing moderno
4. **Proyecto Real** - Campus virtual completo con todas las tecnologías

## 🚀 Metodología

- **Repositorio inicial:** Estructura base del proyecto
- **Repositorio final:** Todos los ejercicios resueltos
- **GitBook:** Documentación de procedimientos y clases
- **Proyecto incremental:** Campus virtual que se desarrolla sesión a sesión

## 🏷️ Estrategia de Tags - Para Estudiantes

### Tags Oficiales del Curso
- `v0.0.0` - Punto de partida para Sesión 1
- `v1.0.0` - Resultado esperado tras completar Sesión 1
- `v2.0.0` - Resultado esperado tras completar Sesión 2
- `v3.0.0` - Resultado esperado tras completar Sesión 3
- *(y así sucesivamente...)*

### Tags Personales del Estudiante
Al finalizar cada sesión, crear tu propio tag personal:

```bash
# Al terminar Sesión 1
git tag v1.0.0-sesion1 -m "Mi implementación de la Sesión 1"

# Al terminar Sesión 2
git tag v2.0.0-sesion2 -m "Mi implementación de la Sesión 2"
```

### Comandos Útiles

```bash
# Empezar una sesión desde el punto oficial
git checkout v0.0.0  # Para empezar Sesión 1
git checkout v1.0.0  # Para empezar Sesión 2

# Comparar tu trabajo con el resultado esperado
git diff v1.0.0 v1.0.0-sesion1

# Ver todas las versiones disponibles
git tag -l

# Ver diferencias entre versiones oficiales
git diff v0.0.0..v1.0.0 --name-only
```

### Flujo de Trabajo Recomendado

1. **Antes de cada sesión:** `git checkout v[X].0.0` (donde X es la sesión anterior)
2. **Durante la sesión:** Implementar según GitBook
3. **Al finalizar:** Crear tag personal `v[X+1].0.0-sesion[X+1]`
4. **Verificar:** Comparar con tag oficial `v[X+1].0.0`

## 🔧 Herramientas Especiales

- **n8n:** Para traducciones automáticas vía webhooks
- **Migración:** De Angular 17 a Angular 20 documentada
- **Testing:** Jest + Cypress + Angular Testing Library

## 📚 Recursos

- [Angular Documentation](https://angular.dev)
- [Angular Update Guide](https://update.angular.io)
- [GitBook del Curso](pendiente-de-configurar)

---

*Curso desarrollado por Imagina Formación*
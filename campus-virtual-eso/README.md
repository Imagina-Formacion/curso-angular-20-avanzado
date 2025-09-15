# Campus Virtual ESO - Proyecto Base

## 🎓 Curso Angular 20 Avanzado - Imagina Formación

### Descripción del Proyecto
Campus Virtual completo para centros de Educación Secundaria Obligatoria con:
- 🔐 Sistema de autenticación por roles
- 📚 Gestión de cursos y contenidos
- 💬 Mensajería interna
- 📝 Sistema de correcciones
- 📅 Calendario académico

### Estructura del Proyecto
```
src/app/
├── core/           # Servicios singleton, guards, interceptors
├── shared/         # Componentes y utilidades reutilizables  
├── features/       # Módulos funcionales del campus
│   ├── auth/       # Autenticación y autorización
│   ├── dashboard/  # Panel principal por roles
│   ├── courses/    # Gestión de cursos y contenidos
│   ├── messaging/  # Mensajería interna
│   └── calendar/   # Calendario académico
└── layout/         # Layouts y componentes de navegación
```

### Tecnologías Utilizadas
- **Angular 18+** con Standalone Components
- **Signals** para gestión de estado reactiva
- **SCSS** para estilos avanzados
- **TypeScript** en modo strict
- **RxJS** para programación reactiva

### Comandos Disponibles
```bash
npm start              # Servidor de desarrollo (puerto 4200)
npm run build          # Build de producción
npm test               # Tests unitarios
npm run verify         # Verificar configuración del setup
npm run format         # Formatear código con Prettier
```

### Desarrollo por Sesiones
El proyecto evoluciona progresivamente:
- **Sesión 1**: Fundamentos + Signals
- **Sesión 2**: Performance + Directivas
- **Sesión 3**: Formularios + DI
- **Sesión 4**: Routing + Optimización
- **Sesión 5**: SSR + Testing
- **Sesión 6**: PWA + Arquitecturas
- **Sesión 7**: NgRx + i18n
- **Sesión 8**: Librerías + CI/CD
- **Sesión 9**: Migración + Deploy

### Próximos Pasos
1. `npm start` - Iniciar servidor de desarrollo
2. Abrir http://localhost:4200 en el navegador
3. ¡Comenzar con la Sesión 1 del curso!

---
**Imagina Formación - Curso Angular 20 Avanzado**

# 📋 Requisitos Iniciales - Curso Angular 20 Avanzado

## 🚨 IMPORTANTE: Preparación para la Primera Clase

### 📥 **PASO 1: Clonar el Repositorio desde el Tag Inicial**

**⚠️ OBLIGATORIO:** Debes clonar el repositorio desde el tag `v0.0.0` que contiene la estructura inicial limpia.

```bash
# Clonar desde el tag inicial
git clone --branch v0.0.0 https://github.com/Imagina-Formacion/curso-angular-20-avanzado.git

# O si ya tienes el repo clonado
git checkout v0.0.0
```

**🎯 ¿Por qué desde v0.0.0?**
- Estado inicial completamente limpio
- Sin proyectos Angular pre-generados
- Solo archivos de configuración esenciales
- Estructura lista para el setup automático

---

## 💻 **REQUISITOS TÉCNICOS OBLIGATORIOS**

### 🔧 **Software Base**
- **Node.js**: `>= 20.11.1` (⚠️ v18 ya NO soportado en Angular 20)
- **npm**: `>= 10.0.0`
- **Git**: Última versión
- **VS Code**: Última versión

### 📱 **Hardware Mínimo**
- **RAM**: 16GB recomendado (8GB mínimo)
- **Disco**: 20GB libres en SSD
- **Procesador**: Intel i5 8ª gen / AMD Ryzen 5 o superior
- **Conexión**: Banda ancha estable (25 Mbps recomendado)

### 🔗 **Cuentas Necesarias**
- **GitHub**: Cuenta activa
- **NPM**: Cuenta para publicar librerías (sesión 8)
- **Zoom**: Configurado para clases online

---

## 🚀 **SETUP AUTOMÁTICO (Primera Clase)**

### 📝 **Secuencia de Setup en Clase**

1. **Verificar requisitos**:
   ```bash
   npm run verify:requirements
   ```

2. **Setup completo automático**:
   ```bash
   npm run setup:complete
   ```

3. **Verificar instalación**:
   ```bash
   npm run verify:setup
   ```

4. **Iniciar primera sesión**:
   ```bash
   npm run session:start:01
   ```

---

## 📊 **Verificación Pre-Clase**

### ✅ **Checklist de Verificación**

Ejecuta estos comandos ANTES de la primera clase:

```bash
# 1. Verificar Node.js
node --version
# Debe mostrar >= 20.11.1

# 2. Verificar npm
npm --version  
# Debe mostrar >= 10.0.0

# 3. Verificar Git
git --version
# Cualquier versión reciente

# 4. Verificar VS Code
code --version
# Debe abrir VS Code
```

### 🚨 **Si algo falla:**

**Node.js incorrecto:**
```bash
# Usar nvm (recomendado)
nvm install 20.11.1
nvm use 20.11.1
```

**Angular CLI desactualizado:**
```bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

---

## 📚 **Estructura del Tag v0.0.0**

```
curso-angular-20-avanzado/
├── 📁 .github/           # Workflows de CI/CD
├── 📁 .vscode/           # Configuración VS Code
├── 📁 configuraciones/   # Configs del curso (vacía)
├── 📁 docs/              # Documentación
├── 📁 scripts/           # Scripts de setup y gestión
├── 📁 sesiones/          # Sesiones del curso (solo README)
├── 📄 .gitignore         # Exclusiones Git
├── 📄 README.md          # Información general
├── 📄 curso-estructura.json  # Estructura completa
├── 📄 package.json       # Configuración NPM
└── 📄 tsconfig.json      # Configuración TypeScript
```

**❌ Lo que NO está en v0.0.0:**
- ❌ Proyecto Angular `campus-virtual-eso` (se crea en setup)
- ❌ `node_modules/` (se instala en setup)
- ❌ Sesiones desarrolladas (se generan progresivamente)
- ❌ Librerías compiladas (se crean durante el curso)

---

## 🎯 **Objetivos de la Primera Clase**

### 📅 **Sesión 1: Fundamentos Modernos (29 Sept)**

**🕐 15:30-15:45:** Setup y verificación automática
**🕐 15:45-16:30:** Tema 1 - Novedades Angular 20
**🕐 16:30-16:45:** ☕ Descanso
**🕐 16:45-17:30:** Tema 2 - Angular Signals
**🕐 17:30-18:15:** Proyecto Campus Virtual v1.0
**🕐 18:15-18:30:** Q&A y preview Sesión 2

### 🎯 **Al finalizar tendrás:**
- ✅ Entorno Angular 20 funcionando
- ✅ Proyecto Campus Virtual base
- ✅ VS Code configurado con snippets
- ✅ Primer componente con Signals

---

## 📞 **Soporte Técnico**

### 🆘 **Si necesitas ayuda:**
- 📧 **Email**: soporte@imagina-formacion.com
- 💬 **Discord**: Campus Virtual ESO
- 📱 **Teléfono**: Durante las clases

### 🕐 **Horarios de soporte:**
- **Días de clase**: 15:00 - 19:00
- **Resto de semana**: Email/Discord

---

## 🎓 **¡Nos vemos en clase!**

**Fecha**: 29 de septiembre 2025
**Hora**: 15:30 (horario peninsular)
**Plataforma**: Zoom (link se enviará por email)

**🚀 ¡Prepárate para dominar Angular 20!**

---

*Imagina Formación - Angular 20 Avanzado - 2025*
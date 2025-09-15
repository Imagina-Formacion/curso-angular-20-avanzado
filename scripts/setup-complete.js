#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const inquirer = require('inquirer');

const COURSE_CONFIG = {
  projectName: 'campus-virtual-eso',
  projectDir: '.',  // Usar directorio actual
  angularVersion: '20.0.0',  // ✅ ACTUALIZADO Angular 20
  requiredNodeVersion: '20.11.1',  // ✅ CRÍTICO: Node.js v20+ obligatorio
  requiredNpmVersion: '10.0.0'
};

class CourseSetup {
  constructor() {
    this.spinner = ora();
    this.courseDir = process.cwd();
    this.baseProjectDir = this.courseDir;  // Usar directorio actual
    this.projectPath = path.join(this.courseDir, COURSE_CONFIG.projectName);  // campus-virtual-eso
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🎓 SETUP CURSO ANGULAR 20\n') +
      chalk.white('Campus Virtual ESO - Setup Simplificado\n') +
      chalk.gray('Imagina Formación | 2025'),
      { 
        padding: 1, 
        margin: 1, 
        borderStyle: 'double',
        borderColor: 'blue'
      }
    ));

    try {
      await this.checkPrerequisites();
      await this.promptUserChoices();
      
      if (this.options.setupMode !== 'verify') {
        await this.setupProject();
        await this.installDependencies();
        await this.createProjectStructure();
        await this.createInitialFiles();
        await this.createSessionsStructure(); // ✅ NUEVO: Crear estructura de sesiones
      }
      
      this.showSuccessMessage();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkPrerequisites() {
    console.log(chalk.yellow('\n📋 Verificando prerequisitos del sistema...\n'));

    // Node.js - CRÍTICO: Angular 20 requiere Node.js v20+
    this.spinner.start('Verificando Node.js v20+...');
    try {
      const nodeVersion = process.version.slice(1);
      if (this.compareVersions(nodeVersion, COURSE_CONFIG.requiredNodeVersion) < 0) {
        this.spinner.fail('Node.js insuficiente para Angular 20');
        throw new Error(`
❌ CRÍTICO: Angular 20 requiere Node.js v20.11.1+
🔴 Tu versión: ${nodeVersion}
🔴 Node.js v18 ya NO es soportado (EOL: 27 marzo 2025)

🔧 SOLUCIÓN:
1. Instalar Node.js v20+: https://nodejs.org/
2. O usar nvm: nvm install 20.11.1 && nvm use 20.11.1
3. Verificar: node --version

⚠️  Sin Node.js v20+ el curso NO funcionará.
        `);
      }
      this.spinner.succeed(`Node.js ${nodeVersion} ✅`);
    } catch (error) {
      throw error;
    }

    // npm
    this.spinner.start('Verificando npm...');
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      if (this.compareVersions(npmVersion, COURSE_CONFIG.requiredNpmVersion) < 0) {
        throw new Error(`npm ${COURSE_CONFIG.requiredNpmVersion} o superior requerido. Actual: ${npmVersion}`);
      }
      this.spinner.succeed(`npm ${npmVersion} ✅`);
    } catch (error) {
      this.spinner.fail('npm insuficiente');
      throw error;
    }

    // Angular CLI
    this.spinner.start('Verificando Angular CLI...');
    try {
      try {
        const output = execSync('ng version --json', { encoding: 'utf8', stdio: 'pipe' });
        const data = JSON.parse(output);
        const cliVersion = data.cli?.version;
        
        if (!cliVersion || this.compareVersions(cliVersion, COURSE_CONFIG.angularVersion) < 0) {
          this.spinner.warn(`Angular CLI ${cliVersion} desactualizado`);
          await this.updateAngularCLI();
        } else {
          this.spinner.succeed(`Angular CLI ${cliVersion} ✅`);
        }
      } catch {
        this.spinner.warn('Angular CLI no encontrado');
        await this.installAngularCLI();
      }
    } catch (error) {
      this.spinner.fail('Error configurando Angular CLI');
      throw error;
    }
  }

  async installAngularCLI() {
    this.spinner.start('Instalando Angular CLI...');
    try {
      execSync('npm install -g @angular/cli@latest', { stdio: 'pipe' });
      this.spinner.succeed('Angular CLI instalado ✅');
    } catch (error) {
      throw new Error('Error instalando Angular CLI. Ejecutar manualmente: npm install -g @angular/cli@latest');
    }
  }

  async updateAngularCLI() {
    this.spinner.start('Actualizando Angular CLI...');
    try {
      execSync('npm uninstall -g @angular/cli', { stdio: 'pipe' });
      execSync('npm install -g @angular/cli@latest', { stdio: 'pipe' });
      this.spinner.succeed('Angular CLI actualizado ✅');
    } catch (error) {
      throw error;
    }
  }

  async promptUserChoices() {
    console.log(chalk.yellow('\n🎯 Configuración del setup...\n'));

    // Verificar si existe el proyecto
    const projectExists = await fs.pathExists(this.projectPath);
    
    let answers = {};
    
    if (projectExists) {
      console.log(chalk.green('✅ Proyecto Campus Virtual ESO encontrado'));
      console.log(chalk.blue('🎓 Para estudiantes: Se configurará el proyecto existente'));
      
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: '¿Qué deseas hacer?',
        choices: [
          { name: '🎓 Configurar proyecto existente (Estudiantes)', value: 'configure' },
          { name: '🔄 Recrear proyecto desde cero (Desarrollo)', value: 'recreate' },
          { name: '❌ Cancelar', value: 'cancel' }
        ],
        default: 'configure'
      }]);

      if (action === 'cancel') {
        console.log(chalk.yellow('Setup cancelado.'));
        process.exit(0);
      }
      
      answers.cleanInstall = (action === 'recreate');
    } else {
      answers.cleanInstall = false;
    }

    const setupAnswers = await inquirer.prompt([{
      type: 'list',
      name: 'setupMode',
      message: '¿Qué tipo de setup deseas realizar?',
      choices: [
        { name: '🚀 Setup completo (recomendado)', value: 'full' },
        { name: '⚡ Setup básico (solo Angular)', value: 'basic' },
        { name: '🔄 Solo verificar configuración', value: 'verify' }
      ],
      default: 'full'
    }]);

    this.options = { ...answers, ...setupAnswers };

    if (answers.setupMode === 'verify') {
      const SetupVerifier = require('./verify-setup.js');
      const verifier = new SetupVerifier();
      await verifier.run();
      return;
    }
  }

  async setupProject() {
    console.log(chalk.yellow('\n🏗️ Configurando proyecto Angular...\n'));

    // Crear directorio base
    await fs.ensureDir(this.baseProjectDir);

    const projectExists = await fs.pathExists(this.projectPath);

    // Limpiar si se solicita
    if (this.options.cleanInstall && projectExists) {
      this.spinner.start('Eliminando proyecto existente...');
      await fs.remove(this.projectPath);
      this.spinner.succeed('Proyecto eliminado ✅');
    }

    // Crear proyecto Angular o configurar existente
    if (!await fs.pathExists(this.projectPath)) {
      this.spinner.start('Creando proyecto Angular...');
      try {
        const ngNewCommand = [
          'ng new',
          COURSE_CONFIG.projectName,
          '--routing=true',
          '--style=scss',
          '--strict=true',
          '--standalone=true',
          '--ssr=false',
          '--skip-git=true',
          '--package-manager=npm'
        ].join(' ');

        execSync(ngNewCommand, { 
          cwd: this.baseProjectDir,
          stdio: 'pipe'
        });
        
        this.spinner.succeed('Proyecto Angular creado ✅');
      } catch (error) {
        this.spinner.fail('Error creando proyecto Angular');
        throw new Error(`No se pudo crear proyecto: ${error.message}`);
      }
    } else {
      this.spinner.start('Configurando proyecto existente...');
      try {
        // Verificar que es un proyecto Angular válido
        const packagePath = path.join(this.projectPath, 'package.json');
        const packageJson = await fs.readJson(packagePath);
        
        if (!packageJson.dependencies?.['@angular/core']) {
          throw new Error('El directorio no contiene un proyecto Angular válido');
        }
        
        this.spinner.succeed('Proyecto Angular encontrado y verificado ✅');
      } catch (error) {
        this.spinner.fail('Error verificando proyecto');
        throw new Error(`Proyecto no válido: ${error.message}`);
      }
    }
  }

  async installDependencies() {
    console.log(chalk.yellow('\n📦 Instalando dependencias...\n'));

    process.chdir(this.projectPath);

    // Instalar dependencias básicas
    this.spinner.start('Instalando dependencias base...');
    try {
      execSync('npm install', { stdio: 'pipe' });
      this.spinner.succeed('Dependencias base instaladas ✅');
    } catch (error) {
      this.spinner.fail('Error instalando dependencias base');
      throw error;
    }

    // Instalar dependencias adicionales del curso (sin ng add)
    if (this.options.setupMode === 'full') {
      this.spinner.start('Instalando dependencias del curso...');
      try {
        const additionalDeps = [
          'json-server@^0.17.0',
          'lodash@^4.17.21'
        ].join(' ');

        execSync(`npm install ${additionalDeps}`, { stdio: 'pipe' });
        
        const devDeps = [
          '@types/lodash@^4.14.200',
          'prettier@^3.0.0'
        ].join(' ');

        execSync(`npm install --save-dev ${devDeps}`, { stdio: 'pipe' });
        
        this.spinner.succeed('Dependencias del curso instaladas ✅');
      } catch (error) {
        this.spinner.warn('Algunas dependencias adicionales fallaron (no crítico)');
      }
    }
  }

  async createProjectStructure() {
    console.log(chalk.yellow('\n📁 Creando estructura del Campus Virtual...\n'));

    const directories = [
      'src/app/core/services',
      'src/app/core/guards', 
      'src/app/core/interceptors',
      'src/app/shared/components',
      'src/app/shared/directives',
      'src/app/shared/pipes',
      'src/app/features/auth/components',
      'src/app/features/auth/services',
      'src/app/features/dashboard/components',
      'src/app/features/courses/components',
      'src/app/features/courses/services',
      'src/app/features/messaging/components',
      'src/app/features/calendar/components',
      'src/app/layout/header',
      'src/app/layout/sidebar',
      'src/app/layout/footer',
      'src/assets/data',
      'src/assets/images/courses',
      'src/assets/images/users'
    ];

    this.spinner.start('Creando estructura de carpetas...');
    try {
      for (const dir of directories) {
        await fs.ensureDir(path.join(this.projectPath, dir));
      }
      this.spinner.succeed('Estructura de carpetas creada ✅');
    } catch (error) {
      this.spinner.fail('Error creando estructura');
      throw error;
    }

    // Configurar VS Code si es setup completo
    if (this.options.setupMode === 'full') {
      await this.setupVSCodeConfiguration();
    }
  }

  async setupVSCodeConfiguration() {
    const vscodeDir = path.join(this.projectPath, '.vscode');
    await fs.ensureDir(vscodeDir);

    const settings = {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.tabSize": 2,
      "editor.insertSpaces": true,
      "typescript.preferences.importModuleSpecifier": "relative",
      "angular.enable-strict-mode-prompt": false,
      "files.associations": {
        "*.html": "html"
      },
      "emmet.includeLanguages": {
        "typescript": "html"
      }
    };

    const extensions = {
      "recommendations": [
        "angular.ng-template",
        "ms-vscode.vscode-typescript-next", 
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-eslint",
        "streetsidesoftware.code-spell-checker"
      ]
    };

    this.spinner.start('Configurando VS Code...');
    try {
      await fs.writeJson(path.join(vscodeDir, 'settings.json'), settings, { spaces: 2 });
      await fs.writeJson(path.join(vscodeDir, 'extensions.json'), extensions, { spaces: 2 });
      
      // ✅ NUEVO: Crear snippets del curso Angular 20
      await this.createAngular20Snippets(vscodeDir);
      
      this.spinner.succeed('VS Code configurado ✅');
    } catch (error) {
      this.spinner.warn('VS Code no configurado (no crítico)');
    }
  }

  async createInitialFiles() {
    console.log(chalk.yellow('\n📝 Creando archivos del proyecto...\n'));

    const readmeContent = `# Campus Virtual ESO - Proyecto Base

## 🎓 Curso Angular 20 Avanzado - Imagina Formación

### Descripción del Proyecto
Campus Virtual completo para centros de Educación Secundaria Obligatoria con:
- 🔐 Sistema de autenticación por roles
- 📚 Gestión de cursos y contenidos
- 💬 Mensajería interna
- 📝 Sistema de correcciones
- 📅 Calendario académico

### Estructura del Proyecto
\`\`\`
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
\`\`\`

### Tecnologías Utilizadas
- **Angular 18+** con Standalone Components
- **Signals** para gestión de estado reactiva
- **SCSS** para estilos avanzados
- **TypeScript** en modo strict
- **RxJS** para programación reactiva

### Comandos Disponibles
\`\`\`bash
npm start              # Servidor de desarrollo (puerto 4200)
npm run build          # Build de producción
npm test               # Tests unitarios
npm run verify         # Verificar configuración del setup
npm run format         # Formatear código con Prettier
\`\`\`

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
1. \`npm start\` - Iniciar servidor de desarrollo
2. Abrir http://localhost:4200 en el navegador
3. ¡Comenzar con la Sesión 1 del curso!

---
**Imagina Formación - Curso Angular 20 Avanzado**
`;

    // Datos de prueba para el Campus Virtual
    const mockData = {
      users: [
        {
          id: 1,
          name: "María García Rodríguez",
          email: "maria.garcia@eso.edu",
          role: "student",
          course: "3º ESO A",
          avatar: "/assets/images/users/maria.jpg",
          subjects: ["Matemáticas", "Lengua", "Ciencias"]
        },
        {
          id: 2,
          name: "Juan Rodríguez López", 
          email: "juan.rodriguez@eso.edu",
          role: "teacher",
          subjects: ["Matemáticas", "Física"],
          avatar: "/assets/images/users/juan.jpg",
          courses: [1, 3]
        },
        {
          id: 3,
          name: "Ana López Martín",
          email: "ana.lopez@eso.edu", 
          role: "admin",
          permissions: ["all"],
          avatar: "/assets/images/users/ana.jpg"
        },
        {
          id: 4,
          name: "Carmen Ruiz Sánchez",
          email: "carmen.ruiz@eso.edu",
          role: "teacher", 
          subjects: ["Lengua", "Literatura"],
          avatar: "/assets/images/users/carmen.jpg",
          courses: [2]
        }
      ],
      courses: [
        {
          id: 1,
          name: "Matemáticas 3º ESO",
          teacher: "Juan Rodríguez",
          teacherId: 2,
          students: 25,
          description: "Álgebra y geometría para 3º ESO",
          image: "/assets/images/courses/matematicas.jpg",
          schedule: "Lunes, Miércoles, Viernes 10:00-11:00"
        },
        {
          id: 2,
          name: "Lengua 3º ESO",
          teacher: "Carmen Ruiz",
          teacherId: 4,
          students: 22,
          description: "Literatura y expresión escrita",
          image: "/assets/images/courses/lengua.jpg", 
          schedule: "Martes, Jueves 09:00-10:00"
        },
        {
          id: 3,
          name: "Física 4º ESO",
          teacher: "Juan Rodríguez",
          teacherId: 2,
          students: 18,
          description: "Conceptos fundamentales de física",
          image: "/assets/images/courses/fisica.jpg",
          schedule: "Lunes, Miércoles 11:00-12:00"
        }
      ],
      messages: [
        {
          id: 1,
          from: 2,
          to: 1,
          subject: "Tarea de matemáticas",
          content: "Recuerda entregar los ejercicios del tema 3 antes del viernes.",
          date: "2025-01-15",
          read: false
        },
        {
          id: 2,
          from: 1,
          to: 2,
          subject: "Consulta sobre examen",
          content: "¿Podrías explicarme el ejercicio 5 de la página 42?",
          date: "2025-01-14",
          read: true
        }
      ]
    };

    // Actualizar package.json con scripts del curso
    const packagePath = path.join(this.projectPath, 'package.json');
    const packageJson = await fs.readJson(packagePath);
    
    packageJson.scripts = {
      ...packageJson.scripts,
      "verify": "cd ../.. && node verify-setup.js",
      "format": "prettier --write \"src/**/*.{ts,html,scss}\"",
      "format:check": "prettier --check \"src/**/*.{ts,html,scss}\""
    };

    this.spinner.start('Creando archivos del proyecto...');
    try {
      // README del proyecto
      await fs.writeFile(path.join(this.projectPath, 'README.md'), readmeContent);
      
      // Actualizar package.json
      await fs.writeJson(packagePath, packageJson, { spaces: 2 });
      
      // Datos de prueba
      await fs.writeJson(
        path.join(this.projectPath, 'src/assets/data/mock-data.json'), 
        mockData, 
        { spaces: 2 }
      );
      
      this.spinner.succeed('Archivos del proyecto creados ✅');
    } catch (error) {
      this.spinner.fail('Error creando archivos');
      throw error;
    }
  }

  showSuccessMessage() {
    console.log('\n' + '='.repeat(60) + '\n');
    
    console.log(boxen(
      chalk.green.bold('🎉 ¡SETUP COMPLETADO EXITOSAMENTE!\n\n') +
      chalk.white(`✅ Proyecto creado: ${COURSE_CONFIG.projectDir}/${COURSE_CONFIG.projectName}\n`) +
      chalk.white('✅ Estructura del Campus Virtual configurada\n') +
      chalk.white('✅ Dependencias del curso instaladas\n') +
      chalk.white('✅ VS Code configurado con extensiones\n') +
      chalk.white('✅ Datos de prueba del campus creados\n\n') +
      chalk.green.bold('🚀 ¡Todo listo para comenzar el curso!'),
      { 
        padding: 1, 
        borderStyle: 'single', 
        borderColor: 'green'
      }
    ));

    console.log(chalk.cyan('\n📚 Próximos pasos para comenzar:\n'));
    console.log(chalk.white(`   1. cd ${COURSE_CONFIG.projectDir}/${COURSE_CONFIG.projectName}`));
    console.log(chalk.white('   2. code . (abrir proyecto en VS Code)'));
    console.log(chalk.white('   3. npm start (iniciar servidor de desarrollo)'));
    console.log(chalk.white('   4. Abrir http://localhost:4200 en navegador'));
    console.log(chalk.white('   5. ¡Comenzar con la Sesión 1 del curso!'));

    console.log(chalk.magenta('\n🎯 Comandos útiles del curso:\n'));
    console.log(chalk.white('   • node verify-setup.js           # Verificar configuración'));
    console.log(chalk.white('   • npm run verify                 # Verificar desde el proyecto'));
    console.log(chalk.white('   • git tag v0.0-setup-inicial     # Crear tag inicial para Git'));
    console.log(chalk.white('   • npm run format                 # Formatear código'));

    console.log(chalk.yellow('\n⭐ ¡Que tengas un excelente curso de Angular 20! ⭐\n'));
  }

  handleError(error) {
    console.log(boxen(
      chalk.red.bold('💥 ERROR EN EL SETUP\n\n') +
      chalk.white(`${error.message}\n\n`) +
      chalk.red.bold('🔧 Revisa los prerequisitos y vuelve a intentar'),
      { 
        padding: 1, 
        borderStyle: 'single', 
        borderColor: 'red'
      }
    ));
    
    console.log(chalk.cyan('\n🔧 Soluciones más comunes:'));
    console.log(chalk.white('   1. Actualizar Node.js: https://nodejs.org/'));
    console.log(chalk.white('   2. Limpiar caché de npm: npm cache clean --force'));
    console.log(chalk.white('   3. Reinstalar Angular CLI: npm uninstall -g @angular/cli && npm install -g @angular/cli@latest'));
    console.log(chalk.white('   4. Verificar permisos de escritura en el directorio'));
    console.log(chalk.white('   5. Cerrar VS Code y otros editores que puedan estar bloqueando archivos'));
    
    process.exit(1);
  }

  async createAngular20Snippets(vscodeDir) {
    const snippetsDir = path.join(vscodeDir, 'snippets');
    await fs.ensureDir(snippetsDir);

    // 📄 1. Snippets para Componentes Angular 20
    const componentSnippets = {
      "Angular 20 Standalone Component": {
        "prefix": "ng-component",
        "body": [
          "import { Component, signal, computed } from '@angular/core';",
          "import { CommonModule } from '@angular/common';",
          "",
          "@Component({",
          "  selector: 'app-${1:component-name}',",
          "  standalone: true,",
          "  imports: [CommonModule],",
          "  template: `",
          "    <div class=\"${1:component-name}\">",
          "      <h2>{{title()}}</h2>",
          "      $0",
          "    </div>",
          "  `,",
          "  styles: [`",
          "    .${1:component-name} {",
          "      padding: 1rem;",
          "    }",
          "  `]",
          "})",
          "export class ${1/(.*)/${1:/pascalcase}/}Component {",
          "  title = signal('${1:component-name}');",
          "}"
        ],
        "description": "Componente standalone Angular 20 con Signals"
      },
      "Angular 20 SSR Component": {
        "prefix": "ng-ssr-component",
        "body": [
          "import { Component, signal, PLATFORM_ID, inject } from '@angular/core';",
          "import { isPlatformBrowser } from '@angular/common';",
          "",
          "@Component({",
          "  selector: 'app-${1:component-name}',",
          "  standalone: true,",
          "  template: `",
          "    @if (isBrowser()) {",
          "      <div class=\"client-only\">",
          "        $0",
          "      </div>",
          "    } @else {",
          "      <div class=\"server-rendered\">",
          "        Loading...",
          "      </div>",
          "    }",
          "  `",
          "})",
          "export class ${1/(.*)/${1:/pascalcase}/}Component {",
          "  private platformId = inject(PLATFORM_ID);",
          "  isBrowser = signal(isPlatformBrowser(this.platformId));",
          "}"
        ],
        "description": "Componente con SSR y Hydration para Angular 20"
      }
    };

    // 📄 2. Snippets para Signals
    const signalsSnippets = {
      "Angular Signal": {
        "prefix": "ng-signal",
        "body": [
          "${1:name} = signal<${2:type}>(${3:initialValue});"
        ],
        "description": "Signal básico de Angular"
      },
      "Angular Computed Signal": {
        "prefix": "ng-computed",
        "body": [
          "${1:name} = computed(() => {",
          "  return ${2:this.signal()};",
          "});"
        ],
        "description": "Signal computado de Angular"
      },
      "Angular Effect": {
        "prefix": "ng-effect",
        "body": [
          "effect(() => {",
          "  console.log('${1:signal} changed:', this.${1:signal}());",
          "  $0",
          "});"
        ],
        "description": "Effect para reaccionar a cambios de Signals"
      },
      "Signal Service": {
        "prefix": "ng-signal-service",
        "body": [
          "import { Injectable, signal, computed } from '@angular/core';",
          "",
          "@Injectable({",
          "  providedIn: 'root'",
          "})",
          "export class ${1:Service}Service {",
          "  private _state = signal<${2:StateType}>($3);",
          "  ",
          "  readonly state = computed(() => this._state());",
          "  ",
          "  updateState(newState: ${2:StateType}) {",
          "    this._state.set(newState);",
          "  }",
          "  ",
          "  updatePartialState(partialState: Partial<${2:StateType}>) {",
          "    this._state.update(current => ({ ...current, ...partialState }));",
          "  }",
          "}"
        ],
        "description": "Servicio con gestión de estado usando Signals"
      }
    };

    // 📄 3. Snippets para Control Flow
    const controlFlowSnippets = {
      "Angular @if": {
        "prefix": "ng-if",
        "body": [
          "@if (${1:condition}) {",
          "  $0",
          "}"
        ],
        "description": "Control flow @if de Angular 20"
      },
      "Angular @if @else": {
        "prefix": "ng-if-else",
        "body": [
          "@if (${1:condition}) {",
          "  $2",
          "} @else {",
          "  $0",
          "}"
        ],
        "description": "Control flow @if @else de Angular 20"
      },
      "Angular @for": {
        "prefix": "ng-for",
        "body": [
          "@for (${1:item} of ${2:items}; track ${1}.${3:id}) {",
          "  $0",
          "} @empty {",
          "  <p>No items available</p>",
          "}"
        ],
        "description": "Control flow @for de Angular 20"
      },
      "Angular @switch": {
        "prefix": "ng-switch",
        "body": [
          "@switch (${1:expression}) {",
          "  @case (${2:value1}) {",
          "    $3",
          "  }",
          "  @case (${4:value2}) {",
          "    $5",
          "  }",
          "  @default {",
          "    $0",
          "  }",
          "}"
        ],
        "description": "Control flow @switch de Angular 20"
      }
    };

    // 📄 4. Snippets para Formularios
    const formsSnippets = {
      "Angular Typed Form": {
        "prefix": "ng-typed-form",
        "body": [
          "import { FormBuilder, FormGroup, Validators } from '@angular/forms';",
          "import { signal } from '@angular/core';",
          "",
          "interface ${1:Form}Data {",
          "  ${2:field}: string;",
          "}",
          "",
          "export class ${3:Component}Component {",
          "  private fb = inject(FormBuilder);",
          "  ",
          "  ${4:form}: FormGroup<{",
          "    ${2:field}: FormControl<string>;",
          "  }> = this.fb.group({",
          "    ${2:field}: ['', [Validators.required]]",
          "  });",
          "  ",
          "  formData = signal<${1:Form}Data | null>(null);",
          "  ",
          "  onSubmit() {",
          "    if (this.${4:form}.valid) {",
          "      this.formData.set(this.${4:form}.value as ${1:Form}Data);",
          "      $0",
          "    }",
          "  }",
          "}"
        ],
        "description": "Formulario tipado con Signals de Angular 20"
      }
    };

    // Escribir archivos de snippets
    await fs.writeJson(path.join(snippetsDir, 'angular-20-components.json'), componentSnippets, { spaces: 2 });
    await fs.writeJson(path.join(snippetsDir, 'angular-20-signals.json'), signalsSnippets, { spaces: 2 });
    await fs.writeJson(path.join(snippetsDir, 'angular-20-control-flow.json'), controlFlowSnippets, { spaces: 2 });
    await fs.writeJson(path.join(snippetsDir, 'angular-20-forms.json'), formsSnippets, { spaces: 2 });
  }

  async createSessionsStructure() {
    console.log(chalk.yellow('\n📚 Creando estructura de sesiones del curso...\n'));

    this.spinner.start('Generando 9 sesiones del curso...');

    try {
      // Crear directorio principal de sesiones en la raíz del repositorio
      const sessionsBaseDir = path.join(this.courseDir, 'sesiones');
      await fs.ensureDir(sessionsBaseDir);

      // Definición de las 9 sesiones
      const sessions = [
        {
          id: '01',
          title: 'Fundamentos Modernos',
          topics: ['Novedades Angular 20', 'Signals en Profundidad'],
          description: 'Standalone Components, Signals, Control Flow'
        },
        {
          id: '02', 
          title: 'Change Detection y Directivas',
          topics: ['Change Detection Avanzado', 'Directivas y Control Flow'],
          description: 'Zoneless Angular, Performance, Directivas modernas'
        },
        {
          id: '03',
          title: 'Formularios y Arquitectura DI',
          topics: ['Formularios Avanzados', 'Inyección de Dependencias'],
          description: 'Typed Forms, Signals, Standalone APIs'
        },
        {
          id: '04',
          title: 'Routing y Optimización',
          topics: ['Routing Avanzado', 'Optimización de Recursos'],
          description: 'Functional Guards, NgOptimizedImage'
        },
        {
          id: '05',
          title: 'SSR e Hydration',
          topics: ['SSR, Prerender e Hydration'],
          description: 'Server-Side Rendering, Hydration incremental'
        },
        {
          id: '06',
          title: 'Testing y Arquitecturas',
          topics: ['Testing Moderno', 'Arquitecturas Escalables', 'PWAs'],
          description: 'Jest, Cypress, Microfrontends, PWA'
        },
        {
          id: '07',
          title: 'Estado Global e i18n',
          topics: ['NgRx', 'Internacionalización', 'Librerías'],
          description: 'Estado global, i18n, creación de librerías'
        },
        {
          id: '08',
          title: 'Librerías y Buenas Prácticas',
          topics: ['Librerías Avanzadas', 'Buenas Prácticas'],
          description: 'NPM, Documentación, CI/CD, Seguridad'
        },
        {
          id: '09',
          title: 'Migración y Proyecto Final',
          topics: ['Migración Angular 17→20', 'Proyecto Final'],
          description: 'Migración, Campus Virtual completo'
        }
      ];

      // Crear estructura para cada sesión
      for (const session of sessions) {
        await this.createSessionStructure(sessionsBaseDir, session);
      }

      // Crear archivo índice de sesiones
      await this.createSessionsIndex(sessionsBaseDir, sessions);

      this.spinner.succeed('Estructura de 9 sesiones creada ✅');
    } catch (error) {
      this.spinner.fail('Error creando estructura de sesiones');
      throw error;
    }
  }

  async createSessionStructure(baseDir, session) {
    const sessionDir = path.join(baseDir, `sesion-${session.id}-${session.title.toLowerCase().replace(/\s+/g, '-')}`);
    
    // Crear directorios
    const dirs = [
      'teoria',
      'ejercicios',
      'ejercicios/resueltos',
      'codigo-ejemplos',
      'recursos',
      'campus-virtual-incremental'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(sessionDir, dir));
    }

    // README de la sesión
    const sessionReadme = `# Sesión ${session.id}: ${session.title}

## 📋 Información de la Sesión

**Duración:** 3 horas  
**Fecha:** Por definir  
**Modalidad:** Presencial online (Zoom)

## 🎯 Objetivos

${session.description}

## 📚 Temas Tratados

${session.topics.map((topic, index) => `${index + 1}. **${topic}**`).join('\n')}

## 📁 Estructura de Archivos

\`\`\`
sesion-${session.id}-${session.title.toLowerCase().replace(/\s+/g, '-')}/
├── 📁 teoria/                     # Material teórico por tema
├── 📁 ejercicios/                 # Ejercicios prácticos
│   └── 📁 resueltos/              # Soluciones de ejercicios
├── 📁 codigo-ejemplos/            # Ejemplos de código
├── 📁 recursos/                   # Recursos adicionales
└── 📁 campus-virtual-incremental/ # Evolución del proyecto
\`\`\`

## 🚀 Comandos de la Sesión

\`\`\`bash
# Iniciar sesión
npm run session:start ${session.id}

# Verificar setup
npm run verify:setup

# Resetear si es necesario
npm run session:reset ${session.id}
\`\`\`

## 📦 Campus Virtual - Evolución

En esta sesión el proyecto Campus Virtual evolucionará para incluir:

${session.topics.map(topic => `- ✅ ${topic}`).join('\n')}

## 🔗 Enlaces Útiles

- [Angular Documentation](https://angular.dev)
- [Documentación del Curso](../../docs/)
- [Repositorio Completo](https://github.com/Imagina-Formacion/curso-angular-20-avanzado)

---

**Imagina Formación - Curso Angular 20 Avanzado**
`;

    await fs.writeFile(path.join(sessionDir, 'README.md'), sessionReadme);

    // Configuración de la sesión
    const sessionConfig = {
      id: session.id,
      title: session.title,
      topics: session.topics,
      duration: "3 horas",
      objectives: session.topics,
      prerequisites: session.id === '01' ? ['Node.js v20+', 'Angular CLI 20', 'VS Code'] : [`Sesión ${parseInt(session.id) - 1} completada`],
      newDependencies: this.getSessionDependencies(session.id),
      commands: this.getSessionCommands(session.id)
    };

    await fs.writeJson(path.join(sessionDir, 'session-config.json'), sessionConfig, { spaces: 2 });

    // Crear archivo de ejercicios base
    const exercisesContent = `# Ejercicios - Sesión ${session.id}

## 🎯 Ejercicios Prácticos

### Ejercicio 1: ${session.topics[0]}

**Objetivo:** Implementar ${session.topics[0]} en el Campus Virtual

**Pasos:**
1. [ ] Paso 1
2. [ ] Paso 2  
3. [ ] Paso 3

**Criterios de éxito:**
- ✅ Criterio 1
- ✅ Criterio 2

${session.topics[1] ? `

### Ejercicio 2: ${session.topics[1]}

**Objetivo:** Implementar ${session.topics[1]} en el Campus Virtual

**Pasos:**
1. [ ] Paso 1
2. [ ] Paso 2
3. [ ] Paso 3

**Criterios de éxito:**
- ✅ Criterio 1  
- ✅ Criterio 2
` : ''}

## 🚀 Comandos Útiles

\`\`\`bash
# Verificar progreso
npm run verify:setup

# Ejecutar tests
npm test

# Iniciar desarrollo
npm start
\`\`\`

---

**Tiempo estimado:** 45-60 minutos por ejercicio
`;

    await fs.writeFile(path.join(sessionDir, 'ejercicios', 'ejercicios.md'), exercisesContent);
  }

  getSessionDependencies(sessionId) {
    const dependencies = {
      '03': ['@angular/forms'],
      '05': ['@angular/ssr'],
      '06': ['@angular/service-worker'],
      '07': ['@ngrx/store', '@ngrx/effects'],
      '08': ['compodoc']
    };
    return dependencies[sessionId] || [];
  }

  getSessionCommands(sessionId) {
    const commands = {
      '05': ['ng add @angular/ssr'],
      '06': ['ng add @angular/pwa'],
      '07': ['ng add @ngrx/store']
    };
    return commands[sessionId] || [];
  }

  async createSessionsIndex(baseDir, sessions) {
    const indexContent = `# Sesiones del Curso Angular 20 Avanzado

## 📚 Índice de Sesiones

${sessions.map(session => `
### 📅 [Sesión ${session.id}: ${session.title}](./sesion-${session.id}-${session.title.toLowerCase().replace(/\s+/g, '-')}/)

**Temas:** ${session.topics.join(' • ')}  
**Descripción:** ${session.description}
`).join('')}

## 🎯 Progreso del Curso

- [ ] Sesión 01: Fundamentos Modernos
- [ ] Sesión 02: Change Detection y Directivas  
- [ ] Sesión 03: Formularios y Arquitectura DI
- [ ] Sesión 04: Routing y Optimización
- [ ] Sesión 05: SSR e Hydration
- [ ] Sesión 06: Testing y Arquitecturas
- [ ] Sesión 07: Estado Global e i18n  
- [ ] Sesión 08: Librerías y Buenas Prácticas
- [ ] Sesión 09: Migración y Proyecto Final

## 🚀 Comandos Globales

\`\`\`bash
# Verificar requisitos
npm run check:requirements

# Setup completo
npm run setup:complete

# Iniciar sesión específica
npm run session:start 01

# Verificar setup
npm run verify:setup
\`\`\`

---

**Imagina Formación - Curso Angular 20 Avanzado**
`;

    await fs.writeFile(path.join(baseDir, 'README.md'), indexContent);
  }

  compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const part1 = v1[i] || 0;
      const part2 = v2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }
}

// Ejecutar setup si se llama directamente
if (require.main === module) {
  new CourseSetup().run().catch(console.error);
}

module.exports = CourseSetup;
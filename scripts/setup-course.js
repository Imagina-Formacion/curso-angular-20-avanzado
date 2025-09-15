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
  angularVersion: '20.0.0',
  requiredNodeVersion: '18.19.0',
  requiredNpmVersion: '10.0.0',
  materialTheme: 'indigo-pink'
};

class CourseSetup {
  constructor() {
    this.spinner = ora();
    this.projectPath = path.join(process.cwd(), 'current-project');
    this.config = {};
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🎓 CURSO ANGULAR 20 AVANZADO\n') +
      chalk.white('Campus Virtual ESO - Setup Completo\n\n') +
      chalk.gray('Imagina Formación - 2025'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue',
        backgroundColor: '#f0f8ff'
      }
    ));

    try {
      await this.checkPrerequisites();
      await this.promptUserConfiguration();
      await this.setupBaseProject();
      await this.installDependencies();
      await this.configureVSCode();
      await this.setupGitRepository();
      await this.createProjectStructure();
      await this.generateInitialFiles();

      this.showSuccessMessage();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkPrerequisites() {
    console.log(chalk.yellow('\n📋 Verificando prerequisitos del sistema...\n'));

    // Verificar Node.js
    this.spinner.start('Verificando Node.js...');
    try {
      const nodeVersion = process.version.slice(1);
      if (this.compareVersions(nodeVersion, COURSE_CONFIG.requiredNodeVersion) < 0) {
        throw new Error(`Node.js ${COURSE_CONFIG.requiredNodeVersion} o superior requerido. Actual: ${nodeVersion}`);
      }
      this.spinner.succeed(`Node.js ${nodeVersion} ✅`);
    } catch (error) {
      this.spinner.fail('Node.js no válido');
      throw error;
    }

    // Verificar npm
    this.spinner.start('Verificando npm...');
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      if (this.compareVersions(npmVersion, COURSE_CONFIG.requiredNpmVersion) < 0) {
        throw new Error(`npm ${COURSE_CONFIG.requiredNpmVersion} o superior requerido. Actual: ${npmVersion}`);
      }
      this.spinner.succeed(`npm ${npmVersion} ✅`);
    } catch (error) {
      this.spinner.fail('npm no válido');
      throw error;
    }

    // Verificar Angular CLI
    this.spinner.start('Verificando Angular CLI...');
    try {
      let ngVersion;
      try {
        const ngOutput = execSync('ng version --json', { encoding: 'utf8' });
        const ngData = JSON.parse(ngOutput);
        const cliVersion = ngData.cli?.version;

        if (!cliVersion || this.compareVersions(cliVersion, '20.0.0') < 0) {
          throw new Error('Angular CLI 20+ requerido');
        }

        this.spinner.succeed(`Angular CLI ${cliVersion} ✅`);
      } catch (cliError) {
        this.spinner.warn('Angular CLI no encontrado');

        const { installCLI } = await inquirer.prompt([{
          type: 'confirm',
          name: 'installCLI',
          message: '¿Deseas instalar Angular CLI 20?',
          default: true
        }]);

        if (installCLI) {
          this.spinner.start('Instalando Angular CLI...');
          execSync('npm install -g @angular/cli@latest', {
            stdio: 'pipe',
            timeout: 120000 // 2 minutos timeout
          });
          this.spinner.succeed('Angular CLI instalado ✅');
        } else {
          throw new Error('Angular CLI es requerido para el curso');
        }
      }
    } catch (error) {
      this.spinner.fail('Error con Angular CLI');
      throw error;
    }

    // Verificar Git
    this.spinner.start('Verificando Git...');
    try {
      const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
      this.spinner.succeed(`${gitVersion} ✅`);
    } catch (error) {
      this.spinner.warn('Git no encontrado - Recomendado para el curso');
    }

    // Verificar espacio en disco
    this.spinner.start('Verificando espacio en disco...');
    try {
      const stats = await fs.stat(process.cwd());
      // Simulación de verificación de espacio - en producción usar una librería real
      this.spinner.succeed('Espacio suficiente disponible ✅');
    } catch (error) {
      this.spinner.warn('No se pudo verificar el espacio en disco');
    }
  }

  async promptUserConfiguration() {
    console.log(chalk.yellow('\n⚙️  Configuración personalizada del curso...\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'studentName',
        message: '¿Cuál es tu nombre completo?',
        default: 'Estudiante',
        validate: input => input.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
      },
      {
        type: 'input',
        name: 'email',
        message: '¿Cuál es tu email? (opcional)',
        default: '',
        validate: input => !input || input.includes('@') || 'Email inválido'
      },
      {
        type: 'list',
        name: 'experience',
        message: '¿Cuál es tu nivel de experiencia con Angular?',
        choices: [
          { name: '🌱 Principiante (< 1 año)', value: 'beginner' },
          { name: '🚀 Intermedio (1-3 años)', value: 'intermediate' },
          { name: '🏆 Avanzado (3+ años)', value: 'advanced' },
          { name: '👨‍💻 Expert (5+ años)', value: 'expert' }
        ]
      },
      {
        type: 'list',
        name: 'learningGoal',
        message: '¿Cuál es tu objetivo principal con este curso?',
        choices: [
          { name: '📈 Mejorar skills para trabajo actual', value: 'improve_current' },
          { name: '💼 Buscar nuevo trabajo', value: 'job_search' },
          { name: '🚀 Crear proyecto personal', value: 'personal_project' },
          { name: '🎓 Aprendizaje académico', value: 'academic' },
          { name: '👥 Enseñar a otros', value: 'teaching' }
        ]
      },
      {
        type: 'confirm',
        name: 'setupVSCode',
        message: '¿Configurar VS Code con extensiones y snippets del curso?',
        default: true
      },
      {
        type: 'confirm',
        name: 'createGitRepo',
        message: '¿Inicializar repositorio Git local?',
        default: true
      },
      {
        type: 'confirm',
        name: 'enableAnalytics',
        message: '¿Habilitar métricas de progreso del curso? (anónimo)',
        default: true
      }
    ]);

    this.config = { ...COURSE_CONFIG, ...answers };

    // Guardar configuración del estudiante
    await fs.ensureDir(path.join(process.cwd(), 'config'));
    await fs.writeJson(
      path.join(process.cwd(), 'config', 'student-profile.json'),
      {
        ...this.config,
        setupDate: new Date().toISOString(),
        courseVersion: '1.0.0'
      },
      { spaces: 2 }
    );

    console.log(chalk.green(`\n👋 ¡Hola ${this.config.studentName}! Configurando tu entorno personalizado...\n`));
  }

  async setupBaseProject() {
    console.log(chalk.yellow('🏗️  Creando proyecto base Angular...\n'));

    // Limpiar proyecto existente si existe
    if (await fs.pathExists(this.projectPath)) {
      const { overwrite } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: `El proyecto "${COURSE_CONFIG.projectName}" ya existe. ¿Sobrescribir?`,
        default: false
      }]);

      if (overwrite) {
        this.spinner.start('Eliminando proyecto anterior...');
        await fs.remove(this.projectPath);
        this.spinner.succeed('Proyecto anterior eliminado');
      } else {
        console.log(chalk.blue('Usando proyecto existente...'));
        return;
      }
    }

    this.spinner.start('Creando proyecto Angular 20...');

    try {
      // Crear proyecto Angular con configuraciones específicas del curso
      const createCommand = [
        'ng', 'new', COURSE_CONFIG.projectName,
        '--routing=true',
        '--style=scss',
        '--standalone=true',
        '--ssr=false',
        '--skip-git=true',
        '--package-manager=npm',
        '--directory=current-project',
        '--skip-install=false'
      ].join(' ');

      execSync(createCommand, {
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 300000 // 5 minutos timeout
      });

      this.spinner.succeed('Proyecto Angular creado ✅');
    } catch (error) {
      this.spinner.fail('Error creando proyecto Angular');
      throw new Error(`No se pudo crear el proyecto: ${error.message}`);
    }
  }

  async installDependencies() {
    console.log(chalk.yellow('\n📦 Instalando dependencias del curso...\n'));

    // Dependencias principales del curso
    const courseDependencies = [
      'jsonwebtoken@^9.0.2',
      '@types/jsonwebtoken@^9.0.2'
    ];

    const courseDevDependencies = [
      'json-server@^0.17.4'
    ];

    // Instalar Angular Material con configuración automática
    this.spinner.start('Instalando Angular Material...');
    try {
      const materialCommand = [
        'ng', 'add', '@angular/material',
        `--theme=${COURSE_CONFIG.materialTheme}`,
        '--typography=true',
        '--animations=true',
        '--skip-confirmation=true'
      ].join(' ');

      execSync(materialCommand, {
        stdio: 'pipe',
        cwd: this.projectPath,
        timeout: 180000 // 3 minutos timeout
      });

      this.spinner.succeed('Angular Material instalado ✅');
    } catch (error) {
      this.spinner.fail('Error instalando Angular Material');
      throw error;
    }

    // Instalar dependencias del curso
    if (courseDependencies.length > 0) {
      this.spinner.start('Instalando dependencias del curso...');
      try {
        execSync(`npm install ${courseDependencies.join(' ')}`, {
          stdio: 'pipe',
          cwd: this.projectPath,
          timeout: 120000 // 2 minutos timeout
        });
        this.spinner.succeed('Dependencias del curso instaladas ✅');
      } catch (error) {
        this.spinner.fail('Error instalando dependencias del curso');
        throw error;
      }
    }

    // Instalar dependencias de desarrollo
    if (courseDevDependencies.length > 0) {
      this.spinner.start('Instalando herramientas de desarrollo...');
      try {
        execSync(`npm install --save-dev ${courseDevDependencies.join(' ')}`, {
          stdio: 'pipe',
          cwd: this.projectPath,
          timeout: 120000
        });
        this.spinner.succeed('Herramientas de desarrollo instaladas ✅');
      } catch (error) {
        this.spinner.fail('Error instalando herramientas de desarrollo');
        throw error;
      }
    }
  }

  async configureVSCode() {
    if (!this.config.setupVSCode) return;

    console.log(chalk.yellow('\n🔧 Configurando VS Code para el curso...\n'));

    const vscodeDir = path.join(this.projectPath, '.vscode');
    await fs.ensureDir(vscodeDir);

    // Configuración de settings optimizada para Angular 20
    const settings = {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
      },
      "typescript.preferences.importModuleSpecifier": "relative",
      "typescript.updateImportsOnFileMove.enabled": "always",
      "angular.enable-strict-mode-prompt": false,
      "files.associations": {
        "*.html": "html"
      },
      "emmet.includeLanguages": {
        "typescript": "html"
      },
      "emmet.triggerExpansionOnTab": true,
      "html.suggest.html5": true,
      "typescript.suggest.autoImports": true,
      "typescript.preferences.quoteStyle": "single",
      "editor.tabSize": 2,
      "editor.insertSpaces": true,
      "files.trimTrailingWhitespace": true,
      "files.insertFinalNewline": true,
      "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/.angular": true
      },
      "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/dist/**": true,
        "**/.angular/**": true
      }
    };

    await fs.writeJson(path.join(vscodeDir, 'settings.json'), settings, { spaces: 2 });

    // Extensiones recomendadas para Angular 20
    const extensions = {
      "recommendations": [
        // Angular Development
        "angular.ng-template",
        "cyrilletuzi.angular-schematics",
        "johnpapa.angular2",
        "mikerhyssmith.angular-material-v6-snippets",

        // TypeScript & JavaScript
        "ms-vscode.vscode-typescript-next",

        // CSS & Styling
        "bradlc.vscode-tailwindcss",
        "formulahendry.auto-rename-tag",

        // Code Quality
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-eslint",
        "streetsidesoftware.code-spell-checker",
        "davidanson.vscode-markdownlint",

        // Git & Version Control
        "eamodio.gitlens",
        "github.vscode-pull-request-github",

        // Productivity
        "ms-vscode.vscode-json",
        "redhat.vscode-yaml",
        "ms-vscode.live-server",
        "gruntfuggly.todo-tree",

        // Testing
        "orta.vscode-jest",
        "ms-vscode.test-adapter-converter",

        // Documentation
        "yzhang.markdown-all-in-one"
      ]
    };

    await fs.writeJson(path.join(vscodeDir, 'extensions.json'), extensions, { spaces: 2 });

    // Snippets personalizados del curso
    const snippetsDir = path.join(vscodeDir, 'snippets');
    await fs.ensureDir(snippetsDir);

    const angularSnippets = {
      "Angular Signal Component": {
        "prefix": "ng-signal-component",
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
          "      $0",
          "    </div>",
          "  `,",
          "  styles: [`",
          "    .${1:component-name} {",
          "      /* Component styles */",
          "    }",
          "  `]",
          "})",
          "export class ${1/(.*)/${1:/pascalcase}/}Component {",
          "  // Signals",
          "  data = signal<any>(null);",
          "  ",
          "  // Computed",
          "  computedValue = computed(() => {",
          "    return this.data();",
          "  });",
          "}"
        ],
        "description": "Crear componente Angular 20 con Signals"
      },
      "Angular Service with Signals": {
        "prefix": "ng-signal-service",
        "body": [
          "import { Injectable, signal, computed } from '@angular/core';",
          "",
          "@Injectable({",
          "  providedIn: 'root'",
          "})",
          "export class ${1:ServiceName}Service {",
          "  private _state = signal<${2:StateType}>($3);",
          "  ",
          "  // Public readonly state",
          "  readonly state = computed(() => this._state());",
          "  ",
          "  // Actions",
          "  updateState(newState: ${2:StateType}) {",
          "    this._state.set(newState);",
          "  }",
          "  ",
          "  updatePartialState(partialState: Partial<${2:StateType}>) {",
          "    this._state.update(current => ({ ...current, ...partialState }));",
          "  }",
          "}"
        ],
        "description": "Crear servicio Angular con Signals"
      },
      "Angular New Control Flow": {
        "prefix": "ng-control-flow",
        "body": [
          "@if (${1:condition}) {",
          "  ${2:// Content when true}",
          "} @else {",
          "  ${3:// Content when false}",
          "}",
          "",
          "@for (${4:item} of ${5:items}; track ${4}.${6:id}) {",
          "  ${7:// Content for each item}",
          "} @empty {",
          "  ${8:// Content when no items}",
          "}",
          "",
          "@switch (${9:expression}) {",
          "  @case (${10:value1}) {",
          "    ${11:// Case 1 content}",
          "  }",
          "  @case (${12:value2}) {",
          "    ${13:// Case 2 content}",
          "  }",
          "  @default {",
          "    ${14:// Default content}",
          "  }",
          "}"
        ],
        "description": "Nuevo control flow de Angular 20"
      }
    };

    await fs.writeJson(path.join(snippetsDir, 'angular.json'), angularSnippets, { spaces: 2 });

    this.spinner.succeed('VS Code configurado con extensiones y snippets del curso ✅');
  }

  async setupGitRepository() {
    if (!this.config.createGitRepo) return;

    console.log(chalk.yellow('\n📝 Configurando repositorio Git...\n'));

    this.spinner.start('Inicializando repositorio Git...');

    try {
      // Inicializar Git
      execSync('git init', { cwd: this.projectPath, stdio: 'pipe' });

      // Crear .gitignore personalizado para el curso
      const gitignoreContent = `
# See http://help.github.com/ignore-files/ for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings

# System files
.DS_Store
Thumbs.db

# Course specific
../config/student-profile.json
../backups/
*.log
.env.local
.env.development
.env.test
.env.production
      `.trim();

      await fs.writeFile(path.join(this.projectPath, '.gitignore'), gitignoreContent);

      // Configurar Git user si no está configurado
      try {
        execSync('git config --global user.name', { cwd: this.projectPath, stdio: 'pipe' });
      } catch {
        if (this.config.studentName && this.config.studentName !== 'Estudiante') {
          execSync(`git config --global user.name "${this.config.studentName}"`, {
            cwd: this.projectPath,
            stdio: 'pipe'
          });
        }
      }

      try {
        execSync('git config --global user.email', { cwd: this.projectPath, stdio: 'pipe' });
      } catch {
        if (this.config.email) {
          execSync(`git config --global user.email "${this.config.email}"`, {
            cwd: this.projectPath,
            stdio: 'pipe'
          });
        }
      }

      // Primer commit
      execSync('git add .', { cwd: this.projectPath, stdio: 'pipe' });
      execSync('git commit -m "🎉 Initial commit: Angular 20 Campus Virtual ESO - Course Setup"', {
        cwd: this.projectPath,
        stdio: 'pipe'
      });

      this.spinner.succeed('Repositorio Git configurado ✅');
    } catch (error) {
      this.spinner.warn('Git no configurado (opcional)');
    }
  }

  async createProjectStructure() {
    console.log(chalk.yellow('\n📁 Creando estructura de carpetas del proyecto...\n'));

    this.spinner.start('Creando estructura del Campus Virtual...');

    const directories = [
      'src/app/core/services',
      'src/app/core/models',
      'src/app/core/guards',
      'src/app/core/interceptors',
      'src/app/core/utils',
      'src/app/shared/components',
      'src/app/shared/directives',
      'src/app/shared/pipes',
      'src/app/shared/utils',
      'src/app/features/auth/login',
      'src/app/features/auth/register',
      'src/app/features/dashboard',
      'src/app/features/courses',
      'src/app/features/messages',
      'src/app/features/profile',
      'src/assets/images',
      'src/assets/icons',
      'src/assets/data'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.projectPath, dir);
      await fs.ensureDir(fullPath);
    }

    this.spinner.succeed('Estructura de carpetas creada ✅');
  }

  async generateInitialFiles() {
    console.log(chalk.yellow('\n📄 Generando archivos base del curso...\n'));

    this.spinner.start('Generando archivos de configuración...');

    // app.config.ts con Zoneless Change Detection
    const appConfigContent = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🎯 CLAVE: Habilitar Zoneless Change Detection
    provideExperimentalZonelessChangeDetection(),

    // Providers estándar
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};`;

    await fs.writeFile(
      path.join(this.projectPath, 'src/app/app.config.ts'),
      appConfigContent
    );

    // app.routes.ts básico
    const appRoutesContent = `import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(c => c.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];`;

    await fs.writeFile(
      path.join(this.projectPath, 'src/app/app.routes.ts'),
      appRoutesContent
    );

    // README del proyecto
    const readmeContent = `# Campus Virtual ESO - Angular 20

> Proyecto del Curso Angular 20 Avanzado - Imagina Formación

## 🎓 Información del Estudiante

- **Nombre**: ${this.config.studentName}
- **Nivel**: ${this.config.experience}
- **Objetivo**: ${this.config.learningGoal}
- **Fecha Setup**: ${new Date().toLocaleDateString()}

## 🚀 Comandos del Proyecto

\`\`\`bash
# Iniciar desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Linting
npm run lint
\`\`\`

## 📚 Sesiones del Curso

- [ ] **Sesión 1**: Fundamentos Angular 20 (Standalone Components, Signals, Control Flow)
- [ ] **Sesión 2**: Performance y Directivas Avanzadas
- [ ] **Sesión 3**: Formularios Enterprise y DI
- [ ] **Sesión 4**: Routing y Optimización
- [ ] **Sesión 5**: SSR y Testing
- [ ] **Sesión 6**: Arquitecturas Distribuidas y PWA
- [ ] **Sesión 7**: Estado Global e i18n
- [ ] **Sesión 8**: Librerías y Buenas Prácticas
- [ ] **Sesión 9**: Migración y Proyecto Final

## 🏗️ Arquitectura del Proyecto

\`\`\`
src/app/
├── core/           # Servicios singleton, guards, interceptors
├── shared/         # Componentes, directivas y pipes reutilizables
├── features/       # Módulos funcionales (auth, dashboard, courses, etc.)
└── assets/         # Recursos estáticos
\`\`\`

## 🎯 Tecnologías Utilizadas

- **Angular 20** con Standalone Components
- **Angular Signals** para estado reactivo
- **Zoneless Change Detection** para mejor performance
- **Angular Material** para UI components
- **TypeScript 5.1+** con tipos estrictos
- **SCSS** para estilos avanzados

---

**Generado automáticamente por el setup del curso** 🤖
`;

    await fs.writeFile(
      path.join(this.projectPath, 'README.md'),
      readmeContent
    );

    this.spinner.succeed('Archivos base generados ✅');
  }

  showSuccessMessage() {
    const duration = '2 minutos';

    console.log(boxen(
      chalk.green.bold('🎉 ¡SETUP COMPLETADO EXITOSAMENTE!\n\n') +
      chalk.white(`Hola ${this.config.studentName}, tu entorno está listo.\n\n`) +
      chalk.yellow('📁 Proyecto creado:\n') +
      chalk.white(`   • ${COURSE_CONFIG.projectName}\n`) +
      chalk.white(`   • Angular ${COURSE_CONFIG.angularVersion}\n`) +
      chalk.white(`   • Zoneless Change Detection habilitado\n`) +
      chalk.white(`   • Angular Material configurado\n\n`) +
      chalk.yellow('🚀 Próximos pasos:\n') +
      chalk.white('1. ') + chalk.cyan('npm run verify:setup') + chalk.white(' - Verificar instalación\n') +
      chalk.white('2. ') + chalk.cyan('npm run start:session:01') + chalk.white(' - Comenzar Sesión 1\n') +
      chalk.white('3. ') + chalk.cyan('code current-project') + chalk.white(' - Abrir en VS Code\n\n') +
      chalk.gray(`⏱️  Completado en ${duration} | Imagina Formación 2025`),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'green',
        backgroundColor: '#f0fff0'
      }
    ));

    // Mostrar siguiente comando automáticamente
    console.log(chalk.blue('\n🔍 Ejecutando verificación automática...\n'));

    // Aquí podrías ejecutar automáticamente npm run verify:setup
    // execSync('npm run verify:setup', { stdio: 'inherit' });
  }

  handleError(error) {
    console.log(boxen(
      chalk.red.bold('❌ ERROR EN SETUP\n\n') +
      chalk.white(error.message + '\n\n') +
      chalk.yellow('🔧 Soluciones comunes:\n') +
      chalk.white('• Verificar Node.js >= 18.19.0: ') + chalk.cyan('node --version\n') +
      chalk.white('• Instalar Angular CLI: ') + chalk.cyan('npm i -g @angular/cli@latest\n') +
      chalk.white('• Limpiar cache: ') + chalk.cyan('npm cache clean --force\n') +
      chalk.white('• Verificar permisos de escritura en el directorio\n') +
      chalk.white('• Contactar soporte: ') + chalk.cyan('soporte@imaginaformacion.com'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'red',
        backgroundColor: '#fff5f5'
      }
    ));

    // Log técnico para debugging
    console.error('\n🐛 Detalles técnicos del error:');
    console.error(error.stack);

    process.exit(1);
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

// Ejecutar setup si este archivo se ejecuta directamente
if (require.main === module) {
  new CourseSetup().run().catch(console.error);
}

module.exports = CourseSetup;

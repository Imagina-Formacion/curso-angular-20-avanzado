#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');

class SessionManager {
  constructor() {
    this.spinner = ora();
    this.currentProjectPath = path.join(process.cwd(), 'current-project');
    this.sessionsPath = path.join(process.cwd(), 'sessions');
  }

  async run() {
    const [,, command, sessionNumber, sessionNumber2] = process.argv;

    switch (command) {
      case 'start':
        await this.startSession(sessionNumber);
        break;
      case 'reset':
        await this.resetSession(sessionNumber);
        break;
      case 'compare':
        await this.compareSessions(sessionNumber, sessionNumber2);
        break;
      case 'clean':
        await this.cleanProject();
        break;
      default:
        this.showHelp();
    }
  }

  async startSession(sessionNumber) {
    if (!sessionNumber) {
      console.log(chalk.red('❌ Especifica el número de sesión: npm run start:session:01'));
      return;
    }

    const sessionPath = path.join(this.sessionsPath, `session-${sessionNumber.padStart(2, '0')}`);

    console.log(boxen(
      chalk.blue.bold(`🎓 INICIANDO SESIÓN ${sessionNumber}\n`) +
      chalk.white('Campus Virtual ESO - Angular 20'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }
    ));

    try {
      // Verificar que la sesión existe
      if (!(await fs.pathExists(sessionPath))) {
        throw new Error(`La sesión ${sessionNumber} no existe`);
      }

      // Leer configuración de la sesión
      const sessionConfigPath = path.join(sessionPath, 'session-config.json');
      let sessionConfig = {};

      if (await fs.pathExists(sessionConfigPath)) {
        sessionConfig = await fs.readJson(sessionConfigPath);
      }

      // Mostrar información de la sesión
      this.showSessionInfo(sessionNumber, sessionConfig);

      // Backup del estado actual
      await this.createBackup(sessionNumber);

      // Copiar archivos de la sesión
      await this.copySessionFiles(sessionPath);

      // Instalar dependencias si es necesario
      if (sessionConfig.newDependencies) {
        await this.installSessionDependencies(sessionConfig.newDependencies);
      }

      // Ejecutar comandos específicos de la sesión
      if (sessionConfig.commands) {
        await this.runSessionCommands(sessionConfig.commands);
      }

      // Iniciar servidor de desarrollo
      await this.startDevServer(sessionNumber);

    } catch (error) {
      this.spinner.fail(`Error iniciando sesión: ${error.message}`);
      process.exit(1);
    }
  }

  showSessionInfo(sessionNumber, config) {
    console.log(chalk.yellow(`\n📚 Información de la Sesión ${sessionNumber}:\n`));

    if (config.title) {
      console.log(chalk.white(`📖 Título: ${config.title}`));
    }

    if (config.objectives) {
      console.log(chalk.white(`🎯 Objetivos:`));
      config.objectives.forEach(obj => {
        console.log(chalk.white(`   • ${obj}`));
      });
    }

    if (config.duration) {
      console.log(chalk.white(`⏰ Duración: ${config.duration}`));
    }

    if (config.newFeatures) {
      console.log(chalk.white(`✨ Nuevas características:`));
      config.newFeatures.forEach(feature => {
        console.log(chalk.green(`   • ${feature}`));
      });
    }

    console.log('');
  }

  async createBackup(sessionNumber) {
    this.spinner.start('Creando backup del estado actual...');

    const backupPath = path.join(process.cwd(), 'backups', `before-session-${sessionNumber}`);

    try {
      await fs.ensureDir(path.dirname(backupPath));

      // Solo respaldar archivos importantes, no node_modules
      const filesToBackup = [
        'src',
        'angular.json',
        'package.json',
        'tsconfig.json'
      ];

      for (const file of filesToBackup) {
        const srcPath = path.join(this.currentProjectPath, file);
        const destPath = path.join(backupPath, file);

        if (await fs.pathExists(srcPath)) {
          await fs.copy(srcPath, destPath);
        }
      }

      this.spinner.succeed('Backup creado');
    } catch (error) {
      this.spinner.warn('No se pudo crear backup');
    }
  }

  async copySessionFiles(sessionPath) {
    this.spinner.start('Aplicando cambios de la sesión...');

    try {
      // Copiar archivos src
      const srcSessionPath = path.join(sessionPath, 'src');
      const srcProjectPath = path.join(this.currentProjectPath, 'src');

      if (await fs.pathExists(srcSessionPath)) {
        await fs.copy(srcSessionPath, srcProjectPath, {
          overwrite: true,
          filter: (src, dest) => {
            // No sobrescribir ciertos archivos si ya existen y tienen cambios del usuario
            const relativePath = path.relative(srcSessionPath, src);

            // Permitir sobrescribir archivos de ejemplo/template
            if (relativePath.includes('example') || relativePath.includes('template')) {
              return true;
            }

            return true;
          }
        });
      }

      // Copiar otros archivos de configuración si existen
      const configFiles = ['angular.json', 'package.json', 'tsconfig.json'];

      for (const file of configFiles) {
        const srcFile = path.join(sessionPath, file);
        const destFile = path.join(this.currentProjectPath, file);

        if (await fs.pathExists(srcFile)) {
          // Para package.json, hacer merge inteligente
          if (file === 'package.json') {
            await this.mergePackageJson(srcFile, destFile);
          } else {
            await fs.copy(srcFile, destFile);
          }
        }
      }

      this.spinner.succeed('Cambios aplicados');
    } catch (error) {
      this.spinner.fail(`Error aplicando cambios: ${error.message}`);
      throw error;
    }
  }

  async mergePackageJson(srcPath, destPath) {
    const srcPkg = await fs.readJson(srcPath);
    const destPkg = await fs.readJson(destPath);

    // Merge dependencies y devDependencies
    if (srcPkg.dependencies) {
      destPkg.dependencies = { ...destPkg.dependencies, ...srcPkg.dependencies };
    }

    if (srcPkg.devDependencies) {
      destPkg.devDependencies = { ...destPkg.devDependencies, ...srcPkg.devDependencies };
    }

    // Merge scripts si es necesario
    if (srcPkg.scripts) {
      destPkg.scripts = { ...destPkg.scripts, ...srcPkg.scripts };
    }

    await fs.writeJson(destPath, destPkg, { spaces: 2 });
  }

  async installSessionDependencies(dependencies) {
    if (!dependencies || dependencies.length === 0) return;

    this.spinner.start('Instalando nuevas dependencias...');

    try {
      execSync(`npm install ${dependencies.join(' ')}`, {
        cwd: this.currentProjectPath,
        stdio: 'pipe'
      });

      this.spinner.succeed(`Dependencias instaladas: ${dependencies.join(', ')}`);
    } catch (error) {
      this.spinner.fail('Error instalando dependencias');
      throw error;
    }
  }

  async runSessionCommands(commands) {
    if (!commands || commands.length === 0) return;

    for (const command of commands) {
      this.spinner.start(`Ejecutando: ${command}`);

      try {
        execSync(command, {
          cwd: this.currentProjectPath,
          stdio: 'pipe'
        });

        this.spinner.succeed(`Comando ejecutado: ${command}`);
      } catch (error) {
        this.spinner.warn(`Comando falló: ${command}`);
      }
    }
  }

  async startDevServer(sessionNumber) {
    console.log(boxen(
      chalk.green.bold(`🚀 SESIÓN ${sessionNumber} LISTA\n\n`) +
      chalk.white('El servidor de desarrollo se iniciará automáticamente.\n\n') +
      chalk.yellow('URLs importantes:\n') +
      chalk.white('• Aplicación: ') + chalk.cyan('http://localhost:4200\n') +
      chalk.white('• GitBook: ') + chalk.cyan('http://localhost:4000\n\n') +
      chalk.gray('Presiona Ctrl+C para detener el servidor'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'green'
      }
    ));

    // Iniciar servidor
    try {
      execSync('npm start', {
        cwd: this.currentProjectPath,
        stdio: 'inherit'
      });
    } catch (error) {
      // El usuario presionó Ctrl+C, esto es normal
      console.log(chalk.yellow('\n👋 Servidor detenido. ¡Hasta la próxima!'));
    }
  }

  async resetSession(sessionNumber) {
    console.log(chalk.yellow(`🔄 Reseteando sesión ${sessionNumber}...`));

    const backupPath = path.join(process.cwd(), 'backups', `before-session-${sessionNumber}`);

    if (!(await fs.pathExists(backupPath))) {
      console.log(chalk.red('❌ No se encontró backup para restaurar'));
      return;
    }

    this.spinner.start('Restaurando desde backup...');

    try {
      await fs.copy(backupPath, this.currentProjectPath, { overwrite: true });
      this.spinner.succeed('Sesión reseteada');
    } catch (error) {
      this.spinner.fail(`Error reseteando: ${error.message}`);
    }
  }

  async compareSessions(session1, session2) {
    console.log(chalk.blue(`🔍 Comparando sesiones ${session1} y ${session2}...`));

    // TODO: Implementar comparación de archivos
    console.log(chalk.yellow('Funcionalidad de comparación en desarrollo'));
  }

  async cleanProject() {
    console.log(chalk.yellow('🧹 Limpiando proyecto...'));

    this.spinner.start('Eliminando archivos temporales...');

    try {
      const pathsToClean = [
        path.join(this.currentProjectPath, 'node_modules'),
        path.join(this.currentProjectPath, 'dist'),
        path.join(this.currentProjectPath, '.angular')
      ];

      for (const pathToClean of pathsToClean) {
        if (await fs.pathExists(pathToClean)) {
          await fs.remove(pathToClean);
        }
      }

      this.spinner.succeed('Proyecto limpiado');

      console.log(chalk.white('Ejecuta: ') + chalk.cyan('cd current-project && npm install'));
    } catch (error) {
      this.spinner.fail(`Error limpiando: ${error.message}`);
    }
  }

  showHelp() {
    console.log(boxen(
      chalk.blue.bold('📚 SESSION MANAGER - AYUDA\n\n') +
      chalk.white('Comandos disponibles:\n\n') +
      chalk.cyan('npm run start:session:XX') + chalk.white(' - Iniciar sesión XX\n') +
      chalk.cyan('npm run reset:session:XX') + chalk.white(' - Resetear sesión XX\n') +
      chalk.cyan('npm run compare:XX:YY') + chalk.white(' - Comparar sesiones\n') +
      chalk.cyan('npm run clean') + chalk.white(' - Limpiar proyecto\n\n') +
      chalk.gray('Ejemplo: npm run start:session:01'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'single',
        borderColor: 'blue'
      }
    ));
  }
}

// Ejecutar session manager
new SessionManager().run().catch(console.error);

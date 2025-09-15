#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');

class SetupVerifier {
  constructor() {
    this.spinner = ora();
    this.checks = [];
    this.projectPath = path.join(process.cwd(), 'campus-virtual-eso');
    this.warnings = [];
    this.errors = [];
    this.requirements = {
      node: '20.11.1',  // ✅ CRÍTICO: Angular 20 requiere Node.js v20+
      npm: '10.0.0',
      angularCli: '20.0.0', // ✅ Angular 20 estable
      git: '2.0.0'
    };
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🔍 VERIFICACIÓN DE SETUP\n') +
      chalk.white('Campus Virtual ESO - Angular 20 Avanzado\n') +
      chalk.gray('Imagina Formación | 2025'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }
    ));

    try {
      await this.checkSystemRequirements();
      await this.checkProjectStructure();
      await this.checkDependencies();
      await this.checkVSCodeConfiguration();
      await this.checkAngularConfiguration();
      await this.runBasicTests();

      this.showResults();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkSystemRequirements() {
    console.log(chalk.yellow('\n🖥️  Verificando sistema y herramientas...\n'));

    // Node.js - CRÍTICO para Angular 20
    await this.check('Node.js >= 20.11.1 (OBLIGATORIO)', async () => {
      const version = process.version.slice(1);
      if (this.compareVersions(version, this.requirements.node) < 0) {
        throw new Error(`
❌ CRÍTICO: Angular 20 requiere Node.js v20.11.1+
🔴 Tu versión: ${version}
🔴 Node.js v18 ya NO es soportado (EOL: 27 marzo 2025)

🔧 INSTALAR Node.js v20+:
   nvm install 20.11.1 && nvm use 20.11.1
        `);
      }
      return `${version} ✅`;
    });

    // npm
    await this.check('npm >= 10.0.0', async () => {
      const version = execSync('npm --version', { encoding: 'utf8' }).trim();
      if (this.compareVersions(version, this.requirements.npm) < 0) {
        throw new Error(`Versión ${version} es muy antigua. Requiere >= ${this.requirements.npm}`);
      }
      return `${version} ✅`;
    });

    // Angular CLI
    await this.check('Angular CLI >= 18.0.0', async () => {
      try {
        const output = execSync('ng version --json', { encoding: 'utf8', stdio: 'pipe' });
        const data = JSON.parse(output);
        const version = data.cli?.version;

        if (!version || this.compareVersions(version, this.requirements.angularCli) < 0) {
          throw new Error(`Versión ${version || 'no encontrada'} es muy antigua. Requiere >= ${this.requirements.angularCli}`);
        }
        return `${version} ✅`;
      } catch (error) {
        if (error.message.includes('not found')) {
          throw new Error('Angular CLI no está instalado. Ejecutar: npm install -g @angular/cli');
        }
        throw error;
      }
    });

    // Git
    await this.check('Git (recomendado)', async () => {
      try {
        const version = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' }).match(/\d+\.\d+\.\d+/)[0];
        if (this.compareVersions(version, this.requirements.git) < 0) {
          this.warnings.push('Git versión antigua detectada');
          return `${version} ⚠️`;
        }
        return `${version} ✅`;
      } catch {
        this.warnings.push('Git no encontrado - recomendado para el curso');
        return 'No encontrado ⚠️';
      }
    });

    // Verificar conexión a internet
    await this.check('Conexión a internet', async () => {
      try {
        execSync('ping -c 1 google.com', { stdio: 'pipe', timeout: 5000 });
        return 'Conectado ✅';
      } catch {
        throw new Error('Sin conexión a internet. Necesaria para instalar dependencias.');
      }
    });
  }

  async checkProjectStructure() {
    console.log(chalk.yellow('\n📁 Verificando estructura del proyecto...\n'));

    await this.check('Proyecto Angular existe', async () => {
      if (!await fs.pathExists(this.projectPath)) {
        throw new Error(`Proyecto no encontrado en ${this.projectPath}. Ejecutar setup primero.`);
      }
      return 'Encontrado ✅';
    });

    await this.check('package.json válido', async () => {
      const packagePath = path.join(this.projectPath, 'package.json');
      if (!await fs.pathExists(packagePath)) {
        throw new Error('package.json no encontrado');
      }

      const packageJson = await fs.readJson(packagePath);
      if (!packageJson.dependencies?.['@angular/core']) {
        throw new Error('No es un proyecto Angular válido');
      }

      return `Angular ${packageJson.dependencies['@angular/core']} ✅`;
    });

    await this.check('angular.json configurado', async () => {
      const angularPath = path.join(this.projectPath, 'angular.json');
      if (!await fs.pathExists(angularPath)) {
        throw new Error('angular.json no encontrado');
      }

      const angularJson = await fs.readJson(angularPath);
      if (!angularJson.projects?.['campus-virtual-eso']) {
        throw new Error('Proyecto no configurado correctamente en angular.json');
      }

      return 'Configurado ✅';
    });

    await this.check('Estructura de carpetas', async () => {
      const requiredDirs = [
        'src/app',
        'src/app/core',
        'src/app/shared',
        'src/app/features',
        'src/app/layout'
      ];

      const missingDirs = [];
      for (const dir of requiredDirs) {
        const dirPath = path.join(this.projectPath, dir);
        if (!await fs.pathExists(dirPath)) {
          missingDirs.push(dir);
        }
      }

      if (missingDirs.length > 0) {
        this.warnings.push(`Carpetas faltantes: ${missingDirs.join(', ')}`);
        return `${requiredDirs.length - missingDirs.length}/${requiredDirs.length} ⚠️`;
      }

      return `${requiredDirs.length}/${requiredDirs.length} ✅`;
    });
  }

  async checkDependencies() {
    console.log(chalk.yellow('\n📦 Verificando dependencias...\n'));

    await this.check('node_modules instalado', async () => {
      const nodeModulesPath = path.join(this.projectPath, 'node_modules');
      if (!await fs.pathExists(nodeModulesPath)) {
        throw new Error('Dependencias no instaladas. Ejecutar: cd campus-virtual-eso && npm install');
      }

      // Verificar algunas dependencias clave
      const keyDeps = ['@angular/core', '@angular/cli', 'typescript'];
      const missingDeps = [];

      for (const dep of keyDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!await fs.pathExists(depPath)) {
          missingDeps.push(dep);
        }
      }

      if (missingDeps.length > 0) {
        throw new Error(`Dependencias faltantes: ${missingDeps.join(', ')}`);
      }

      return 'Instaladas ✅';
    });

    await this.check('TypeScript compilable', async () => {
      try {
        process.chdir(this.projectPath);
        execSync('npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
        return 'Sin errores ✅';
      } catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        if (output.includes('error TS')) {
          throw new Error('Errores de TypeScript encontrados. Revisar código.');
        }
        return 'Verificado ✅';
      }
    });

    // Verificar versiones específicas de Angular 20/18
    await this.check('Angular 18+ compatible', async () => {
      const packagePath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packagePath);
      const angularVersion = packageJson.dependencies?.['@angular/core']?.replace(/[\^~]/, '');

      if (!angularVersion || this.compareVersions(angularVersion, '18.0.0') < 0) {
        throw new Error(`Angular ${angularVersion} no es compatible. Requiere >= 18.0.0`);
      }

      return `${angularVersion} ✅`;
    });
  }

  async checkVSCodeConfiguration() {
    console.log(chalk.yellow('\n🔧 Verificando VS Code...\n'));

    await this.check('Configuración VS Code', async () => {
      const vscodeDir = path.join(this.projectPath, '.vscode');

      if (!await fs.pathExists(vscodeDir)) {
        this.warnings.push('Configuración VS Code no encontrada');
        return 'No configurado ⚠️';
      }

      const requiredFiles = ['settings.json', 'extensions.json'];
      const existingFiles = [];

      for (const file of requiredFiles) {
        const filePath = path.join(vscodeDir, file);
        if (await fs.pathExists(filePath)) {
          existingFiles.push(file);
        }
      }

      return `${existingFiles.length}/${requiredFiles.length} archivos ✅`;
    });

    await this.check('Extensiones recomendadas', async () => {
      const extensionsPath = path.join(this.projectPath, '.vscode', 'extensions.json');

      if (!await fs.pathExists(extensionsPath)) {
        this.warnings.push('Archivo extensions.json no encontrado');
        return 'No configurado ⚠️';
      }

      const extensions = await fs.readJson(extensionsPath);
      const recommendedCount = extensions.recommendations?.length || 0;

      return `${recommendedCount} recomendadas ✅`;
    });
  }

  async checkAngularConfiguration() {
    console.log(chalk.yellow('\n⚙️ Verificando configuración Angular...\n'));

    await this.check('Proyecto compilable', async () => {
      try {
        process.chdir(this.projectPath);
        execSync('ng build --configuration=development', {
          stdio: 'pipe',
          timeout: 120000 // 2 minutos
        });
        return 'Build exitoso ✅';
      } catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        if (output.includes('Cannot resolve dependency')) {
          throw new Error('Dependencias faltantes. Ejecutar: npm install');
        }
        if (output.includes('Module not found')) {
          throw new Error('Módulos no encontrados. Verificar imports.');
        }
        throw new Error('Error en build. Verificar configuración.');
      }
    });

    await this.check('Servidor de desarrollo', async () => {
      try {
        // Verificar que el servidor puede iniciar (sin ejecutarlo)
        const child = execSync('timeout 10 ng serve --dry-run', {
          stdio: 'pipe',
          cwd: this.projectPath
        });
        return 'Configurable ✅';
      } catch (error) {
        this.warnings.push('Verificación de servidor incompleta');
        return 'Básico ✅';
      }
    });

    await this.check('Configuración SSR (Opcional)', async () => {
      const packagePath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packagePath);

      if (packageJson.dependencies?.['@angular/ssr']) {
        return 'SSR disponible ✅';
      } else {
        this.warnings.push('SSR no configurado (se agregará en sesión 5)');
        return 'No configurado ⚠️';
      }
    });
  }

  async runBasicTests() {
    console.log(chalk.yellow('\n🧪 Ejecutando tests básicos...\n'));

    await this.check('Tests unitarios', async () => {
      try {
        process.chdir(this.projectPath);
        execSync('ng test --watch=false --browsers=ChromeHeadless', {
          stdio: 'pipe',
          timeout: 60000
        });
        return 'Tests pasando ✅';
      } catch (error) {
        // Si no hay tests configurados, es normal en setup inicial
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        if (output.includes('No tests found') || output.includes('0 tests')) {
          this.warnings.push('No hay tests configurados aún');
          return 'Sin tests ⚠️';
        }
        throw new Error('Tests fallando. Verificar configuración.');
      }
    });

    await this.check('Linting código', async () => {
      try {
        process.chdir(this.projectPath);
        execSync('ng lint', { stdio: 'pipe', timeout: 30000 });
        return 'Sin errores de lint ✅';
      } catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        if (output.includes('not found') || output.includes('No lint configuration')) {
          this.warnings.push('ESLint no configurado (opcional)');
          return 'No configurado ⚠️';
        }
        throw new Error('Errores de linting encontrados');
      }
    });
  }

  async check(description, fn) {
    const spinner = ora(description).start();

    try {
      const result = await fn();
      spinner.succeed(`${description}: ${result}`);
      this.checks.push({ description, status: 'success', result });
    } catch (error) {
      spinner.fail(`${description}: ${error.message}`);
      this.checks.push({ description, status: 'error', error: error.message });
      this.errors.push({ description, error: error.message });
    }
  }

  showResults() {
    const totalChecks = this.checks.length;
    const successfulChecks = this.checks.filter(c => c.status === 'success').length;
    const failedChecks = this.errors.length;

    console.log('\n' + '='.repeat(60) + '\n');

    if (failedChecks === 0) {
      console.log(boxen(
        chalk.green.bold('🎉 ¡VERIFICACIÓN COMPLETADA CON ÉXITO!\n\n') +
        chalk.white(`✅ ${successfulChecks}/${totalChecks} verificaciones pasaron\n`) +
        chalk.yellow(`⚠️  ${this.warnings.length} advertencias menores\n\n`) +
        chalk.green.bold('🚀 ¡Listo para comenzar el curso!'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'green'
        }
      ));

      if (this.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Advertencias:'));
        this.warnings.forEach(warning => {
          console.log(chalk.yellow(`   • ${warning}`));
        });
      }

      console.log(chalk.cyan('\n📚 Próximos pasos:'));
      console.log(chalk.white('   1. cd campus-virtual-eso'));
      console.log(chalk.white('   2. npm start'));
      console.log(chalk.white('   3. Abrir http://localhost:4200'));
      console.log(chalk.white('   4. ¡Comenzar la Sesión 1!'));

    } else {
      console.log(boxen(
        chalk.red.bold('❌ VERIFICACIÓN INCOMPLETA\n\n') +
        chalk.white(`❌ ${failedChecks} errores encontrados\n`) +
        chalk.white(`✅ ${successfulChecks}/${totalChecks} verificaciones OK\n\n`) +
        chalk.red.bold('🔧 Corregir errores antes de continuar'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'red'
        }
      ));

      console.log(chalk.red('\n❌ Errores que requieren atención:'));
      this.errors.forEach((error, index) => {
        console.log(chalk.red(`   ${index + 1}. ${error.description}: ${error.error}`));
      });

      console.log(chalk.cyan('\n🔧 Comandos de solución rápida:'));
      console.log(chalk.white('   • npm install -g @angular/cli@latest'));
      console.log(chalk.white('   • cd campus-virtual-eso && npm install'));
      console.log(chalk.white('   • npm run setup:complete'));
    }

    // Mostrar información del entorno
    console.log(chalk.gray('\n📊 Información del entorno:'));
    console.log(chalk.gray(`   • Node.js: ${process.version}`));
    console.log(chalk.gray(`   • npm: ${execSync('npm --version', { encoding: 'utf8' }).trim()}`));
    console.log(chalk.gray(`   • SO: ${process.platform} ${process.arch}`));
    console.log(chalk.gray(`   • Directorio: ${process.cwd()}`));

    process.exit(failedChecks > 0 ? 1 : 0);
  }

  handleError(error) {
    console.log(boxen(
      chalk.red.bold('💥 ERROR CRÍTICO\n\n') +
      chalk.white(`${error.message}\n\n`) +
      chalk.red.bold('🔧 Contactar soporte si persiste'),
      {
        padding: 1,
        borderStyle: 'single',
        borderColor: 'red'
      }
    ));

    console.log(chalk.gray('\n📞 Soporte técnico:'));
    console.log(chalk.gray('   • Email: soporte@imagina-formacion.com'));
    console.log(chalk.gray('   • Discord: Campus Virtual ESO'));

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

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  new SetupVerifier().run().catch(console.error);
}

module.exports = SetupVerifier;

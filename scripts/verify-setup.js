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
    this.warnings = [];
    this.errors = [];
    this.courseDir = process.cwd();
    this.campusPath = path.join(this.courseDir, 'campus-virtual-eso');
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🔍 VERIFICACIÓN DE SETUP\n') +
      chalk.white('Campus Virtual ESO - Verificación Completa\n') +
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
      await this.checkRepositoryStructure();
      await this.checkCampusProject();
      await this.checkScripts();
      await this.checkVSCodeConfiguration();

      this.showResults();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkSystemRequirements() {
    console.log(chalk.yellow('\n🖥️ Verificando sistema...\n'));

    // Node.js
    await this.check('Node.js >= 18.19.0', async () => {
      const version = process.version.slice(1);
      if (this.compareVersions(version, '18.19.0') < 0) {
        throw new Error(`Versión ${version} muy antigua. Requiere >= 18.19.0`);
      }
      return `${version} ✅`;
    });

    // npm
    await this.check('npm >= 10.0.0', async () => {
      const version = execSync('npm --version', { encoding: 'utf8' }).trim();
      if (this.compareVersions(version, '10.0.0') < 0) {
        throw new Error(`Versión ${version} muy antigua. Requiere >= 10.0.0`);
      }
      return `${version} ✅`;
    });

    // Angular CLI
    await this.check('Angular CLI >= 18.0.0', async () => {
      try {
        const output = execSync('ng version --json', { encoding: 'utf8', stdio: 'pipe' });
        const data = JSON.parse(output);
        const version = data.cli?.version;

        if (!version || this.compareVersions(version, '18.0.0') < 0) {
          throw new Error(`Versión ${version || 'no encontrada'} muy antigua`);
        }
        return `${version} ✅`;
      } catch (error) {
        throw new Error('Angular CLI no instalado o no funcional');
      }
    });

    // Git
    await this.check('Git (recomendado)', async () => {
      try {
        const version = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' })
          .match(/\d+\.\d+\.\d+/)[0];
        return `${version} ✅`;
      } catch {
        this.warnings.push('Git no encontrado - recomendado para el curso');
        return 'No encontrado ⚠️';
      }
    });
  }

  async checkRepositoryStructure() {
    console.log(chalk.yellow('\n📁 Verificando estructura del repositorio...\n'));

    const requiredDirs = [
      'campus-virtual-eso',
      'sesiones',
      'scripts',
      'configuraciones',
      '.github',
      'campus-ui-library'
    ];

    await this.check('Estructura principal', async () => {
      const missingDirs = [];
      for (const dir of requiredDirs) {
        const dirPath = path.join(this.courseDir, dir);
        if (!await fs.pathExists(dirPath)) {
          missingDirs.push(dir);
        }
      }

      if (missingDirs.length > 0) {
        throw new Error(`Directorios faltantes: ${missingDirs.join(', ')}`);
      }
      return `${requiredDirs.length} directorios ✅`;
    });

    await this.check('Archivos principales', async () => {
      const requiredFiles = ['package.json', 'README.md', '.gitignore', 'CHANGELOG.md'];
      const missingFiles = [];

      for (const file of requiredFiles) {
        const filePath = path.join(this.courseDir, file);
        if (!await fs.pathExists(filePath)) {
          missingFiles.push(file);
        }
      }

      if (missingFiles.length > 0) {
        throw new Error(`Archivos faltantes: ${missingFiles.join(', ')}`);
      }
      return `${requiredFiles.length} archivos ✅`;
    });

    await this.check('Estructura de sesiones', async () => {
      const sessionDirs = [
        'sesiones/01-fundamentos',
        'sesiones/02-reactividad',
        'sesiones/05-ssr-integral',
        'sesiones/07-estado-i18n-libs'
      ];

      const existing = [];
      for (const dir of sessionDirs) {
        const dirPath = path.join(this.courseDir, dir);
        if (await fs.pathExists(dirPath)) {
          existing.push(dir);
        }
      }

      return `${existing.length}/${sessionDirs.length} sesiones preparadas ✅`;
    });
  }

  async checkCampusProject() {
    console.log(chalk.yellow('\n🏗️ Verificando proyecto Campus Virtual...\n'));

    await this.check('Proyecto Campus existe', async () => {
      if (!await fs.pathExists(this.campusPath)) {
        throw new Error('Proyecto Campus Virtual no encontrado');
      }
      return 'Encontrado ✅';
    });

    await this.check('package.json del Campus', async () => {
      const packagePath = path.join(this.campusPath, 'package.json');
      if (!await fs.pathExists(packagePath)) {
        throw new Error('package.json no encontrado');
      }

      const packageJson = await fs.readJson(packagePath);
      if (!packageJson.dependencies?.['@angular/core']) {
        throw new Error('No es un proyecto Angular válido');
      }

      const angularVersion = packageJson.dependencies['@angular/core'];
      return `Angular ${angularVersion} ✅`;
    });

    await this.check('Configuración Angular', async () => {
      const angularPath = path.join(this.campusPath, 'angular.json');
      if (!await fs.pathExists(angularPath)) {
        throw new Error('angular.json no encontrado');
      }
      return 'Configurado ✅';
    });

    await this.check('Estructura de carpetas Campus', async () => {
      const requiredDirs = [
        'src/app/core',
        'src/app/shared',
        'src/app/features',
        'src/app/layout',
        'src/assets/data'
      ];

      const missingDirs = [];
      for (const dir of requiredDirs) {
        const dirPath = path.join(this.campusPath, dir);
        if (!await fs.pathExists(dirPath)) {
          missingDirs.push(dir);
        }
      }

      if (missingDirs.length > 0) {
        this.warnings.push(`Campus: carpetas faltantes: ${missingDirs.join(', ')}`);
        return `${requiredDirs.length - missingDirs.length}/${requiredDirs.length} ⚠️`;
      }

      return `${requiredDirs.length}/${requiredDirs.length} ✅`;
    });

    await this.check('Datos mock ESO', async () => {
      const dataFiles = ['students.json', 'teachers.json', 'courses.json', 'messages.json'];
      const dataDir = path.join(this.campusPath, 'src/assets/data');

      const existing = [];
      for (const file of dataFiles) {
        const filePath = path.join(dataDir, file);
        if (await fs.pathExists(filePath)) {
          existing.push(file);
        }
      }

      if (existing.length === 0) {
        throw new Error('No se encontraron datos mock');
      }

      return `${existing.length}/${dataFiles.length} archivos ✅`;
    });
  }

  async checkScripts() {
    console.log(chalk.yellow('\n🔧 Verificando scripts...\n'));

    const requiredScripts = [
      'scripts/setup-complete.js',
      'scripts/verify-setup.js'
    ];

    await this.check('Scripts principales', async () => {
      const missingScripts = [];
      for (const script of requiredScripts) {
        const scriptPath = path.join(this.courseDir, script);
        if (!await fs.pathExists(scriptPath)) {
          missingScripts.push(script);
        }
      }

      if (missingScripts.length > 0) {
        throw new Error(`Scripts faltantes: ${missingScripts.join(', ')}`);
      }
      return `${requiredScripts.length} scripts ✅`;
    });

    await this.check('package.json scripts', async () => {
      const packagePath = path.join(this.courseDir, 'package.json');
      const packageJson = await fs.readJson(packagePath);

      const requiredNpmScripts = [
        'setup:complete',
        'verify:setup',
        'start:campus'
      ];

      const missingScripts = requiredNpmScripts.filter(
        script => !packageJson.scripts?.[script]
      );

      if (missingScripts.length > 0) {
        throw new Error(`Scripts npm faltantes: ${missingScripts.join(', ')}`);
      }

      return `${requiredNpmScripts.length} comandos ✅`;
    });
  }

  async checkVSCodeConfiguration() {
    console.log(chalk.yellow('\n🔧 Verificando VS Code...\n'));

    await this.check('Configuración VS Code', async () => {
      const vscodeDir = path.join(this.campusPath, '.vscode');

      if (!await fs.pathExists(vscodeDir)) {
        this.warnings.push('Configuración VS Code no encontrada en Campus');
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
        chalk.green.bold('🎉 ¡VERIFICACIÓN EXITOSA!\n\n') +
        chalk.white(`✅ ${successfulChecks}/${totalChecks} verificaciones pasaron\n`) +
        chalk.yellow(`⚠️ ${this.warnings.length} advertencias menores\n\n`) +
        chalk.green.bold('🚀 ¡Sistema listo para el curso!'),
        {
          padding: 1,
          borderStyle: 'double',
          borderColor: 'green'
        }
      ));

      if (this.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️ Advertencias:'));
        this.warnings.forEach(warning => {
          console.log(chalk.yellow(`   • ${warning}`));
        });
      }

      console.log(chalk.cyan('\n📚 Próximos pasos:'));
      console.log(chalk.white('   1. cd campus-virtual-eso'));
      console.log(chalk.white('   2. npm start'));
      console.log(chalk.white('   3. Crear tag: git tag v0.0.0-base'));

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

      console.log(chalk.red('\n❌ Errores encontrados:'));
      this.errors.forEach((error, index) => {
        console.log(chalk.red(`   ${index + 1}. ${error.description}: ${error.error}`));
      });
    }

    process.exit(failedChecks > 0 ? 1 : 0);
  }

  handleError(error) {
    console.log(boxen(
      chalk.red.bold('💥 ERROR CRÍTICO\n\n') +
      chalk.white(`${error.message}\n\n`) +
      chalk.red.bold('🔧 Revisar configuración'),
      {
        padding: 1,
        borderStyle: 'single',
        borderColor: 'red'
      }
    ));

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

// Ejecutar verificación
if (require.main === module) {
  new SetupVerifier().run().catch(console.error);
}

module.exports = SetupVerifier;

#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');

class RequirementsVerifier {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🔍 VERIFICACIÓN DE REQUISITOS\n') +
      chalk.white('Angular 20 Avanzado - Requisitos Críticos\n') +
      chalk.gray('Imagina Formación | 2025'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }
    ));

    await this.checkNodeJS();
    await this.checkNpm();
    await this.checkAngularCLI();
    await this.checkGit();
    await this.checkInternetConnection();

    this.showResults();
  }

  async checkNodeJS() {
    try {
      const version = process.version.slice(1);
      const [major, minor, patch] = version.split('.').map(Number);
      
      if (major < 20 || (major === 20 && minor < 11)) {
        this.errors.push({
          component: 'Node.js',
          current: version,
          required: '>=20.11.1',
          solution: 'Actualizar Node.js desde https://nodejs.org'
        });
      } else {
        this.success.push(`Node.js ${version} ✅`);
      }
    } catch (error) {
      this.errors.push({
        component: 'Node.js',
        current: 'No detectado',
        required: '>=20.11.1',
        solution: 'Instalar Node.js desde https://nodejs.org'
      });
    }
  }

  async checkNpm() {
    try {
      const version = execSync('npm --version', { encoding: 'utf8' }).trim();
      const [major] = version.split('.').map(Number);
      
      if (major < 10) {
        this.errors.push({
          component: 'npm',
          current: version,
          required: '>=10.0.0',
          solution: 'npm install -g npm@latest'
        });
      } else {
        this.success.push(`npm ${version} ✅`);
      }
    } catch (error) {
      this.errors.push({
        component: 'npm',
        current: 'No detectado',
        required: '>=10.0.0',
        solution: 'Reinstalar Node.js (incluye npm)'
      });
    }
  }

  async checkAngularCLI() {
    try {
      const output = execSync('ng version', { encoding: 'utf8', stdio: 'pipe' });
      const cliMatch = output.match(/Angular CLI:\s*(\d+\.\d+\.\d+)/);
      
      if (cliMatch) {
        const version = cliMatch[1];
        const [major] = version.split('.').map(Number);
        
        if (major >= 18) {
          this.success.push(`Angular CLI ${version} ✅`);
        } else {
          this.errors.push({
            component: 'Angular CLI',
            current: version,
            required: '>=18.0.0',
            solution: 'npm uninstall -g @angular/cli && npm install -g @angular/cli@latest'
          });
        }
      } else {
        throw new Error('No se pudo determinar la versión');
      }
    } catch (error) {
      this.errors.push({
        component: 'Angular CLI',
        current: 'No instalado',
        required: '>=18.0.0',
        solution: 'npm install -g @angular/cli@latest'
      });
    }
  }

  async checkGit() {
    try {
      const output = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' });
      const versionMatch = output.match(/\d+\.\d+\.\d+/);
      
      if (versionMatch) {
        this.success.push(`Git ${versionMatch[0]} ✅`);
      } else {
        this.warnings.push('Git detectado pero versión no clara');
      }
    } catch (error) {
      this.warnings.push('Git no encontrado (recomendado para el curso)');
    }
  }

  async checkInternetConnection() {
    try {
      execSync('ping -c 1 google.com', { stdio: 'pipe', timeout: 5000 });
      this.success.push('Conexión a internet ✅');
    } catch (error) {
      this.errors.push({
        component: 'Internet',
        current: 'Sin conexión',
        required: 'Conexión estable',
        solution: 'Verificar conexión a internet'
      });
    }
  }

  showResults() {
    console.log('\n' + '='.repeat(60) + '\n');

    if (this.errors.length === 0) {
      console.log(boxen(
        chalk.green.bold('🎉 ¡REQUISITOS CUMPLIDOS!\n\n') +
        chalk.white(`✅ ${this.success.length} verificaciones exitosas\n`) +
        chalk.yellow(`⚠️  ${this.warnings.length} advertencias menores\n\n`) +
        chalk.green.bold('🚀 ¡Listo para el setup del proyecto!'),
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

      console.log(chalk.cyan('\n📚 Siguiente paso:'));
      console.log(chalk.white('   npm run setup:complete'));

    } else {
      console.log(boxen(
        chalk.red.bold('❌ REQUISITOS INCOMPLETOS\n\n') +
        chalk.white(`❌ ${this.errors.length} errores encontrados\n`) +
        chalk.white(`✅ ${this.success.length} requisitos OK\n\n`) +
        chalk.red.bold('🔧 Corregir errores antes de continuar'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'red'
        }
      ));

      console.log(chalk.red('\n❌ Errores que requieren atención:\n'));
      this.errors.forEach((error, index) => {
        console.log(chalk.red(`   ${index + 1}. ${error.component}:`));
        console.log(chalk.white(`      • Actual: ${error.current}`));
        console.log(chalk.white(`      • Requerido: ${error.required}`));
        console.log(chalk.cyan(`      • Solución: ${error.solution}`));
        console.log('');
      });
    }

    console.log(chalk.gray('\n📊 Información del sistema:'));
    console.log(chalk.gray(`   • Node.js: ${process.version}`));
    console.log(chalk.gray(`   • Plataforma: ${process.platform} ${process.arch}`));
    console.log(chalk.gray(`   • Directorio: ${process.cwd()}`));

    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  new RequirementsVerifier().run().catch(console.error);
}

module.exports = RequirementsVerifier;

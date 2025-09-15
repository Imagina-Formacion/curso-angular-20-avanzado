#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const inquirer = require('inquirer');

class MigrationHelper {
  constructor() {
    this.spinner = ora();
    this.currentNodeVersion = process.version.slice(1);
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🔄 ASISTENTE DE MIGRACIÓN\n') +
      chalk.white('Node.js v18 → v20+ para Angular 20\n') +
      chalk.gray('Imagina Formación | 2025'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }
    ));

    try {
      await this.checkCurrentVersion();
      await this.provideMigrationGuidance();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkCurrentVersion() {
    console.log(chalk.yellow('\n🔍 Analizando versión actual de Node.js...\n'));

    this.spinner.start('Verificando Node.js...');
    
    if (this.compareVersions(this.currentNodeVersion, '20.11.1') >= 0) {
      this.spinner.succeed(`Node.js ${this.currentNodeVersion} ✅ Compatible con Angular 20`);
      
      console.log(boxen(
        chalk.green.bold('🎉 ¡VERSIÓN CORRECTA!\n\n') +
        chalk.white(`Tu Node.js ${this.currentNodeVersion} es compatible con Angular 20.\n\n`) +
        chalk.yellow('🚀 Puedes continuar con:\n') +
        chalk.white('npm run setup:complete'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'green'
        }
      ));
      
      return;
    }

    this.spinner.fail(`Node.js ${this.currentNodeVersion} ❌ NO compatible con Angular 20`);
    
    console.log(chalk.red('\n⚠️  MIGRACIÓN NECESARIA:\n'));
    console.log(chalk.white(`🔴 Versión actual: ${this.currentNodeVersion}`));
    console.log(chalk.white('🔴 Angular 20 requiere: 20.11.1+'));
    console.log(chalk.white('🔴 Node.js v18 EOL: 27 marzo 2025'));
  }

  async provideMigrationGuidance() {
    const { migrationMethod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'migrationMethod',
        message: '¿Cómo prefieres instalar Node.js v20+?',
        choices: [
          { name: '🚀 nvm (recomendado) - Gestiona múltiples versiones', value: 'nvm' },
          { name: '📥 Instalador oficial - nodejs.org', value: 'official' },
          { name: '📖 Solo mostrar instrucciones', value: 'instructions' },
          { name: '❌ Cancelar migración', value: 'cancel' }
        ]
      }
    ]);

    switch (migrationMethod) {
      case 'nvm':
        await this.installWithNVM();
        break;
      case 'official':
        this.showOfficialInstructions();
        break;
      case 'instructions':
        this.showAllInstructions();
        break;
      case 'cancel':
        console.log(chalk.yellow('\n⚠️  Migración cancelada. Angular 20 NO funcionará sin Node.js v20+'));
        break;
    }
  }

  async installWithNVM() {
    console.log(chalk.yellow('\n🔧 Configurando nvm para Node.js v20...\n'));

    try {
      // Verificar si nvm está instalado
      this.spinner.start('Verificando nvm...');
      
      try {
        execSync('nvm --version', { stdio: 'pipe' });
        this.spinner.succeed('nvm disponible ✅');
      } catch {
        this.spinner.fail('nvm no encontrado');
        this.showNVMInstallation();
        return;
      }

      // Instalar Node.js v20 con nvm
      console.log(chalk.cyan('📥 Instalando Node.js v20 con nvm...'));
      console.log(chalk.white('Ejecuta estos comandos:'));
      
      console.log(boxen(
        chalk.cyan('nvm install 20.11.1\n') +
        chalk.cyan('nvm use 20.11.1\n') +
        chalk.cyan('nvm alias default 20.11.1\n') +
        chalk.cyan('node --version'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'cyan'
        }
      ));

      console.log(chalk.yellow('\n🔄 Después de ejecutar los comandos:'));
      console.log(chalk.white('npm run check:requirements'));

    } catch (error) {
      console.log(chalk.red(`❌ Error con nvm: ${error.message}`));
      this.showOfficialInstructions();
    }
  }

  showNVMInstallation() {
    console.log(boxen(
      chalk.yellow.bold('📥 INSTALAR NVM PRIMERO\n\n') +
      chalk.white('macOS/Linux:\n') +
      chalk.cyan('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash\n\n') +
      chalk.white('Windows:\n') +
      chalk.cyan('Descargar nvm-windows desde:\n') +
      chalk.cyan('https://github.com/coreybutler/nvm-windows\n\n') +
      chalk.yellow('Después reinicia terminal y ejecuta:\n') +
      chalk.white('npm run migrate:node'),
      {
        padding: 1,
        borderStyle: 'single',
        borderColor: 'yellow'
      }
    ));
  }

  showOfficialInstructions() {
    console.log(boxen(
      chalk.blue.bold('📥 INSTALACIÓN OFICIAL\n\n') +
      chalk.white('1. Ir a: ') + chalk.cyan('https://nodejs.org/\n') +
      chalk.white('2. Descargar: ') + chalk.green('Node.js v20 LTS\n') +
      chalk.white('3. Ejecutar instalador\n') +
      chalk.white('4. Reiniciar terminal\n') +
      chalk.white('5. Verificar: ') + chalk.cyan('node --version\n') +
      chalk.white('6. Continuar: ') + chalk.cyan('npm run check:requirements'),
      {
        padding: 1,
        borderStyle: 'single',
        borderColor: 'blue'
      }
    ));
  }

  showAllInstructions() {
    console.log(boxen(
      chalk.red.bold('🚨 MIGRACIÓN OBLIGATORIA: Node.js v18 → v20+\n\n') +
      chalk.white('¿Por qué migrar?\n') +
      chalk.white('• Angular 20 requiere Node.js v20.11.1+\n') +
      chalk.white('• Node.js v18 EOL: 27 marzo 2025\n') +
      chalk.white('• TypeScript 5.8+ requiere Node.js v20+\n\n') +
      chalk.yellow('OPCIÓN 1: nvm (recomendado)\n') +
      chalk.cyan('nvm install 20.11.1 && nvm use 20.11.1\n\n') +
      chalk.yellow('OPCIÓN 2: Instalador oficial\n') +
      chalk.cyan('https://nodejs.org/ → Descargar v20 LTS\n\n') +
      chalk.green('✅ Verificar migración:\n') +
      chalk.white('npm run check:requirements'),
      {
        padding: 1,
        borderStyle: 'double',
        borderColor: 'red'
      }
    ));
  }

  handleError(error) {
    console.log(boxen(
      chalk.red.bold('💥 ERROR EN MIGRACIÓN\n\n') +
      chalk.white(error.message + '\n\n') +
      chalk.yellow('🔧 Soluciones:\n') +
      chalk.white('• Verificar permisos de administrador\n') +
      chalk.white('• Cerrar todas las terminales y VS Code\n') +
      chalk.white('• Instalar manualmente desde nodejs.org'),
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

if (require.main === module) {
  new MigrationHelper().run().catch(console.error);
}

module.exports = MigrationHelper;

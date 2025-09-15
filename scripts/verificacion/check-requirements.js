#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');

class RequirementsChecker {
  constructor() {
    this.requirements = {
      node: '20.11.1',
      npm: '10.0.0',
      angularCli: '20.0.0'
    };
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0
    };
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('⚡ VERIFICACIÓN RÁPIDA\n') +
      chalk.white('Requisitos Angular 20 Avanzado\n') +
      chalk.gray('Imagina Formación | 2025'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'single',
        borderColor: 'blue'
      }
    ));

    console.log(chalk.yellow('\n🔍 Verificando requisitos críticos...\n'));

    await this.checkNodeJS();
    await this.checkNPM();
    await this.checkAngularCLI();
    await this.checkVSCode();
    await this.checkGit();

    this.showSummary();
  }

  async checkNodeJS() {
    try {
      const version = process.version.slice(1);
      
      if (this.compareVersions(version, this.requirements.node) >= 0) {
        console.log(chalk.green(`✅ Node.js ${version} - Compatible con Angular 20`));
        this.results.passed++;
      } else {
        console.log(chalk.red(`❌ Node.js ${version} - REQUIERE v${this.requirements.node}+`));
        console.log(chalk.yellow(`   🔧 Migrar: npm run migrate:node`));
        this.results.failed++;
      }
    } catch (error) {
      console.log(chalk.red('❌ Node.js no encontrado'));
      this.results.failed++;
    }
  }

  async checkNPM() {
    try {
      const version = execSync('npm --version', { encoding: 'utf8' }).trim();
      
      if (this.compareVersions(version, this.requirements.npm) >= 0) {
        console.log(chalk.green(`✅ npm ${version} - Actualizado`));
        this.results.passed++;
      } else {
        console.log(chalk.red(`❌ npm ${version} - REQUIERE v${this.requirements.npm}+`));
        console.log(chalk.yellow(`   🔧 Actualizar: npm install -g npm@latest`));
        this.results.failed++;
      }
    } catch (error) {
      console.log(chalk.red('❌ npm no encontrado'));
      this.results.failed++;
    }
  }

  async checkAngularCLI() {
    try {
      const output = execSync('ng version --json', { encoding: 'utf8', stdio: 'pipe' });
      const data = JSON.parse(output);
      const version = data.cli?.version;
      
      if (version && this.compareVersions(version, this.requirements.angularCli) >= 0) {
        console.log(chalk.green(`✅ Angular CLI ${version} - Compatible`));
        this.results.passed++;
      } else {
        console.log(chalk.red(`❌ Angular CLI ${version || 'antigua'} - REQUIERE v${this.requirements.angularCli}+`));
        console.log(chalk.yellow(`   🔧 Actualizar: npm install -g @angular/cli@latest`));
        this.results.failed++;
      }
    } catch (error) {
      console.log(chalk.red('❌ Angular CLI no encontrado'));
      console.log(chalk.yellow(`   🔧 Instalar: npm install -g @angular/cli@latest`));
      this.results.failed++;
    }
  }

  async checkVSCode() {
    try {
      execSync('code --version', { stdio: 'pipe' });
      console.log(chalk.green('✅ VS Code CLI - Disponible'));
      this.results.passed++;
    } catch (error) {
      console.log(chalk.yellow('⚠️  VS Code CLI - No disponible (opcional)'));
      console.log(chalk.gray('   💡 Configurar: Ctrl+Shift+P → "Shell Command: Install"'));
      this.results.warnings++;
    }
  }

  async checkGit() {
    try {
      const version = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' }).match(/\d+\.\d+\.\d+/)[0];
      console.log(chalk.green(`✅ Git ${version} - Disponible`));
      this.results.passed++;
    } catch (error) {
      console.log(chalk.yellow('⚠️  Git - No encontrado (recomendado)'));
      console.log(chalk.gray('   💡 Instalar desde: https://git-scm.com/'));
      this.results.warnings++;
    }
  }

  showSummary() {
    const total = this.results.passed + this.results.failed + this.results.warnings;
    
    console.log('\n' + '='.repeat(50));
    
    if (this.results.failed === 0) {
      console.log(boxen(
        chalk.green.bold('🎉 ¡REQUISITOS CUMPLIDOS!\n\n') +
        chalk.white(`✅ ${this.results.passed}/${total} verificaciones OK\n`) +
        (this.results.warnings > 0 ? chalk.yellow(`⚠️  ${this.results.warnings} advertencias menores\n`) : '') +
        chalk.green.bold('\n🚀 Listo para el setup completo'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'green'
        }
      ));

      console.log(chalk.cyan('\n📋 Próximos pasos:'));
      console.log(chalk.white('   1. npm run setup:complete'));
      console.log(chalk.white('   2. npm run extensions:install'));
      console.log(chalk.white('   3. npm run verify:setup'));

    } else {
      console.log(boxen(
        chalk.red.bold('❌ REQUISITOS PENDIENTES\n\n') +
        chalk.white(`❌ ${this.results.failed} errores críticos\n`) +
        chalk.white(`✅ ${this.results.passed} verificaciones OK\n\n`) +
        chalk.red.bold('🔧 Corregir errores antes de continuar'),
        {
          padding: 1,
          borderStyle: 'single',
          borderColor: 'red'
        }
      ));

      console.log(chalk.cyan('\n🔧 Soluciones rápidas:'));
      console.log(chalk.white('   • Node.js v20+: npm run migrate:node'));
      console.log(chalk.white('   • Angular CLI: npm install -g @angular/cli@latest'));
      console.log(chalk.white('   • npm: npm install -g npm@latest'));
    }

    process.exit(this.results.failed > 0 ? 1 : 0);
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
  new RequirementsChecker().run().catch(console.error);
}

module.exports = RequirementsChecker;

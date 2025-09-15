#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');

class ExtensionsInstaller {
  constructor() {
    this.spinner = ora();
    // Extensiones específicas para Angular 20
    this.extensions = {
      essential: [
        'angular.ng-template',
        'ms-vscode.vscode-typescript-next', 
        'esbenp.prettier-vscode',
        'ms-vscode.vscode-eslint',
        'johnpapa.angular2'
      ],
      development: [
        'streetsidesoftware.code-spell-checker',
        'eamodio.gitlens',
        'ms-vscode.vscode-json',
        'gruntfuggly.todo-tree',
        'yzhang.markdown-all-in-one'
      ],
      testing: [
        'orta.vscode-jest',
        'ms-vscode.test-adapter-converter'
      ],
      productivity: [
        'formulahendry.auto-rename-tag',
        'bradlc.vscode-tailwindcss',
        'ms-vscode.live-server'
      ]
    };
  }

  async run() {
    console.log(boxen(
      chalk.blue.bold('🔧 INSTALADOR DE EXTENSIONES\n') +
      chalk.white('VS Code Extensions para Angular 20 Avanzado\n') +
      chalk.gray('Imagina Formación | 2025'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }
    ));

    try {
      await this.checkVSCode();
      await this.installExtensions();
      this.showSuccess();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkVSCode() {
    this.spinner.start('Verificando VS Code CLI...');
    
    try {
      execSync('code --version', { stdio: 'pipe' });
      this.spinner.succeed('VS Code CLI disponible ✅');
    } catch {
      this.spinner.fail('VS Code CLI no disponible');
      throw new Error(`
❌ VS Code CLI no encontrado

🔧 SOLUCIONES:
1. En VS Code: Ctrl+Shift+P → "Shell Command: Install 'code' command in PATH"
2. Reinstalar VS Code desde: https://code.visualstudio.com/
3. Instalar extensiones manualmente desde VS Code Marketplace

⚠️  Sin VS Code CLI, las extensiones se deben instalar manualmente.
      `);
    }
  }

  async installExtensions() {
    console.log(chalk.yellow('\n📦 Instalando extensiones por categorías...\n'));

    for (const [category, extensions] of Object.entries(this.extensions)) {
      console.log(chalk.cyan(`\n📂 ${category.toUpperCase()}:`));
      
      for (const extension of extensions) {
        await this.installExtension(extension);
      }
    }
  }

  async installExtension(extension) {
    this.spinner.start(`Instalando ${extension}...`);
    
    try {
      execSync(`code --install-extension ${extension}`, { 
        stdio: 'pipe',
        timeout: 30000 
      });
      this.spinner.succeed(`${extension} ✅`);
    } catch {
      this.spinner.warn(`${extension} ⚠️ (instalar manualmente)`);
    }
  }

  showSuccess() {
    console.log(boxen(
      chalk.green.bold('🎉 EXTENSIONES INSTALADAS\n\n') +
      chalk.white('✅ Extensiones esenciales instaladas\n') +
      chalk.white('✅ VS Code configurado para Angular 20\n') +
      chalk.white('✅ Entorno de desarrollo optimizado\n\n') +
      chalk.yellow('🔄 Próximos pasos:\n') +
      chalk.white('1. Reiniciar VS Code\n') +
      chalk.white('2. Abrir proyecto: code campus-virtual-eso\n') +
      chalk.white('3. Verificar setup: npm run verify:setup'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'single',
        borderColor: 'green'
      }
    ));
  }

  handleError(error) {
    console.log(boxen(
      chalk.red.bold('❌ ERROR INSTALANDO EXTENSIONES\n\n') +
      chalk.white(error.message + '\n\n') +
      chalk.yellow('🔧 Alternativas:\n') +
      chalk.white('• Instalar manualmente desde VS Code\n') +
      chalk.white('• Buscar "@recommended" en extensiones\n') +
      chalk.white('• Usar lista de .vscode/extensions.json'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'single',
        borderColor: 'red'
      }
    ));

    process.exit(1);
  }
}

if (require.main === module) {
  new ExtensionsInstaller().run().catch(console.error);
}

module.exports = ExtensionsInstaller;

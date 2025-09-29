#!/usr/bin/env node

/**
 * Sistema de verificación automatizada para ejercicios de la Sesión 1
 * Curso Angular 20 Avanzado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Configuración de ejercicios y sus verificaciones
const exercises = {
  '01-signals-basicos': {
    name: 'Signals Básicos',
    files: ['contador.component.ts'],
    checks: [
      {
        name: 'Usa signal para el contador',
        test: (content) => content.includes('signal(0)') || content.includes('signal<number>(0)'),
        hint: 'Debes usar signal(0) para crear el contador'
      },
      {
        name: 'Usa computed para el doble',
        test: (content) => content.includes('computed('),
        hint: 'Debes usar computed() para calcular el doble del valor'
      },
      {
        name: 'Tiene método incrementar',
        test: (content) => content.includes('incrementar') || content.includes('increment'),
        hint: 'Debes implementar un método para incrementar el contador'
      },
      {
        name: 'Tiene método decrementar',
        test: (content) => content.includes('decrementar') || content.includes('decrement'),
        hint: 'Debes implementar un método para decrementar el contador'
      }
    ]
  },
  '02-formularios-reactivos': {
    name: 'Formularios Reactivos',
    files: ['usuario-form.component.ts'],
    checks: [
      {
        name: 'Usa FormBuilder',
        test: (content) => content.includes('FormBuilder'),
        hint: 'Debes usar FormBuilder para crear el formulario'
      },
      {
        name: 'Tiene validación de email',
        test: (content) => content.includes('Validators.email'),
        hint: 'Debes añadir Validators.email al campo email'
      },
      {
        name: 'Tiene validación required',
        test: (content) => content.includes('Validators.required'),
        hint: 'Debes añadir Validators.required a los campos obligatorios'
      },
      {
        name: 'Usa computed para validación',
        test: (content) => content.includes('computed(') && content.includes('valid'),
        hint: 'Usa computed() para verificar si el formulario es válido'
      }
    ]
  },
  '03-control-flow': {
    name: 'Control Flow Syntax',
    files: ['lista.component.ts'],
    checks: [
      {
        name: 'Usa @if en el template',
        test: (content) => content.includes('@if'),
        hint: 'Debes usar @if para condicionales en el template'
      },
      {
        name: 'Usa @for para iterar',
        test: (content) => content.includes('@for'),
        hint: 'Debes usar @for para iterar sobre la lista'
      },
      {
        name: 'Usa @empty para lista vacía',
        test: (content) => content.includes('@empty'),
        hint: 'Usa @empty dentro de @for para mostrar mensaje cuando no hay elementos'
      },
      {
        name: 'Usa track en @for',
        test: (content) => content.includes('track'),
        hint: 'Debes usar track en @for para optimizar el renderizado'
      }
    ]
  },
  '04-standalone-components': {
    name: 'Componentes Standalone',
    files: ['card.component.ts'],
    checks: [
      {
        name: 'Es componente standalone',
        test: (content) => content.includes('standalone: true'),
        hint: 'El componente debe ser standalone: true'
      },
      {
        name: 'Importa CommonModule',
        test: (content) => content.includes('CommonModule'),
        hint: 'Debes importar CommonModule en imports[]'
      },
      {
        name: 'Usa input() para recibir datos',
        test: (content) => content.includes('input(') || content.includes('@Input'),
        hint: 'Usa input() o @Input para recibir datos del padre'
      },
      {
        name: 'Usa output() para emitir eventos',
        test: (content) => content.includes('output(') || content.includes('@Output'),
        hint: 'Usa output() o @Output para emitir eventos al padre'
      }
    ]
  },
  '05-servicios-signals': {
    name: 'Servicios con Signals',
    files: ['todo.service.ts'],
    checks: [
      {
        name: 'Usa Injectable',
        test: (content) => content.includes('@Injectable'),
        hint: 'El servicio debe usar @Injectable({ providedIn: "root" })'
      },
      {
        name: 'Usa signal para el estado',
        test: (content) => content.includes('signal([') || content.includes('signal<'),
        hint: 'Usa signal([]) para manejar la lista de tareas'
      },
      {
        name: 'Tiene método agregar',
        test: (content) => content.includes('agregar') || content.includes('add'),
        hint: 'Implementa un método para agregar tareas'
      },
      {
        name: 'Usa update para modificar',
        test: (content) => content.includes('.update('),
        hint: 'Usa signal.update() para modificar el estado'
      }
    ]
  }
};

// Función principal de verificación
function verifyExercise(exerciseId) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  const exercise = exercises[exerciseId];
  if (!exercise) {
    console.log(`${colors.red}✗ Ejercicio '${exerciseId}' no encontrado${colors.reset}`);
    listExercises();
    return false;
  }

  console.log(`${colors.bright}🔍 Verificando: ${exercise.name}${colors.reset}\n`);

  let allPassed = true;
  let passedCount = 0;

  exercise.files.forEach(file => {
    const filePath = path.join(__dirname, exerciseId, file);

    if (!fs.existsSync(filePath)) {
      console.log(`${colors.red}✗ Archivo no encontrado: ${file}${colors.reset}`);
      console.log(`  ${colors.yellow}→ Asegúrate de crear el archivo en: ${exerciseId}/${file}${colors.reset}\n`);
      allPassed = false;
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`${colors.blue}📄 Analizando: ${file}${colors.reset}`);

    exercise.checks.forEach(check => {
      if (check.test(content)) {
        console.log(`  ${colors.green}✓ ${check.name}${colors.reset}`);
        passedCount++;
      } else {
        console.log(`  ${colors.red}✗ ${check.name}${colors.reset}`);
        console.log(`    ${colors.yellow}💡 ${check.hint}${colors.reset}`);
        allPassed = false;
      }
    });
    console.log();
  });

  // Resumen
  const totalChecks = exercise.files.length * exercise.checks.length;
  const percentage = Math.round((passedCount / totalChecks) * 100);

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  if (allPassed) {
    console.log(`${colors.green}${colors.bright}🎉 ¡EXCELENTE! Has completado el ejercicio correctamente${colors.reset}`);
    console.log(`${colors.green}   Puntuación: ${passedCount}/${totalChecks} (100%)${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}📝 Ejercicio incompleto${colors.reset}`);
    console.log(`   Puntuación: ${passedCount}/${totalChecks} (${percentage}%)`);
    console.log(`   ${colors.yellow}Revisa los puntos marcados con ✗ y sus sugerencias${colors.reset}\n`);
  }

  return allPassed;
}

// Verificar todos los ejercicios
function verifyAll() {
  console.log(`\n${colors.bright}${colors.blue}🚀 Verificación completa de ejercicios - Sesión 1${colors.reset}\n`);

  let totalPassed = 0;
  const results = [];

  Object.keys(exercises).forEach(exerciseId => {
    const passed = verifyExercise(exerciseId);
    results.push({ name: exercises[exerciseId].name, passed });
    if (passed) totalPassed++;
  });

  // Resumen final
  console.log(`${colors.cyan}${'═'.repeat(54)}${colors.reset}`);
  console.log(`${colors.bright}📊 RESUMEN FINAL${colors.reset}\n`);

  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    const color = result.passed ? colors.green : colors.red;
    console.log(`  ${icon} Ejercicio ${index + 1}: ${result.name} ${color}${result.passed ? 'COMPLETADO' : 'PENDIENTE'}${colors.reset}`);
  });

  const percentage = Math.round((totalPassed / results.length) * 100);
  console.log(`\n  ${colors.bright}Total: ${totalPassed}/${results.length} ejercicios completados (${percentage}%)${colors.reset}`);

  if (totalPassed === results.length) {
    console.log(`\n${colors.green}${colors.bright}🏆 ¡FELICITACIONES! Has completado todos los ejercicios de la Sesión 1${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}💪 ¡Sigue así! Te faltan ${results.length - totalPassed} ejercicios por completar${colors.reset}`);
  }
  console.log(`${colors.cyan}${'═'.repeat(54)}${colors.reset}\n`);
}

// Listar ejercicios disponibles
function listExercises() {
  console.log(`\n${colors.bright}📚 Ejercicios disponibles:${colors.reset}\n`);
  Object.entries(exercises).forEach(([id, exercise]) => {
    console.log(`  • ${colors.cyan}${id}${colors.reset}: ${exercise.name}`);
  });
  console.log(`\n${colors.yellow}Uso: npm run verify:exercise [ejercicio-id]${colors.reset}`);
  console.log(`${colors.yellow}     npm run verify:all${colors.reset}\n`);
}

// Mostrar ayuda
function showHelp() {
  console.log(`
${colors.bright}🎯 Sistema de Verificación de Ejercicios - Angular 20${colors.reset}

${colors.cyan}Comandos disponibles:${colors.reset}

  ${colors.green}npm run verify:exercise [id]${colors.reset}  Verifica un ejercicio específico
  ${colors.green}npm run verify:all${colors.reset}             Verifica todos los ejercicios
  ${colors.green}npm run verify:help${colors.reset}            Muestra esta ayuda

${colors.cyan}Ejemplos:${colors.reset}

  npm run verify:exercise 01-signals-basicos
  npm run verify:exercise 02-formularios-reactivos
  npm run verify:all

${colors.cyan}Ejercicios disponibles:${colors.reset}
`);

  Object.entries(exercises).forEach(([id, exercise]) => {
    console.log(`  ${colors.yellow}${id.padEnd(25)}${colors.reset} ${exercise.name}`);
  });

  console.log(`\n${colors.bright}💡 Tips:${colors.reset}
  • Completa los ejercicios en orden
  • Lee las sugerencias cuando algo falle
  • Usa los snippets proporcionados
  • Consulta la documentación si tienes dudas
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help') {
  showHelp();
} else if (command === 'all') {
  verifyAll();
} else if (command === 'list') {
  listExercises();
} else {
  verifyExercise(command);
}
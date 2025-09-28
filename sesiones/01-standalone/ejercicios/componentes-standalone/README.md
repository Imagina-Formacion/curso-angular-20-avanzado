# 🧩 Ejercicio 2: Comunicación entre Componentes Standalone

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Implementar comunicación padre-hijo con @Input/@Output
- Crear interfaces TypeScript para tipado seguro
- Manejar eventos entre componentes standalone
- Estructurar aplicaciones con componentes reutilizables

## ⏱️ Duración: 15 minutos

---

## 📋 Desafío: Sistema de Gestión de Usuarios

### 🎯 **Tu Misión:**
Crear una aplicación de gestión de usuarios donde un componente padre gestiona la lista y los componentes hijos muestran cada usuario individualmente.

### 📦 **Proyecto Inicial:**
Crea un nuevo proyecto:
```bash
ng new user-manager --standalone --style=scss --routing=false
cd user-manager
```

### 🚀 **Tareas a Completar:**

#### ✅ **Tarea 1: Interface User (3 min)**
Crea una interface para los usuarios:
- Propiedades: `id`, `name`, `email`, `active`
- Tipos: number, string, string, boolean
- Exportar desde archivo separado

**Requisitos técnicos:**
- Archivo `user.interface.ts`
- Tipado estricto para todas las propiedades
- Export correcto para reutilización

#### ✅ **Tarea 2: UserCard Component (Hijo) (6 min)**
Crea un componente standalone que:
- Reciba un objeto User via @Input()
- Emita eventos de toggle status y delete via @Output()
- Muestre información del usuario de forma atractiva
- Use EventEmitter para comunicación

**Requisitos técnicos:**
- `@Input() user!: User`
- `@Output() toggleStatus = new EventEmitter<number>()`
- `@Output() deleteUser = new EventEmitter<number>()`
- Standalone component con imports necesarios

#### ✅ **Tarea 3: UserList Component (Padre) (6 min)**
Crea el componente padre que:
- Gestione un array de usuarios
- Muestre múltiples UserCard components
- Maneje eventos de toggle y delete
- Permita agregar nuevos usuarios

**Requisitos técnicos:**
- Array de usuarios con datos de ejemplo
- Métodos para manejar eventos del hijo
- Formulario simple para agregar usuarios
- Import del UserCard component

### 🎯 **Criterios de Éxito:**

Tu aplicación debe cumplir:

✅ **Interface User** - tipado correcto y exportada
✅ **UserCard standalone** - recibe User por @Input()
✅ **Eventos funcionando** - toggle status y delete
✅ **UserList gestiona estado** - array de usuarios
✅ **Comunicación padre-hijo** - sin errores de tipos

### 📚 **Recursos de Ayuda:**

#### 🔧 **Sintaxis Clave:**
```typescript
// Interface
export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

// Componente Hijo
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-card">
      <h3>{{user.name}}</h3>
      <p>{{user.email}}</p>
      <button (click)="onToggle()">
        {{user.active ? 'Desactivar' : 'Activar'}}
      </button>
      <button (click)="onDelete()">Eliminar</button>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() toggleStatus = new EventEmitter<number>();
  @Output() deleteUser = new EventEmitter<number>();

  onToggle() {
    this.toggleStatus.emit(this.user.id);
  }

  onDelete() {
    this.deleteUser.emit(this.user.id);
  }
}

// Componente Padre
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UserCardComponent],
  template: `
    <div>
      <!-- Formulario agregar usuario -->
      <input [(ngModel)]="newName" placeholder="Nombre">
      <input [(ngModel)]="newEmail" placeholder="Email">
      <button (click)="addUser()">Agregar</button>

      <!-- Lista de usuarios -->
      @for (user of users; track user.id) {
        <app-user-card
          [user]="user"
          (toggleStatus)="handleToggleStatus($event)"
          (deleteUser)="handleDeleteUser($event)">
        </app-user-card>
      }
    </div>
  `
})
export class UserListComponent {
  users: User[] = [
    { id: 1, name: 'Ana García', email: 'ana@email.com', active: true },
    { id: 2, name: 'Carlos López', email: 'carlos@email.com', active: false }
  ];

  newName = '';
  newEmail = '';

  addUser() {
    if (this.newName && this.newEmail) {
      this.users.push({
        id: Date.now(),
        name: this.newName,
        email: this.newEmail,
        active: true
      });
      this.newName = '';
      this.newEmail = '';
    }
  }

  handleToggleStatus(userId: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.active = !user.active;
    }
  }

  handleDeleteUser(userId: number) {
    this.users = this.users.filter(u => u.id !== userId);
  }
}
```

#### 🎯 **Snippets VS Code Disponibles:**
- `ng20-standalone` - Componente standalone básico
- `ng20-interface` - Interface TypeScript
- `ng20-input-output` - Propiedades Input/Output

### 🚨 **Problemas Comunes:**

❌ **Error:** `Property 'user' has no initializer`
✅ **Solución:** Usar `@Input() user!: User` con ! para non-null assertion

❌ **Error:** `Type 'User' is not assignable to type 'never'`
✅ **Solución:** Importar correctamente la interface User

❌ **Error:** `Cannot read property 'name' of undefined`
✅ **Solución:** Verificar que el @Input() se está pasando correctamente

### 🎖️ **Bonus Challenge:**
Si terminas antes, añade:
- 🎨 Estilos CSS atractivos para las cards
- 📊 Contador de usuarios activos/inactivos
- 🔍 Filtro para buscar usuarios por nombre

---

## ✅ **¿Completaste el ejercicio?**

**Revisa que tengas:**
1. ✅ Interface User correctamente tipada
2. ✅ UserCard component standalone funcionando
3. ✅ Comunicación @Input/@Output sin errores
4. ✅ UserList gestiona el estado correctamente
5. ✅ Formulario para agregar usuarios funcional

**¡Listo para el siguiente ejercicio!** 🚀
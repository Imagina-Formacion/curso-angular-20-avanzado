# 🔄 Ejercicio: Signals Básicos y Computed Signals

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Crear y gestionar signals básicos en Angular 20
- Usar computed signals para estado derivado
- Implementar effects para reaccionar a cambios
- Entender la interoperabilidad con RxJS

## ⏱️ Duración: 35 minutos

---

## 📚 Parte 1: Conceptos Previos (10 min)

### 🤔 ¿Qué son los Signals?
Los Signals son el nuevo sistema de reactividad de Angular que:
- **Simplifican la gestión de estado** comparado con RxJS
- **Optimizan Change Detection** automáticamente
- **Eliminan memory leaks** por diseño
- **Mejoran el debugging** con APIs más intuitivas

### 🎯 ¿Por qué son revolutionarios?
- **Menos código**: Sin subscriptions manuales
- **Mejor performance**: Change Detection granular
- **TypeScript-first**: Inference perfecto
- **Debugging fácil**: Estado siempre visible

### 📖 API Básica de Signals

```typescript
// 📊 Signal básico
const count = signal(0);

// 🧮 Computed signal (estado derivado)
const doubleCount = computed(() => count() * 2);

// 🔄 Effect (side effects)
effect(() => {
  console.log('Count changed:', count());
});

// 📝 Actualizar signals
count.set(5);           // Asignar valor
count.update(c => c + 1); // Actualizar basado en valor actual
```

---

## 🛠️ Parte 2: Hands-On - Implementación Paso a Paso (20 min)

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo, usa estos snippets de VS Code:
- **`ng20-signal`**: Signal básico con métodos
- **`ng20-computed`**: Computed signal con dependencias
- **`ng20-effect`**: Effect con cleanup automático
- **`ng20-signal-service`**: Servicio con signals

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

### 📦 Paso 1: Setup del Proyecto

#### **Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular Standalone
ng new signals-demo --standalone --style=scss --routing=false
cd signals-demo

# 3. Instalar dependencias
npm install
```

#### **Opción B: CodeSandbox**
1. Ir a [codesandbox.io](https://codesandbox.io)
2. Crear nuevo proyecto Angular
3. Copiar código desde este ejercicio

### 🎯 Paso 2: Counter Component con Signals

**Archivo:** `src/app/components/counter/counter.component.ts`

```typescript
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-container">
      <h2>🔄 Counter con Signals</h2>

      <!-- 📊 Mostrar valores -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Valor Actual</h3>
          <span class="value">{{ count() }}</span>
        </div>

        <div class="stat-card">
          <h3>Doble</h3>
          <span class="value">{{ doubleCount() }}</span>
        </div>

        <div class="stat-card">
          <h3>Es Par?</h3>
          <span class="value">{{ isEven() ? '✅' : '❌' }}</span>
        </div>

        <div class="stat-card">
          <h3>Cambios</h3>
          <span class="value">{{ changeHistory().length }}</span>
        </div>
      </div>

      <!-- 🎮 Controles -->
      <div class="controls">
        <button (click)="increment()" class="btn btn-primary">
          ➕ Incrementar
        </button>

        <button (click)="decrement()" class="btn btn-secondary">
          ➖ Decrementar
        </button>

        <button (click)="reset()" class="btn btn-danger">
          🔄 Reset
        </button>

        <button (click)="setRandom()" class="btn btn-success">
          🎲 Random
        </button>
      </div>

      <!-- 📈 Historial de cambios -->
      <div class="history-section">
        <h3>📈 Historial de Cambios</h3>
        <div class="history-list">
          @for (change of changeHistory(); track change.timestamp) {
            <div class="history-item">
              <span class="timestamp">{{ formatTime(change.timestamp) }}</span>
              <span class="operation">{{ change.operation }}</span>
              <span class="value">{{ change.from }} → {{ change.to }}</span>
            </div>
          }

          @if (changeHistory().length === 0) {
            <p class="no-history">No hay cambios aún</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .counter-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h2 {
      text-align: center;
      color: #1976d2;
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #495057;
    }

    .value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover {
      background: #1e7e34;
    }

    .history-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .history-section h3 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    .history-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #e9ecef;
      font-size: 0.9rem;
    }

    .timestamp {
      color: #6c757d;
      font-size: 0.8rem;
    }

    .operation {
      font-weight: 500;
      color: #495057;
    }

    .no-history {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      margin: 1rem 0;
    }
  `]
})
export class CounterComponent {
  // 📊 Signal básico para el contador
  count = signal(0);

  // 📈 Signal para historial de cambios
  private _changeHistory = signal<Array<{
    timestamp: number;
    operation: string;
    from: number;
    to: number;
  }>>([]);

  // 🧮 Computed signals (estado derivado)
  doubleCount = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);
  changeHistory = this._changeHistory.asReadonly();

  constructor() {
    // 🔄 Effect para logging (side effects)
    effect(() => {
      console.log('🔄 Counter changed:', {
        value: this.count(),
        double: this.doubleCount(),
        isEven: this.isEven()
      });
    });

    // 🔄 Effect para persistencia (ejemplo avanzado)
    effect(() => {
      localStorage.setItem('counter-value', this.count().toString());
    });
  }

  // 📝 Métodos para actualizar el signal
  increment(): void {
    const oldValue = this.count();
    this.count.update(current => current + 1);
    this.addToHistory('Incrementar', oldValue, this.count());
  }

  decrement(): void {
    const oldValue = this.count();
    this.count.update(current => current - 1);
    this.addToHistory('Decrementar', oldValue, this.count());
  }

  reset(): void {
    const oldValue = this.count();
    this.count.set(0);
    this.addToHistory('Reset', oldValue, this.count());
  }

  setRandom(): void {
    const oldValue = this.count();
    const randomValue = Math.floor(Math.random() * 100);
    this.count.set(randomValue);
    this.addToHistory('Random', oldValue, this.count());
  }

  // 📈 Helper para gestionar historial
  private addToHistory(operation: string, from: number, to: number): void {
    this._changeHistory.update(history => [
      ...history,
      {
        timestamp: Date.now(),
        operation,
        from,
        to
      }
    ]);
  }

  // 🕒 Helper para formatear tiempo
  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }
}
```

### 🔗 Paso 3: Shopping Cart Service con Signals

**Archivo:** `src/app/services/shopping-cart.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  // 📊 Signal privado para items del carrito
  private _items = signal<CartItem[]>([]);

  // 📊 Signal para descuento aplicado
  private _discount = signal(0);

  // 🔗 Signals públicos readonly
  readonly items = this._items.asReadonly();
  readonly discount = this._discount.asReadonly();

  // 🧮 Computed signals para estado derivado
  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  readonly discountAmount = computed(() =>
    this.subtotal() * (this._discount() / 100)
  );

  readonly total = computed(() =>
    this.subtotal() - this.discountAmount()
  );

  readonly isEmpty = computed(() => this._items().length === 0);

  // 📝 Métodos para gestionar el carrito
  addItem(product: Omit<CartItem, 'quantity'>): void {
    this._items.update(items => {
      const existingItem = items.find(item => item.id === product.id);

      if (existingItem) {
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...items, { ...product, quantity: 1 }];
      }
    });
  }

  removeItem(id: number): void {
    this._items.update(items => items.filter(item => item.id !== id));
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    this._items.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this._items.set([]);
  }

  applyDiscount(percentage: number): void {
    this._discount.set(Math.max(0, Math.min(100, percentage)));
  }
}
```

### 🛒 Paso 4: Shopping Cart Component

**Archivo:** `src/app/components/shopping-cart/shopping-cart.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-container">
      <h2>🛒 Shopping Cart con Signals</h2>

      <!-- 📊 Estadísticas del carrito -->
      <div class="cart-stats">
        <div class="stat">
          <span class="label">Items:</span>
          <span class="value">{{ cartService.totalItems() }}</span>
        </div>
        <div class="stat">
          <span class="label">Subtotal:</span>
          <span class="value">\${{ cartService.subtotal().toFixed(2) }}</span>
        </div>
        @if (cartService.discount() > 0) {
          <div class="stat discount">
            <span class="label">Descuento ({{ cartService.discount() }}%):</span>
            <span class="value">-\${{ cartService.discountAmount().toFixed(2) }}</span>
          </div>
        }
        <div class="stat total">
          <span class="label">Total:</span>
          <span class="value">\${{ cartService.total().toFixed(2) }}</span>
        </div>
      </div>

      <!-- 🛍️ Productos disponibles -->
      <div class="products-section">
        <h3>🛍️ Productos Disponibles</h3>
        <div class="products-grid">
          @for (product of availableProducts; track product.id) {
            <div class="product-card">
              <h4>{{ product.name }}</h4>
              <p class="price">\${{ product.price.toFixed(2) }}</p>
              <button
                (click)="addToCart(product)"
                class="btn btn-primary"
              >
                Agregar al Carrito
              </button>
            </div>
          }
        </div>
      </div>

      <!-- 🛒 Items en el carrito -->
      <div class="cart-items-section">
        <h3>🛒 Items en el Carrito</h3>

        @if (cartService.isEmpty()) {
          <p class="empty-cart">El carrito está vacío</p>
        } @else {
          <div class="cart-items">
            @for (item of cartService.items(); track item.id) {
              <div class="cart-item">
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p class="price">\${{ item.price.toFixed(2) }} c/u</p>
                </div>

                <div class="quantity-controls">
                  <button
                    (click)="updateQuantity(item.id, item.quantity - 1)"
                    class="btn btn-sm"
                  >
                    ➖
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button
                    (click)="updateQuantity(item.id, item.quantity + 1)"
                    class="btn btn-sm"
                  >
                    ➕
                  </button>
                </div>

                <div class="item-total">
                  \${{ (item.price * item.quantity).toFixed(2) }}
                </div>

                <button
                  (click)="removeItem(item.id)"
                  class="btn btn-danger btn-sm"
                >
                  🗑️
                </button>
              </div>
            }
          </div>

          <!-- 💰 Descuento -->
          <div class="discount-section">
            <label for="discount">Aplicar descuento (%):</label>
            <input
              type="number"
              id="discount"
              [value]="cartService.discount()"
              (input)="applyDiscount($event)"
              min="0"
              max="100"
              class="discount-input"
            >
          </div>

          <!-- 🧹 Acciones del carrito -->
          <div class="cart-actions">
            <button
              (click)="clearCart()"
              class="btn btn-danger"
            >
              🧹 Limpiar Carrito
            </button>
            <button
              class="btn btn-success"
              [disabled]="cartService.isEmpty()"
            >
              💳 Checkout (\${{ cartService.total().toFixed(2) }})
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .cart-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .stat {
      background: #f8f9fa;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .stat.discount {
      background: #fff3cd;
      border-color: #ffeaa7;
    }

    .stat.total {
      background: #d4edda;
      border-color: #c3e6cb;
      font-weight: bold;
    }

    .label {
      color: #6c757d;
      margin-right: 0.5rem;
    }

    .value {
      font-weight: 500;
      color: #495057;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .product-card {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .item-info {
      flex: 1;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .discount-input {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      margin-left: 0.5rem;
      width: 80px;
    }

    .cart-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .empty-cart {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      margin: 2rem 0;
    }
  `]
})
export class ShoppingCartComponent {
  // 💉 Inyección del servicio
  cartService = inject(ShoppingCartService);

  // 🛍️ Productos de ejemplo
  availableProducts = [
    { id: 1, name: 'MacBook Pro', price: 1299.99 },
    { id: 2, name: 'iPhone 15', price: 999.99 },
    { id: 3, name: 'AirPods Pro', price: 249.99 },
    { id: 4, name: 'Magic Mouse', price: 79.99 },
    { id: 5, name: 'iPad Air', price: 599.99 },
    { id: 6, name: 'Apple Watch', price: 399.99 }
  ];

  addToCart(product: any): void {
    this.cartService.addItem(product);
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
  }

  updateQuantity(id: number, quantity: number): void {
    this.cartService.updateQuantity(id, quantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  applyDiscount(event: Event): void {
    const input = event.target as HTMLInputElement;
    const percentage = parseInt(input.value) || 0;
    this.cartService.applyDiscount(percentage);
  }
}
```

### 🔗 Paso 5: Integrar en AppComponent

**Archivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './components/counter/counter.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CounterComponent,
    ShoppingCartComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🔄 Signals Demo - Angular 20</h1>
        <p>Explorando reactividad moderna con Signals</p>
      </header>

      <main class="app-main">
        <app-counter></app-counter>
        <hr class="section-divider">
        <app-shopping-cart></app-shopping-cart>
      </main>

      <footer class="app-footer">
        <p>Curso Angular 20 Avanzado - Imagina Formación 2025</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .app-header h1 {
      margin: 0;
      font-size: 2.5rem;
    }

    .app-header p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
    }

    .app-main {
      flex: 1;
      padding: 2rem;
    }

    .section-divider {
      margin: 3rem 0;
      border: none;
      border-top: 2px solid #e9ecef;
    }

    .app-footer {
      background: #f8f9fa;
      text-align: center;
      padding: 1rem;
      border-top: 1px solid #e9ecef;
    }
  `]
})
export class AppComponent {
  title = 'signals-demo';
}
```

---

## 🧪 Parte 3: Experimentación (5 min)

### 🔬 Experimento 1: Performance Monitoring
Abre las DevTools de Chrome y observa:
1. **Console**: Logs automáticos de los effects
2. **Performance**: Change Detection granular
3. **Memory**: Ausencia de memory leaks

### 🔬 Experimento 2: Signal Updates
Prueba diferentes formas de actualizar signals:
```typescript
// ✅ Recomendado: update() para transformaciones
count.update(c => c + 1);

// ✅ OK: set() para valores absolutos
count.set(42);

// ❌ NO hacer: mutar el valor directamente
// count() = 5; // Esto no compilará
```

### 🔬 Experimento 3: Computed Dependencies
Modifica el CounterComponent para añadir más computed signals:
```typescript
// Computed que depende de otros computed
readonly status = computed(() => {
  const value = this.count();
  const isEven = this.isEven();

  if (value === 0) return 'Inicial';
  if (value > 50) return 'Alto';
  if (isEven) return 'Par';
  return 'Impar';
});
```

---

## ❓ Preguntas de Comprensión

1. **¿Cuál es la principal ventaja de signals sobre BehaviorSubject?**

2. **¿Por qué los computed signals son readonly?**

3. **¿Cuándo usarías effect() vs computed()?**

4. **¿Cómo se compara la performance de signals vs observables?**

---

## 🎯 Desafíos Adicionales

### Desafío 1: Todo List con Signals
Crea un componente de lista de tareas que use:
- Signal para la lista de tareas
- Computed para tareas completadas/pendientes
- Effect para persistencia en localStorage

### Desafío 2: Real-time Clock
Implementa un reloj que:
- Use signals para hora actual
- Computed para diferentes formatos
- Effect para actualización automática

### Desafío 3: Form Validation
Crea un formulario que:
- Use signals para cada campo
- Computed para validaciones
- Effect para mensajes de error

---

## 🔄 Interoperabilidad con RxJS

### Conversión de Observable a Signal
```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Observable existente
const data$ = this.http.get('/api/data');

// Convertir a signal
readonly data = toSignal(data$, { initialValue: null });
```

### Conversión de Signal a Observable
```typescript
import { toObservable } from '@angular/core/rxjs-interop';

// Signal existente
readonly count = signal(0);

// Convertir a observable
readonly count$ = toObservable(this.count);
```

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo qué son los signals y sus ventajas
- [ ] Puedo crear signals básicos con signal()
- [ ] Domino computed signals para estado derivado
- [ ] Sé usar effects para side effects controlados
- [ ] Comprendo las diferencias con RxJS
- [ ] Puedo convertir entre signals y observables

---

## 🏁 Conclusión

**Recuerda:**
- Signals = Simplicidad + Performance automática
- Computed = Estado derivado sin repetir cálculos
- Effects = Side effects controlados y limpieza automática
- TypeScript inference perfecto out-of-the-box

**Próximo paso:** Optimizar Change Detection con OnPush Strategy
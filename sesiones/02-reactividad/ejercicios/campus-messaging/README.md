# 💬 Ejercicio: Campus Messaging Reactivo

## 🎯 Objetivo de Aprendizaje
Al completar este ejercicio, serás capaz de:
- Construir un sistema de mensajería completo con Signals
- Implementar comunicación en tiempo real (simulada)
- Gestionar estado complejo con múltiples signals
- Crear interfaces reactivas para conversaciones múltiples

## ⏱️ Duración: 60 minutos

---

## 📚 Parte 1: Visión del Sistema (10 min)

### 🤔 ¿Qué vamos a construir?
Un sistema de mensajería educativo que incluye:
- **Chat en tiempo real** con múltiples conversaciones
- **Indicadores de estado** (escribiendo, visto, entregado)
- **Notificaciones** push reactivas
- **Búsqueda y filtrado** de mensajes
- **Diferentes roles** (estudiante, profesor, admin)

### 🎯 ¿Por qué este ejercicio?
- Integra TODOS los conceptos de la sesión
- Simula un caso real de aplicación educativa
- Demuestra el poder de los Signals en apps complejas
- Prepara para arquitecturas de estado avanzadas

---

## 🛠️ Parte 2: Construcción por Capas (45 min)

### 📦 Paso 1: Setup y Modelos de Datos

### 🔧 Snippets Útiles para este Ejercicio

Para acelerar el desarrollo de este sistema complejo, usa estos snippets de VS Code:
- **`ng20-standalone`**: Componentes standalone base
- **`ng20-signals`**: Signals reactivos avanzados
- **`ng20-service`**: Servicios con signals
- **`ng20-computed`**: Computed signals complejos
- **`ng20-effect`**: Effects para WebSocket y tiempo real
- **`ng20-onpush`**: Componentes optimizados OnPush

💡 **¿Primera vez usando snippets?** Lee la [guía completa](../../../../docs/snippets/como-usar-snippets.md)

#### **Setup del Proyecto:**

**Opción A: VS Code Web + Snippets (Recomendado)**
```bash
# 1. Abrir VS Code Web
https://vscode.dev

# 2. Crear nuevo proyecto Angular
ng new campus-messaging-demo --standalone --style=scss --routing=false
cd campus-messaging-demo

# 3. Copiar snippets del curso
# Descargar: https://github.com/tu-repo/curso-angular-20-avanzado
# Copiar: .vscode/snippets/ al proyecto
```

**Opción B: Local dentro del ejercicio**
```bash
# Desde la carpeta del ejercicio: sesiones/02-reactividad/ejercicios/campus-messaging/
ng new campus-messaging-demo --standalone --style=scss --routing=false
cd campus-messaging-demo
# Los snippets del curso ya están disponibles automáticamente
```

**Archivo:** `src/app/models/messaging.models.ts`

```typescript
// 🎯 Modelos fundamentales del sistema
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string; // ID del mensaje al que responde
}

export interface Conversation {
  id: string;
  name?: string; // Para grupos
  participants: string[]; // IDs de usuarios
  type: 'direct' | 'group' | 'class';
  lastMessage?: Message;
  unreadCount: number;
  isTyping: string[]; // IDs de usuarios escribiendo
  createdAt: Date;
  metadata?: {
    classId?: string;
    subject?: string;
    academic_year?: string;
  };
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  timestamp: Date;
}
```

**💡 Pregunta:** ¿Por qué separamos los modelos en lugar de usar una clase única?

### 🗄️ Paso 2: Servicio Core de Messaging

**Archivo:** `src/app/services/messaging.service.ts`

```typescript
import { Injectable, signal, computed, effect } from '@angular/core';
import { User, Message, Conversation, TypingIndicator } from '../models/messaging.models';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  // 🎯 Estado central con Signals
  private readonly _currentUser = signal<User | null>(null);
  private readonly _users = signal<User[]>([]);
  private readonly _conversations = signal<Conversation[]>([]);
  private readonly _messages = signal<Message[]>([]);
  private readonly _typingIndicators = signal<TypingIndicator[]>([]);
  private readonly _activeConversationId = signal<string | null>(null);

  // 📊 Signals públicos readonly
  readonly currentUser = this._currentUser.asReadonly();
  readonly users = this._users.asReadonly();
  readonly conversations = this._conversations.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly activeConversationId = this._activeConversationId.asReadonly();

  // 🧮 Computed signals para vistas optimizadas
  readonly activeConversation = computed(() => {
    const id = this._activeConversationId();
    return id ? this._conversations().find(c => c.id === id) : null;
  });

  readonly activeMessages = computed(() => {
    const conversationId = this._activeConversationId();
    return conversationId
      ? this._messages().filter(m => m.conversationId === conversationId)
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      : [];
  });

  readonly conversationsWithLastMessage = computed(() => {
    return this._conversations().map(conversation => {
      const messages = this._messages().filter(m => m.conversationId === conversation.id);
      const lastMessage = messages.length > 0
        ? messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
        : undefined;

      return {
        ...conversation,
        lastMessage,
        unreadCount: messages.filter(m =>
          m.senderId !== this._currentUser()?.id && m.status !== 'read'
        ).length
      };
    }).sort((a, b) => {
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime; // Más recientes primero
    });
  });

  readonly totalUnreadCount = computed(() => {
    return this.conversationsWithLastMessage()
      .reduce((total, conv) => total + conv.unreadCount, 0);
  });

  readonly onlineUsers = computed(() => {
    return this._users().filter(user => user.isOnline);
  });

  readonly typingInActiveConversation = computed(() => {
    const conversationId = this._activeConversationId();
    const currentUserId = this._currentUser()?.id;

    if (!conversationId || !currentUserId) return [];

    return this._typingIndicators()
      .filter(indicator =>
        indicator.conversationId === conversationId &&
        indicator.userId !== currentUserId
      )
      .map(indicator => {
        const user = this._users().find(u => u.id === indicator.userId);
        return user?.name || 'Usuario';
      });
  });

  constructor() {
    this.initializeMockData();
    this.setupRealtimeSimulation();
  }

  // 📤 Enviar mensaje
  sendMessage(content: string, type: 'text' | 'image' | 'file' = 'text'): void {
    const currentUser = this._currentUser();
    const conversationId = this._activeConversationId();

    if (!currentUser || !conversationId) return;

    const message: Message = {
      id: this.generateId(),
      conversationId,
      senderId: currentUser.id,
      content,
      type,
      timestamp: new Date(),
      status: 'sending'
    };

    // Optimistic update
    this._messages.update(messages => [...messages, message]);

    // Simular envío
    setTimeout(() => {
      this.updateMessageStatus(message.id, 'sent');

      setTimeout(() => {
        this.updateMessageStatus(message.id, 'delivered');
      }, 500);
    }, 200);

    console.log(`📤 Mensaje enviado: "${content}"`);
  }

  // 💬 Iniciar nueva conversación
  startConversation(participantIds: string[], type: 'direct' | 'group' = 'direct'): string {
    const currentUser = this._currentUser();
    if (!currentUser) return '';

    const conversation: Conversation = {
      id: this.generateId(),
      participants: [currentUser.id, ...participantIds],
      type,
      unreadCount: 0,
      isTyping: [],
      createdAt: new Date()
    };

    this._conversations.update(conversations => [...conversations, conversation]);
    this.setActiveConversation(conversation.id);

    console.log(`💬 Nueva conversación iniciada: ${conversation.id}`);
    return conversation.id;
  }

  // 🎯 Cambiar conversación activa
  setActiveConversation(conversationId: string): void {
    this._activeConversationId.set(conversationId);
    this.markConversationAsRead(conversationId);
    console.log(`🎯 Conversación activa: ${conversationId}`);
  }

  // ⌨️ Indicar que está escribiendo
  startTyping(): void {
    const userId = this._currentUser()?.id;
    const conversationId = this._activeConversationId();

    if (!userId || !conversationId) return;

    const indicator: TypingIndicator = {
      userId,
      conversationId,
      timestamp: new Date()
    };

    this._typingIndicators.update(indicators => {
      // Remover indicador anterior del mismo usuario
      const filtered = indicators.filter(i =>
        !(i.userId === userId && i.conversationId === conversationId)
      );
      return [...filtered, indicator];
    });

    // Auto-remover después de 3 segundos
    setTimeout(() => this.stopTyping(), 3000);
  }

  stopTyping(): void {
    const userId = this._currentUser()?.id;
    const conversationId = this._activeConversationId();

    if (!userId || !conversationId) return;

    this._typingIndicators.update(indicators =>
      indicators.filter(i =>
        !(i.userId === userId && i.conversationId === conversationId)
      )
    );
  }

  // 📖 Marcar conversación como leída
  private markConversationAsRead(conversationId: string): void {
    const currentUserId = this._currentUser()?.id;
    if (!currentUserId) return;

    this._messages.update(messages =>
      messages.map(message => {
        if (message.conversationId === conversationId &&
            message.senderId !== currentUserId &&
            message.status !== 'read') {
          return { ...message, status: 'read' as const };
        }
        return message;
      })
    );
  }

  // 🔄 Actualizar estado de mensaje
  private updateMessageStatus(messageId: string, status: Message['status']): void {
    this._messages.update(messages =>
      messages.map(message =>
        message.id === messageId ? { ...message, status } : message
      )
    );
  }

  // 🎭 Cambiar usuario activo (para simulación)
  switchUser(userId: string): void {
    const user = this._users().find(u => u.id === userId);
    if (user) {
      this._currentUser.set(user);
      this._activeConversationId.set(null); // Reset conversación activa
      console.log(`👤 Usuario cambiado a: ${user.name}`);
    }
  }

  // 🏗️ Inicializar datos de prueba
  private initializeMockData(): void {
    const users: User[] = [
      {
        id: 'user-1',
        name: 'Ana García',
        email: 'ana.garcia@instituto.edu',
        role: 'student',
        isOnline: true,
        lastSeen: new Date()
      },
      {
        id: 'user-2',
        name: 'Prof. Carlos Mendez',
        email: 'carlos.mendez@instituto.edu',
        role: 'teacher',
        isOnline: true,
        lastSeen: new Date()
      },
      {
        id: 'user-3',
        name: 'María López',
        email: 'maria.lopez@instituto.edu',
        role: 'student',
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 min ago
      },
      {
        id: 'user-4',
        name: 'Admin Sistema',
        email: 'admin@instituto.edu',
        role: 'admin',
        isOnline: true,
        lastSeen: new Date()
      }
    ];

    this._users.set(users);
    this._currentUser.set(users[0]); // Ana por defecto

    // Conversaciones iniciales
    const conversations: Conversation[] = [
      {
        id: 'conv-1',
        participants: ['user-1', 'user-2'],
        type: 'direct',
        unreadCount: 0,
        isTyping: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
      },
      {
        id: 'conv-2',
        name: 'Matemáticas 3º ESO',
        participants: ['user-1', 'user-2', 'user-3'],
        type: 'group',
        unreadCount: 0,
        isTyping: [],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
        metadata: {
          classId: 'class-math-3',
          subject: 'Matemáticas',
          academic_year: '2024-25'
        }
      }
    ];

    this._conversations.set(conversations);

    // Mensajes iniciales
    const messages: Message[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        content: 'Hola Ana, ¿cómo va el proyecto de ciencias?',
        type: 'text',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        status: 'read'
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Muy bien profesor, ya tengo casi toda la investigación lista.',
        type: 'text',
        timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 min atrás
        status: 'read'
      },
      {
        id: 'msg-3',
        conversationId: 'conv-2',
        senderId: 'user-2',
        content: 'Recordad que el examen es el viernes. Repasad los ejercicios del tema 4.',
        type: 'text',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
        status: 'delivered'
      }
    ];

    this._messages.set(messages);
  }

  // 🔄 Simular actividad en tiempo real
  private setupRealtimeSimulation(): void {
    // Simular usuarios conectándose/desconectándose
    setInterval(() => {
      this._users.update(users =>
        users.map(user => ({
          ...user,
          isOnline: Math.random() > 0.3, // 70% probabilidad de estar online
          lastSeen: user.isOnline ? new Date() : user.lastSeen
        }))
      );
    }, 10000); // Cada 10 segundos

    // Simular mensajes entrantes ocasionales
    setInterval(() => {
      if (Math.random() > 0.8) { // 20% probabilidad
        this.simulateIncomingMessage();
      }
    }, 15000); // Cada 15 segundos

    // Limpiar indicadores de "escribiendo" antiguos
    setInterval(() => {
      this._typingIndicators.update(indicators =>
        indicators.filter(indicator =>
          Date.now() - indicator.timestamp.getTime() < 5000 // 5 segundos
        )
      );
    }, 1000); // Cada segundo
  }

  // 📨 Simular mensaje entrante
  private simulateIncomingMessage(): void {
    const currentUser = this._currentUser();
    const conversations = this._conversations();
    const users = this._users().filter(u => u.id !== currentUser?.id);

    if (conversations.length === 0 || users.length === 0) return;

    const randomConversation = conversations[Math.floor(Math.random() * conversations.length)];
    const otherParticipants = randomConversation.participants.filter(id => id !== currentUser?.id);
    const randomSender = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];

    const sampleMessages = [
      '¿Has visto el nuevo material que subió el profesor?',
      'Necesito ayuda con el ejercicio 5 📚',
      '¡Excelente trabajo en la presentación! 👏',
      '¿Quedamos para estudiar juntos?',
      'El deadline se acerca, ¿cómo vais? ⏰'
    ];

    const message: Message = {
      id: this.generateId(),
      conversationId: randomConversation.id,
      senderId: randomSender,
      content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      type: 'text',
      timestamp: new Date(),
      status: 'delivered'
    };

    this._messages.update(messages => [...messages, message]);
    console.log(`📨 Mensaje simulado recibido de: ${randomSender}`);
  }

  // 🔧 Utilidades
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 🎨 Paso 3: Componente de Lista de Conversaciones

**Archivo:** `src/app/components/conversation-list/conversation-list.component.ts`

```typescript
@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="conversation-list">
      <header class="list-header">
        <h3>💬 Conversaciones</h3>
        <div class="unread-badge" *ngIf="messagingService.totalUnreadCount() > 0">
          {{ messagingService.totalUnreadCount() }}
        </div>
      </header>

      <div class="search-box">
        <input
          type="text"
          placeholder="🔍 Buscar conversaciones..."
          [(ngModel)]="searchTerm"
          (input)="onSearchChange()"
          class="search-input">
      </div>

      <div class="conversations">
        @for (conversation of filteredConversations(); track conversation.id) {
          <div
            class="conversation-item"
            [class.active]="conversation.id === messagingService.activeConversationId()"
            [class.has-unread]="conversation.unreadCount > 0"
            (click)="selectConversation(conversation.id)">

            <div class="conversation-avatar">
              {{ getConversationIcon(conversation) }}
            </div>

            <div class="conversation-content">
              <div class="conversation-header">
                <span class="conversation-name">
                  {{ getConversationName(conversation) }}
                </span>
                <span class="conversation-time">
                  {{ formatTime(conversation.lastMessage?.timestamp) }}
                </span>
              </div>

              <div class="conversation-preview">
                @if (conversation.lastMessage) {
                  <span class="last-message">
                    {{ getMessagePreview(conversation.lastMessage) }}
                  </span>
                } @else {
                  <span class="no-messages">No hay mensajes</span>
                }

                @if (conversation.unreadCount > 0) {
                  <span class="unread-count">{{ conversation.unreadCount }}</span>
                }
              </div>

              <!-- Indicador de "escribiendo" -->
              @if (isTypingInConversation(conversation.id)) {
                <div class="typing-indicator">
                  <span class="typing-text">{{ getTypingText(conversation.id) }}</span>
                  <div class="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              }
            </div>
          </div>
        } @empty {
          <div class="no-conversations">
            <p>No hay conversaciones</p>
            <button (click)="startNewConversation()" class="btn-new-chat">
              💬 Iniciar Chat
            </button>
          </div>
        }
      </div>

      <div class="online-users">
        <h4>👥 Usuarios Online ({{ messagingService.onlineUsers().length }})</h4>
        <div class="user-list">
          @for (user of messagingService.onlineUsers(); track user.id) {
            @if (user.id !== messagingService.currentUser()?.id) {
              <div
                class="online-user"
                (click)="startDirectConversation(user.id)"
                title="Iniciar chat con {{ user.name }}">
                <span class="user-avatar">{{ getUserIcon(user.role) }}</span>
                <span class="user-name">{{ user.name }}</span>
                <span class="online-dot"></span>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conversation-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      background: white;
    }

    .unread-badge {
      background: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 4px 8px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .search-box {
      padding: 15px;
      background: white;
      border-bottom: 1px solid #eee;
    }

    .search-input {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 20px;
      outline: none;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      border-color: #007bff;
    }

    .conversations {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-item {
      display: flex;
      padding: 15px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.2s;
      background: white;
    }

    .conversation-item:hover {
      background: #f5f5f5;
    }

    .conversation-item.active {
      background: #e3f2fd;
      border-left: 4px solid #007bff;
    }

    .conversation-item.has-unread {
      background: #fff3cd;
    }

    .conversation-avatar {
      font-size: 1.5rem;
      margin-right: 12px;
      display: flex;
      align-items: center;
    }

    .conversation-content {
      flex: 1;
      min-width: 0;
    }

    .conversation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }

    .conversation-name {
      font-weight: 600;
      color: #333;
      truncate;
    }

    .conversation-time {
      font-size: 0.8rem;
      color: #666;
    }

    .conversation-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .last-message {
      color: #666;
      font-size: 0.9rem;
      truncate;
      max-width: 200px;
    }

    .no-messages {
      color: #999;
      font-style: italic;
      font-size: 0.9rem;
    }

    .unread-count {
      background: #007bff;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 5px;
    }

    .typing-text {
      font-size: 0.8rem;
      color: #007bff;
      font-style: italic;
    }

    .typing-dots {
      display: flex;
      gap: 2px;
    }

    .typing-dots span {
      width: 4px;
      height: 4px;
      background: #007bff;
      border-radius: 50%;
      animation: typing 1.4s infinite both;
    }

    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    .online-users {
      border-top: 1px solid #ddd;
      background: white;
      padding: 15px;
    }

    .online-user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .online-user:hover {
      background: #f0f0f0;
    }

    .user-name {
      flex: 1;
      font-size: 0.9rem;
    }

    .online-dot {
      width: 8px;
      height: 8px;
      background: #28a745;
      border-radius: 50%;
    }

    .no-conversations {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .btn-new-chat {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 15px;
    }
  `]
})
export class ConversationListComponent {
  readonly messagingService = inject(MessagingService);

  readonly searchTerm = signal('');

  readonly filteredConversations = computed(() => {
    const conversations = this.messagingService.conversationsWithLastMessage();
    const term = this.searchTerm().toLowerCase();

    if (!term) return conversations;

    return conversations.filter(conv =>
      this.getConversationName(conv).toLowerCase().includes(term) ||
      conv.lastMessage?.content.toLowerCase().includes(term)
    );
  });

  onSearchChange(): void {
    // La reactividad es automática con el signal
  }

  selectConversation(conversationId: string): void {
    this.messagingService.setActiveConversation(conversationId);
  }

  getConversationName(conversation: any): string {
    if (conversation.name) return conversation.name;

    const currentUserId = this.messagingService.currentUser()?.id;
    const otherParticipants = conversation.participants.filter((id: string) => id !== currentUserId);
    const users = this.messagingService.users();

    return otherParticipants
      .map((id: string) => users.find(u => u.id === id)?.name || 'Usuario')
      .join(', ');
  }

  getConversationIcon(conversation: any): string {
    return conversation.type === 'group' ? '👥' : '💬';
  }

  getMessagePreview(message: any): string {
    if (message.type === 'text') {
      return message.content.length > 50
        ? message.content.substring(0, 50) + '...'
        : message.content;
    }
    return `📎 ${message.type}`;
  }

  formatTime(timestamp?: Date): string {
    if (!timestamp) return '';

    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  getUserIcon(role: string): string {
    const icons = {
      student: '👨‍🎓',
      teacher: '👨‍🏫',
      admin: '👑'
    };
    return icons[role as keyof typeof icons] || '👤';
  }

  isTypingInConversation(conversationId: string): boolean {
    return this.messagingService.typingInActiveConversation().length > 0 &&
           conversationId === this.messagingService.activeConversationId();
  }

  getTypingText(conversationId: string): string {
    const typing = this.messagingService.typingInActiveConversation();
    if (typing.length === 0) return '';
    if (typing.length === 1) return `${typing[0]} está escribiendo...`;
    return `${typing.length} personas están escribiendo...`;
  }

  startDirectConversation(userId: string): void {
    this.messagingService.startConversation([userId], 'direct');
  }

  startNewConversation(): void {
    // En una app real, esto abriría un modal de selección de usuarios
    console.log('🆕 Iniciar nueva conversación');
  }
}
```

### 💬 Paso 4: Componente de Ventana de Chat

Por razones de espacio, aquí está la estructura simplificada:

```typescript
@Component({
  selector: 'app-chat-window',
  template: `
    <div class="chat-window">
      <!-- Header con info de conversación -->
      <header class="chat-header">
        <h3>{{ getConversationTitle() }}</h3>
        <div class="participants-status">
          {{ getParticipantsStatus() }}
        </div>
      </header>

      <!-- Lista de mensajes -->
      <div class="messages-container" #messagesContainer>
        @for (message of messagingService.activeMessages(); track message.id) {
          <div class="message" [class.own]="isOwnMessage(message)">
            <!-- Contenido del mensaje con timestamp y status -->
          </div>
        }

        <!-- Indicador de "escribiendo" -->
        @if (messagingService.typingInActiveConversation().length > 0) {
          <div class="typing-indicator">
            {{ getTypingIndicator() }}
          </div>
        }
      </div>

      <!-- Composer de mensajes -->
      <div class="message-composer">
        <input
          type="text"
          [(ngModel)]="messageText"
          (keydown.enter)="sendMessage()"
          (input)="onTyping()"
          placeholder="Escribe un mensaje..."
          class="message-input">
        <button (click)="sendMessage()" [disabled]="!messageText.trim()">
          📤
        </button>
      </div>
    </div>
  `
})
export class ChatWindowComponent {
  readonly messagingService = inject(MessagingService);
  readonly messageText = signal('');

  // Métodos para gestión de mensajes y estado
}
```

### 🎮 Paso 5: App Principal Integrada

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div class="messaging-app">
      <aside class="sidebar">
        <div class="user-switcher">
          <select (change)="switchUser($event)" [value]="messagingService.currentUser()?.id">
            @for (user of messagingService.users(); track user.id) {
              <option [value]="user.id">
                {{ getUserDisplay(user) }}
              </option>
            }
          </select>
        </div>
        <app-conversation-list></app-conversation-list>
      </aside>

      <main class="chat-area">
        @if (messagingService.activeConversation()) {
          <app-chat-window></app-chat-window>
        } @else {
          <div class="welcome-screen">
            <h2>💬 Bienvenido al Campus Messaging</h2>
            <p>Selecciona una conversación para empezar a chatear</p>
          </div>
        }
      </main>
    </div>
  `
})
export class AppComponent {
  readonly messagingService = inject(MessagingService);

  switchUser(event: any): void {
    this.messagingService.switchUser(event.target.value);
  }
}
```

---

## 🧪 Parte 3: Experimentación Avanzada (5 min)

### 🔬 Experimento 1: Multi-Usuario en Tiempo Real
1. **Cambia entre usuarios** diferentes
2. **Envía mensajes** desde cada usuario
3. **Observa** cómo aparecen en otras cuentas

### 🔬 Experimento 2: Estados de Mensaje
1. **Envía un mensaje** y observa "enviando" → "entregado"
2. **Simula** diferentes estados de conexión
3. **Verifica** indicadores visuales

### 🔬 Experimento 3: Búsqueda y Filtrado
1. **Busca** por contenido de mensajes
2. **Filtra** conversaciones por nombre
3. **Observa** resultados en tiempo real

---

## ❓ Preguntas de Comprensión Avanzada

1. **¿Cómo maneja este sistema el estado complejo?**
   - Múltiples signals especializados
   - Computed signals para vistas derivadas
   - Effects para sincronización

2. **¿Qué optimizaciones de rendimiento usa?**
   - OnPush en todos los componentes
   - Computed signals para cálculos caros
   - Immutable updates con signal.update()

3. **¿Cómo simula tiempo real sin WebSockets?**
   - setInterval para polling simulado
   - Effects para propagación de cambios
   - Estado central reactivo

---

## 🎯 Desafíos Master

### Desafío 1: Implementar WebSockets Reales
- Conectar con Socket.IO
- Mantener la misma arquitectura de Signals
- Agregar reconnection logic

### Desafío 2: Persistencia Local
- Usar IndexedDB para mensajes
- Sincronización online/offline
- Cache inteligente con Service Workers

### Desafío 3: Características Avanzadas
- Reacciones a mensajes (👍❤️😂)
- Mensajes de voz/video
- Compartir archivos con drag & drop

---

## ✅ Checklist Master

- [ ] Comprendo arquitectura de estado complejo con Signals
- [ ] Puedo simular tiempo real con effects
- [ ] Manejo múltiples vistas reactivas sincronizadas
- [ ] Optimizo rendimiento en aplicaciones grandes
- [ ] Integro todos los conceptos de la sesión

---

## 🏁 Conclusión Avanzada

**Has dominado:**
- ✅ Signals para estado complejo
- ✅ Computed signals para vistas optimizadas
- ✅ Effects para sincronización
- ✅ Arquitectura escalable y reactiva

**Próximo nivel:** Aplicar estos patrones en aplicaciones empresariales reales

¡Felicidades! 🎉 Has completado la masterclass de Reactividad Avanzada con Angular 20.
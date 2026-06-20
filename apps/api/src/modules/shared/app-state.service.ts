import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

type SystemStatus = 'todo-bien' | 'atencion-requerida' | 'recuperando';

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  locale: string;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

@Injectable()
export class AppStateService {
  private user: StoredUser = {
    id: 'user_denise_001',
    fullName: 'Denise Vargas',
    email: 'dvasesorasjuridicas@gmail.com',
    phone: '+584149024086',
    passwordHash: 'demo-hash',
    locale: 'es-VE'
  };

  private status: SystemStatus = 'todo-bien';
  private readonly pushTokens = new Map<string, string[]>();

  private readonly activities = [
    {
      id: 'a1',
      title: 'Inicio de sesión seguro',
      detail: 'Denise entró al sistema desde su teléfono principal.',
      time: 'Hace 5 min'
    },
    {
      id: 'a2',
      title: 'Auditoría completada',
      detail: 'Documento revisado sin hallazgos críticos.',
      time: 'Hace 22 min'
    },
    {
      id: 'a3',
      title: 'Pago conciliado',
      detail: 'Se confirmó un ingreso de BRL 12,500.',
      time: 'Hoy'
    }
  ];

  private readonly audits = [
    {
      id: 'd1',
      name: 'Contrato de proveedor',
      status: 'aprobado',
      summary: 'No se detectaron riesgos relevantes.'
    },
    {
      id: 'd2',
      name: 'Acuerdo de comisión',
      status: 'revision',
      summary: 'Falta confirmar una cláusula de pago.'
    },
    {
      id: 'd3',
      name: 'Carta de autorización',
      status: 'alerta',
      summary: 'Hay una fecha inconsistente en dos páginas.'
    }
  ];

  private readonly payments = [
    { id: 'p1', label: 'Ingreso de ventas', amount: 12500, type: 'ingreso', date: 'Hoy' },
    { id: 'p2', label: 'Servicio de nube', amount: 210, type: 'gasto', date: 'Ayer' },
    { id: 'p3', label: 'Honorarios legales', amount: 780, type: 'gasto', date: 'Ayer' }
  ];

  private readonly notifications: NotificationItem[] = [
    {
      id: 'n1',
      title: 'Bienvenida',
      body: 'Hola Denise, tu sistema VenBraX está activo y listo.',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];

  constructor(private readonly config: ConfigService) {
    const seededToken = this.config.get<string>('DENISE_FCM_TOKEN');
    if (seededToken) {
      this.pushTokens.set(this.user.id, [seededToken]);
    }
  }

  getUser() {
    const { passwordHash, ...user } = this.user;
    return user;
  }

  getUserById(userId: string) {
    return userId === this.user.id ? this.getUser() : null;
  }

  upsertUser(profile: Pick<StoredUser, 'fullName' | 'email' | 'phone' | 'locale'>) {
    this.user = { ...this.user, ...profile };
    return this.getUser();
  }

  getDeniseContact() {
    return {
      userId: this.user.id,
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone
    };
  }

  addPushToken(userId: string, token: string) {
    const tokens = this.pushTokens.get(userId) ?? [];
    if (!tokens.includes(token)) {
      tokens.push(token);
    }
    this.pushTokens.set(userId, tokens);
  }

  getPushTokensForUser(userId: string) {
    return this.pushTokens.get(userId) ?? [];
  }

  getDashboard() {
    return {
      health: this.status,
      metrics: {
        revenueToday: 12500,
        expensesToday: 990,
        auditsReviewed: this.audits.length,
        activitiesToday: this.activities.length
      },
      activities: this.activities,
      audits: this.audits,
      payments: this.payments,
      notifications: this.notifications
    };
  }

  getStatus() {
    return this.status;
  }

  setStatus(status: SystemStatus) {
    this.status = status;
    this.notifications.unshift({
      id: `n-${Date.now()}`,
      title: status === 'todo-bien' ? 'Sistema estable' : 'Atención automática en curso',
      body:
        status === 'todo-bien'
          ? 'Todo está funcionando bien. No necesitas hacer nada.'
          : 'El sistema detectó un inconveniente y lo está resolviendo solo. No necesitas hacer nada, Denise.',
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  getActivities() {
    return this.activities;
  }

  getAudits() {
    return this.audits;
  }

  getPayments() {
    return this.payments;
  }

  getNotifications() {
    return this.notifications;
  }

  markNotificationRead(id: string) {
    const notification = this.notifications.find((item) => item.id === id);
    if (notification) {
      notification.read = true;
    }
    return notification ?? null;
  }
}

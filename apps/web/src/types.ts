export type StepId = 'welcome' | 'profile' | 'credentials' | 'biometric' | 'home';

export type SystemHealth = 'todo-bien' | 'atencion-requerida' | 'recuperando';

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

export interface AuditItem {
  id: string;
  name: string;
  status: 'aprobado' | 'revision' | 'alerta';
  summary: string;
}

export interface PaymentItem {
  id: string;
  label: string;
  amount: number;
  type: 'ingreso' | 'gasto';
  date: string;
}

export interface AppUser {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  locale: string;
}

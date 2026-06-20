import type { ActivityItem, AuditItem, PaymentItem } from './types';

export const defaultActivities: ActivityItem[] = [
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

export const defaultAudits: AuditItem[] = [
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

export const defaultPayments: PaymentItem[] = [
  { id: 'p1', label: 'Ingreso de ventas', amount: 12500, type: 'ingreso', date: 'Hoy' },
  { id: 'p2', label: 'Servicio de nube', amount: 210, type: 'gasto', date: 'Ayer' },
  { id: 'p3', label: 'Honorarios legales', amount: 780, type: 'gasto', date: 'Ayer' }
];

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { AppStateService } from '../shared/app-state.service';
import type { ChannelResult, NotificationContext, PushResult } from './notification.types';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private firebaseReady = false;

  constructor(
    private readonly config: ConfigService,
    private readonly appState: AppStateService
  ) {
    this.bootstrapFirebase();
  }

  async sendPush(userId: string, title: string, message: string): Promise<PushResult> {
    const tokens = this.appState.getPushTokensForUser(userId);
    if (!tokens.length) {
      this.logger.warn(`No FCM tokens configured for user ${userId}.`);
      return { sent: false, successCount: 0, failureCount: 0 };
    }

    if (!this.firebaseReady) {
      this.logger.warn('Firebase not configured. Skipping push notification.');
      return { sent: false, successCount: 0, failureCount: 0 };
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body: message },
      data: { userId, title, message }
    });

    return {
      sent: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  }

  async sendWhatsApp(phone: string, message: string): Promise<ChannelResult> {
    const token = this.config.get<string>('WHATSAPP_API_TOKEN');
    const phoneId = this.config.get<string>('WHATSAPP_PHONE_ID');

    if (!token || !phoneId) {
      this.logger.warn('WhatsApp Business API not configured. Skipping WhatsApp notification.');
      return { sent: false };
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace(/\D/g, ''),
        type: 'text',
        text: { body: message }
      })
    });

    if (!response.ok) {
      this.logger.warn(`WhatsApp failed: ${response.status} ${await response.text()}`);
      return { sent: false };
    }

    return { sent: true };
  }

  async notifyCriticalFailure(context: NotificationContext): Promise<{ push: PushResult; whatsapp: ChannelResult }> {
    const contact = this.appState.getDeniseContact();
    const userId = context.userId ?? contact.userId;
    const phone = context.phone ?? contact.phone;
    const message =
      'Hola Denise, detectamos un inconveniente en el sistema. Ya estamos resolviéndolo automáticamente. No necesitas hacer nada por ahora.';

    this.appState.setStatus('recuperando');
    const [push, whatsapp] = await Promise.all([
      this.sendPush(userId, 'Atención automática en curso', message),
      this.sendWhatsApp(phone, message)
    ]);

    return { push, whatsapp };
  }

  async notifyRecovery(context: NotificationContext): Promise<{ push: PushResult; whatsapp: ChannelResult }> {
    const contact = this.appState.getDeniseContact();
    const userId = context.userId ?? contact.userId;
    const phone = context.phone ?? contact.phone;
    const message = 'Hola Denise, todo está funcionando bien nuevamente. El sistema se recuperó solo.';

    this.appState.setStatus('todo-bien');
    const [push, whatsapp] = await Promise.all([
      this.sendPush(userId, 'Todo está bien nuevamente', message),
      this.sendWhatsApp(phone, message)
    ]);

    return { push, whatsapp };
  }

  async sendWelcome(recipient: { fullName: string; email: string; phone: string }) {
    const emailSent = await this.sendEmail(recipient);
    const whatsappSent = await this.sendWhatsApp(
      recipient.phone,
      'Tu app VenBraX ya está lista. Ya puedes ir a tu bandeja de entrada para empezar a utilizar la app.'
    );

    return { emailSent, whatsappSent };
  }

  private bootstrapFirebase() {
    const serviceAccountJson = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (!serviceAccountJson) {
      this.logger.warn('Firebase service account not configured. Push will remain disabled.');
      return;
    }

    try {
      if (admin.apps.length === 0) {
        const serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      }
      this.firebaseReady = true;
    } catch (error) {
      this.logger.warn(`Firebase bootstrap failed: ${(error as Error).message}`);
    }
  }

  private async sendEmail(recipient: { fullName: string; email: string; phone: string }) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const from = this.config.get<string>('MAIL_FROM');

    if (!host || !user || !pass || !from) {
      this.logger.warn('SMTP not configured. Skipping welcome email.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(this.config.get<string>('SMTP_PORT') ?? 587),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: { user, pass }
    });

    await transporter.sendMail({
      from,
      to: recipient.email,
      subject: 'Bienvenida a tu app VenBraX',
      text: 'Tu app VenBraX ya está lista. Puedes ir a tu bandeja de entrada para empezar a utilizarla.',
      html:
        `<p>Hola ${recipient.fullName},</p>` +
        '<p>Tu app VenBraX ya está lista.</p>' +
        '<p>Puedes ir a tu bandeja de entrada para empezar a utilizarla.</p>'
    });

    return true;
  }
}

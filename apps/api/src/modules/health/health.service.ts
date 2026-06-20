import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class HealthService implements OnModuleInit {
  private startedAt = new Date().toISOString();
  private failureCount = 0;

  constructor(private readonly notifications: NotificationService) {}

  onModuleInit() {
    setInterval(() => void this.check(), 60_000);
  }

  status() {
    return {
      ok: true,
      service: 'venbrax-api',
      status: 'todo-bien',
      startedAt: this.startedAt,
      failureCount: this.failureCount
    };
  }

  async check() {
    if (this.failureCount > 0) {
      await this.notifications.notifyRecovery({ module: 'health' });
      this.failureCount = 0;
    }
    return this.status();
  }
}

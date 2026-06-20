import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../notifications/notification.service';
import { AppStateService } from '../shared/app-state.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly appState: AppStateService,
    private readonly notifications: NotificationService
  ) {}

  @Post('status')
  async setStatus(@Body() body: { status: 'todo-bien' | 'atencion-requerida' | 'recuperando'; reason?: string }) {
    this.appState.setStatus(body.status);

    if (body.status === 'recuperando' || body.status === 'atencion-requerida') {
      await this.notifications.notifyCriticalFailure({ reason: body.reason });
    }

    if (body.status === 'todo-bien') {
      await this.notifications.notifyRecovery({ reason: body.reason });
    }

    return { ok: true, status: body.status };
  }
}

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppStateService } from '../shared/app-state.service';

@Controller()
export class NotificationsController {
  constructor(private readonly appState: AppStateService) {}

  @Get('notifications')
  listNotifications(): any[] {
    return this.appState.getNotifications();
  }

  @Patch('notifications/:id/read')
  markRead(@Param('id') id: string): any {
    return this.appState.markNotificationRead(id);
  }

  @Post('fcm/token')
  registerFcmToken(@Body() body: { userId?: string; token: string }) {
    const contact = this.appState.getDeniseContact();
    this.appState.addPushToken(body.userId ?? contact.userId, body.token);
    return { ok: true };
  }
}

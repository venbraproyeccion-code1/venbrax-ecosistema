import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { SharedModule } from '../shared/shared.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [SharedModule],
  controllers: [NotificationsController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationsModule {}

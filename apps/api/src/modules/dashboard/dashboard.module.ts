import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [DashboardController],
  exports: []
})
export class DashboardModule {}

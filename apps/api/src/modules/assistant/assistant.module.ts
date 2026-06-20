import { Module } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AssistantController]
})
export class AssistantModule {}

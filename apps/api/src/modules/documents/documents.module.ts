import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [DocumentsController],
  providers: []
})
export class DocumentsModule {}

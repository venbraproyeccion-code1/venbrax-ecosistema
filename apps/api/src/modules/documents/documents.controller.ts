import { Controller, Get } from '@nestjs/common';
import { AppStateService } from '../shared/app-state.service';

@Controller('audits')
export class DocumentsController {
  constructor(private readonly appState: AppStateService) {}

  @Get()
  listAudits(): any[] {
    return this.appState.getAudits();
  }
}

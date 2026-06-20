import { Controller, Get } from '@nestjs/common';
import { AppStateService } from '../shared/app-state.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly appState: AppStateService) {}

  @Get()
  getDashboard(): Record<string, unknown> {
    return this.appState.getDashboard();
  }
}

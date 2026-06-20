import { Controller, Get } from '@nestjs/common';
import { AppStateService } from '../shared/app-state.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly appState: AppStateService) {}

  @Get()
  listPayments(): any[] {
    return this.appState.getPayments();
  }
}

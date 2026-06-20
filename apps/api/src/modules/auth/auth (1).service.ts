import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AppStateService } from '../shared/app-state.service';

@Injectable()
export class AuthService {
  constructor(private readonly appState: AppStateService) {}

  register(dto: RegisterDto) {
    this.appState.setStatus('todo-bien');
    return {
      ok: true,
      phase: '0',
      next: 'persist-user-and-device',
      user: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone
      }
    };
  }

  login(dto: LoginDto) {
    return {
      ok: true,
      phase: '0',
      next: 'issue-session',
      email: dto.email
    };
  }

  me() {
    return {
      ok: true,
      phase: '0',
      user: this.appState.getUser()
    };
  }
}

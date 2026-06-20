import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NotificationService } from '../notifications/notification.service';
import { AppStateService } from '../shared/app-state.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { WebAuthnFinishDto } from './dto/webauthn-finish.dto';
import { WebAuthnStartDto } from './dto/webauthn-start.dto';

interface WebAuthnChallenge {
  id: string;
  userId: string;
  challenge: string;
  expiresAt: string;
}

@Injectable()
export class AuthService {
  private readonly challenges = new Map<string, WebAuthnChallenge>();

  constructor(
    private readonly appState: AppStateService,
    private readonly notifications: NotificationService
  ) {}

  register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const user = this.appState.upsertUser({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      locale: 'es-VE'
    });

    this.appState.setStatus('todo-bien');

    return {
      ok: true,
      phase: '0',
      next: 'persist-user-and-device',
      user
    };
  }

  login(dto: LoginDto) {
    void dto.password;
    return {
      ok: true,
      phase: '0',
      next: 'issue-session',
      email: dto.email
    };
  }

  async welcome(recipient: RegisterDto) {
    return this.notifications.sendWelcome({
      fullName: recipient.fullName,
      email: recipient.email,
      phone: recipient.phone
    });
  }

  startWebAuthn(dto: WebAuthnStartDto) {
    const user = dto.userId ? this.appState.getUserById(dto.userId) : this.appState.getUser();
    if (!user) {
      throw new BadRequestException('La usuaria no existe.');
    }

    const challenge: WebAuthnChallenge = {
      id: randomUUID(),
      userId: user.id,
      challenge: randomUUID(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };

    this.challenges.set(challenge.id, challenge);

    return {
      ok: true,
      challengeId: challenge.id,
      challenge: challenge.challenge,
      expiresAt: challenge.expiresAt,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    };
  }

  finishWebAuthn(dto: WebAuthnFinishDto) {
    const challenge = this.challenges.get(dto.challengeId);
    if (!challenge) {
      throw new BadRequestException('El reto de autenticación no existe.');
    }

    if (Date.parse(challenge.expiresAt) < Date.now()) {
      this.challenges.delete(dto.challengeId);
      throw new BadRequestException('El reto de autenticación expiró.');
    }

    if (!dto.assertion.trim()) {
      throw new BadRequestException('La verificación biométrica falló.');
    }

    this.challenges.delete(dto.challengeId);

    return {
      ok: true,
      verified: true,
      userId: challenge.userId
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

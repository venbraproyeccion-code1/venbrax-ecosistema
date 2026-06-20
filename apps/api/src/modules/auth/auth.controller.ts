import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { WebAuthnStartDto } from './dto/webauthn-start.dto';
import { WebAuthnFinishDto } from './dto/webauthn-finish.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = this.authService.register(dto);
    const notifications = await this.authService.welcome(dto);
    return { ...result, notifications };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('webauthn/start')
  startWebAuthn(@Body() dto: WebAuthnStartDto) {
    return this.authService.startWebAuthn(dto);
  }

  @Post('webauthn/finish')
  finishWebAuthn(@Body() dto: WebAuthnFinishDto) {
    return this.authService.finishWebAuthn(dto);
  }

  @Get('me')
  me() {
    return this.authService.me();
  }
}

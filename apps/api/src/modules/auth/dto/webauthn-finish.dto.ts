import { IsString } from 'class-validator';

export class WebAuthnFinishDto {
  @IsString()
  challengeId!: string;

  @IsString()
  assertion!: string;
}

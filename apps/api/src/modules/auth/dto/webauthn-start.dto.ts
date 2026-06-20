import { IsOptional, IsString } from 'class-validator';

export class WebAuthnStartDto {
  @IsOptional()
  @IsString()
  userId?: string;
}

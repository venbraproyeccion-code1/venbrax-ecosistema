import { Body, Controller, Post } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';

class AssistantDto {
  @IsString()
  @MinLength(1)
  message!: string;
}

@Controller('assistant')
export class AssistantController {
  @Post()
  chat(@Body() dto: AssistantDto) {
    const text = (dto.message ?? '').toLowerCase();

    if (text.includes('no entiendo') || text.includes('qué significa') || text.includes('que significa')) {
      return {
        reply:
          'Te lo explico sencillo: es una alerta o una acción del sistema traducida a palabras normales.'
      };
    }

    if (text.includes('fall') || text.includes('error')) {
      return {
        reply: 'Todo está bien, el sistema se está recuperando solo. No necesitas hacer nada.'
      };
    }

    return {
      reply: 'Entendido. Te ayudo con eso de forma simple y sin tecnicismos.'
    };
  }
}

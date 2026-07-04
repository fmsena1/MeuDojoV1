import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    // Apenas valida o corpo da requisição (body)
    if (metadata.type !== 'body') {
      return value;
    }
    try {
      return this.schema.parse(value);
    } catch (error: any) {
      throw new BadRequestException({
        message: 'Falha na validação dos dados de entrada',
        errors: error.errors,
      });
    }
  }
}

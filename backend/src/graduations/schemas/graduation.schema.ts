import { z } from 'zod';

export const createGraduationSchema = z.object({
  martialArtId: z.string().uuid('ID da modalidade inválido'),
  name: z.string().min(1, 'O nome da faixa é obrigatório'),
  order: z.number().int().min(0).default(0),
  color: z.string().optional().nullable(),
});

export const updateGraduationSchema = createGraduationSchema
  .omit({ martialArtId: true })
  .partial();

export class CreateGraduationDto {
  martialArtId!: string;
  name!: string;
  order!: number;
  color?: string | null;
}

export class UpdateGraduationDto {
  name?: string;
  order?: number;
  color?: string | null;
}

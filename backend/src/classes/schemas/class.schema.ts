import { z } from 'zod';

export const classScheduleSchema = z.object({
  dayOfWeek: z
    .number()
    .int()
    .min(0)
    .max(6, 'Dia da semana deve ser de 0 (Domingo) a 6 (Sábado)'),
  startTime: z
    .string()
    .regex(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Horário de início inválido (HH:MM)',
    ),
  endTime: z
    .string()
    .regex(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Horário de término inválido (HH:MM)',
    ),
});

export const createClassSchema = z.object({
  name: z.string().min(2, 'O nome da turma deve ter pelo menos 2 caracteres'),
  description: z.string().optional().nullable(),
  martialArtId: z.string().uuid('ID da modalidade inválido'),
  teacherId: z.string().uuid('ID do professor inválido'),
  schedules: z
    .array(classScheduleSchema)
    .min(1, 'A turma deve ter pelo menos um horário definido'),
});

export const updateClassSchema = createClassSchema.partial();

export class ClassScheduleDto {
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
}

export class CreateClassDto {
  name!: string;
  description?: string | null;
  martialArtId!: string;
  teacherId!: string;
  schedules!: ClassScheduleDto[];
}

export class UpdateClassDto {
  name?: string;
  description?: string | null;
  martialArtId?: string;
  teacherId?: string;
  schedules?: ClassScheduleDto[];
}

import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  studentId: z.string().uuid('ID do aluno inválido'),
  classId: z.string().uuid('ID da turma inválido'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export class CreateEnrollmentDto {
  studentId!: string;
  classId!: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export class UpdateEnrollmentDto {
  status!: 'ACTIVE' | 'INACTIVE';
}

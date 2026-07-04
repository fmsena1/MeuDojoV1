import { z } from 'zod';

export const attendanceRecordSchema = z.object({
  studentId: z.string().uuid('ID do aluno inválido'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
  notes: z.string().optional().nullable(),
});

export const bulkCreateAttendanceSchema = z.object({
  classId: z.string().uuid('ID da turma inválido'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato AAAA-MM-DD'),
  records: z
    .array(attendanceRecordSchema)
    .min(1, 'Pelo menos um registro de presença deve ser enviado'),
});

export class AttendanceRecordDto {
  studentId!: string;
  status!: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
  notes?: string | null;
}

export class BulkCreateAttendanceDto {
  classId!: string;
  date!: string; // AAAA-MM-DD
  records!: AttendanceRecordDto[];
}

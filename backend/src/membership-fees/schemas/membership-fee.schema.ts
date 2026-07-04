import { z } from 'zod';

export const createMembershipFeeSchema = z.object({
  studentId: z.string().uuid('ID do aluno inválido'),
  amount: z.number().positive('O valor deve ser maior que zero'),
  dueDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'A data de vencimento deve estar no formato AAAA-MM-DD',
    ),
  notes: z.string().optional().nullable(),
});

export const bulkGenerateMembershipFeesSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive('O valor padrão deve ser maior que zero'),
  dueDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'A data de vencimento deve estar no formato AAAA-MM-DD',
    ),
});

export const payMembershipFeeSchema = z.object({
  paidAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'A data de pagamento deve estar no formato AAAA-MM-DD',
    )
    .optional()
    .nullable(),
});

export class CreateMembershipFeeDto {
  studentId!: string;
  amount!: number;
  dueDate!: string;
  notes?: string | null;
}

export class BulkGenerateMembershipFeesDto {
  month!: number;
  year!: number;
  amount!: number;
  dueDate!: string;
}

export class PayMembershipFeeDto {
  paidAt?: string | null;
}

import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['REVENUE', 'EXPENSE']),
  category: z.string().min(2, 'A categoria é obrigatória'),
  amount: z.number().positive('O valor deve ser maior que zero'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato AAAA-MM-DD'),
  description: z
    .string()
    .min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

export class CreateTransactionDto {
  type!: 'REVENUE' | 'EXPENSE';
  category!: string;
  amount!: number;
  date!: string;
  description!: string;
}

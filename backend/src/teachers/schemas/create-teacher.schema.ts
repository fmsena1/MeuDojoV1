import { z } from 'zod';

export const createTeacherSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  birthDate: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? new Date(val) : val),
    z.date().optional().nullable(),
  ),
  gender: z.string().optional().nullable(),
  rg: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),

  // Campos específicos do professor
  bio: z.string().optional().nullable(),
  specialties: z.string().optional().nullable(),
  graduation: z.string().optional().nullable(),
  status: z.string().default('ACTIVE'),

  // Acesso opcional do usuário
  createUserAccess: z.boolean().default(false),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .optional()
    .nullable(),
});

export class CreateTeacherDto {
  name!: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: Date | null;
  gender?: string | null;
  rg?: string | null;
  cpf?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  bio?: string | null;
  specialties?: string | null;
  graduation?: string | null;
  status?: string;
  createUserAccess?: boolean;
  password?: string | null;
}

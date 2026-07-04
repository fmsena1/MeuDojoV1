import { z } from 'zod';

export const registerTenantSchema = z.object({
  academyName: z
    .string()
    .min(3, 'O nome da academia deve ter pelo menos 3 caracteres'),
  adminName: z
    .string()
    .min(2, 'O nome do administrador deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export class RegisterTenantDto {
  academyName!: string;
  adminName!: string;
  email!: string;
  password!: string;
}

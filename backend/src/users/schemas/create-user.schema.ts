import { z } from 'zod';
import { Role } from '@prisma/client';

export const createInternalUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.nativeEnum(Role, { message: 'Cargo (Role) inválido' }),
});

export class CreateInternalUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: Role;
}

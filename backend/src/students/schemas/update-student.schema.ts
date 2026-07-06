import { z } from 'zod';
import { createStudentSchema } from './create-student.schema';

export const updateStudentSchema = createStudentSchema.partial();

export class UpdateStudentDto {
  name?: string;
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
  status?: string;
  monthlyFee?: number;
  createUserAccess?: boolean;
  password?: string | null;
}

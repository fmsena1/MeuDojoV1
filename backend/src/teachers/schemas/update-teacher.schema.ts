import { z } from 'zod';
import { createTeacherSchema } from './create-teacher.schema';

export const updateTeacherSchema = createTeacherSchema.partial();

export class UpdateTeacherDto {
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
  bio?: string | null;
  specialties?: string | null;
  graduation?: string | null;
  status?: string;
  createUserAccess?: boolean;
  password?: string | null;
}

import { z } from 'zod';

export const createMartialArtSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional().nullable(),
});

export const updateMartialArtSchema = createMartialArtSchema.partial();

export class CreateMartialArtDto {
  name!: string;
  description?: string | null;
}

export class UpdateMartialArtDto {
  name?: string;
  description?: string | null;
}

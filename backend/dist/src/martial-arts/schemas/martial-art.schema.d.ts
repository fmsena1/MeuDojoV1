import { z } from 'zod';
export declare const createMartialArtSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateMartialArtSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare class CreateMartialArtDto {
    name: string;
    description?: string | null;
}
export declare class UpdateMartialArtDto {
    name?: string;
    description?: string | null;
}

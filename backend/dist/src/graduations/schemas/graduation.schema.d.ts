import { z } from 'zod';
export declare const createGraduationSchema: z.ZodObject<{
    martialArtId: z.ZodString;
    name: z.ZodString;
    order: z.ZodDefault<z.ZodNumber>;
    color: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateGraduationSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    color: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare class CreateGraduationDto {
    martialArtId: string;
    name: string;
    order: number;
    color?: string | null;
}
export declare class UpdateGraduationDto {
    name?: string;
    order?: number;
    color?: string | null;
}

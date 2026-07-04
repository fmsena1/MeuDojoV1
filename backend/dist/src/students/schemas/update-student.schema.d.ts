import { z } from 'zod';
export declare const updateStudentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    birthDate: z.ZodOptional<z.ZodPreprocess<z.ZodNullable<z.ZodOptional<z.ZodDate>>>>;
    gender: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    rg: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    cpf: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    street: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    number: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    complement: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    neighborhood: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    city: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    state: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    zipCode: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    createUserAccess: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    password: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare class UpdateStudentDto {
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
    createUserAccess?: boolean;
    password?: string | null;
}

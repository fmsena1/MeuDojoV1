import { z } from 'zod';
import { Role } from '@prisma/client';
export declare const createInternalUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        TEACHER: "TEACHER";
        RECEPTIONIST: "RECEPTIONIST";
        STUDENT: "STUDENT";
    }>;
}, z.core.$strip>;
export declare class CreateInternalUserDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}

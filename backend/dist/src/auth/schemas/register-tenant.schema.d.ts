import { z } from 'zod';
export declare const registerTenantSchema: z.ZodObject<{
    academyName: z.ZodString;
    adminName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare class RegisterTenantDto {
    academyName: string;
    adminName: string;
    email: string;
    password: string;
}

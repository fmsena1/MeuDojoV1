import { z } from 'zod';
export declare const createEnrollmentSchema: z.ZodObject<{
    studentId: z.ZodString;
    classId: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
}, z.core.$strip>;
export declare const updateEnrollmentSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>;
}, z.core.$strip>;
export declare class CreateEnrollmentDto {
    studentId: string;
    classId: string;
    status?: 'ACTIVE' | 'INACTIVE';
}
export declare class UpdateEnrollmentDto {
    status: 'ACTIVE' | 'INACTIVE';
}

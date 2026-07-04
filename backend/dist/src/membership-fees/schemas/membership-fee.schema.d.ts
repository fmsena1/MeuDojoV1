import { z } from 'zod';
export declare const createMembershipFeeSchema: z.ZodObject<{
    studentId: z.ZodString;
    amount: z.ZodNumber;
    dueDate: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const bulkGenerateMembershipFeesSchema: z.ZodObject<{
    month: z.ZodNumber;
    year: z.ZodNumber;
    amount: z.ZodNumber;
    dueDate: z.ZodString;
}, z.core.$strip>;
export declare const payMembershipFeeSchema: z.ZodObject<{
    paidAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare class CreateMembershipFeeDto {
    studentId: string;
    amount: number;
    dueDate: string;
    notes?: string | null;
}
export declare class BulkGenerateMembershipFeesDto {
    month: number;
    year: number;
    amount: number;
    dueDate: string;
}
export declare class PayMembershipFeeDto {
    paidAt?: string | null;
}

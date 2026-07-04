import { z } from 'zod';
export declare const createTransactionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        REVENUE: "REVENUE";
        EXPENSE: "EXPENSE";
    }>;
    category: z.ZodString;
    amount: z.ZodNumber;
    date: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
export declare class CreateTransactionDto {
    type: 'REVENUE' | 'EXPENSE';
    category: string;
    amount: number;
    date: string;
    description: string;
}

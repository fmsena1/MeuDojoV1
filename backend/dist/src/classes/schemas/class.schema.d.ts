import { z } from 'zod';
export declare const classScheduleSchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, z.core.$strip>;
export declare const createClassSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    martialArtId: z.ZodString;
    teacherId: z.ZodString;
    schedules: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        startTime: z.ZodString;
        endTime: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateClassSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    martialArtId: z.ZodOptional<z.ZodString>;
    teacherId: z.ZodOptional<z.ZodString>;
    schedules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        startTime: z.ZodString;
        endTime: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare class ClassScheduleDto {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}
export declare class CreateClassDto {
    name: string;
    description?: string | null;
    martialArtId: string;
    teacherId: string;
    schedules: ClassScheduleDto[];
}
export declare class UpdateClassDto {
    name?: string;
    description?: string | null;
    martialArtId?: string;
    teacherId?: string;
    schedules?: ClassScheduleDto[];
}

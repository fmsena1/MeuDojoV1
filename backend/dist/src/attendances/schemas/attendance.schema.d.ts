import { z } from 'zod';
export declare const attendanceRecordSchema: z.ZodObject<{
    studentId: z.ZodString;
    status: z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        JUSTIFIED: "JUSTIFIED";
    }>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const bulkCreateAttendanceSchema: z.ZodObject<{
    classId: z.ZodString;
    date: z.ZodString;
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        status: z.ZodEnum<{
            PRESENT: "PRESENT";
            ABSENT: "ABSENT";
            LATE: "LATE";
            JUSTIFIED: "JUSTIFIED";
        }>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare class AttendanceRecordDto {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
    notes?: string | null;
}
export declare class BulkCreateAttendanceDto {
    classId: string;
    date: string;
    records: AttendanceRecordDto[];
}

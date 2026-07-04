import { PrismaService } from '../prisma/prisma.service';
import { BulkCreateAttendanceDto } from './schemas/attendance.schema';
export declare class AttendancesService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseDate;
    saveBulk(data: BulkCreateAttendanceDto, tenantId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    findByClassAndDate(classId: string, dateStr: string, tenantId: string): Promise<{
        studentId: string;
        name: string;
        status: string | null;
        notes: string | null;
    }[]>;
    findHistoryByStudent(studentId: string, tenantId: string): Promise<{
        student: {
            id: string;
            name: string;
        };
        stats: {
            total: number;
            present: number;
            absent: number;
            late: number;
            justified: number;
            attendanceRate: number;
        };
        history: {
            id: string;
            classId: string;
            className: string;
            date: string;
            status: string;
            notes: string | null;
        }[];
    }>;
}

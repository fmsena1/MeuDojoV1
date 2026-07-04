import { AttendancesService } from './attendances.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { BulkCreateAttendanceDto } from './schemas/attendance.schema';
export declare class AttendancesController {
    private readonly attendancesService;
    constructor(attendancesService: AttendancesService);
    saveBulk(dto: BulkCreateAttendanceDto, user: ActiveUserData): Promise<{
        success: boolean;
        count: number;
    }>;
    findByClassAndDate(classId: string, date: string, user: ActiveUserData): Promise<{
        studentId: string;
        name: string;
        status: string | null;
        notes: string | null;
    }[]>;
    findHistoryByStudent(studentId: string, user: ActiveUserData): Promise<{
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

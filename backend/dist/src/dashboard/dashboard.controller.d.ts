import { DashboardService } from './dashboard.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(user: ActiveUserData): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        pendingFees: number;
        monthlyRevenue: number;
        overdueFeesList: {
            id: string;
            studentName: string;
            amount: number;
            dueDate: string;
        }[];
        financeHistory: {
            month: string;
            receitas: number;
            despesas: number;
        }[];
        attendanceHistory: {
            date: string;
            presentes: number;
        }[];
    }>;
}

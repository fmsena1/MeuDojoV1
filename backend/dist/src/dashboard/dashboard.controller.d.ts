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
    }>;
}

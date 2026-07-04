import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(tenantId: string): Promise<{
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

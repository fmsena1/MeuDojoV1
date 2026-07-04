import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(tenantId: string): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        pendingFees: number;
    }>;
}

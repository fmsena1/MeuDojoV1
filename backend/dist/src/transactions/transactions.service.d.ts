import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './schemas/transaction.schema';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseDate;
    create(data: CreateTransactionDto, tenantId: string): Promise<{
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        date: Date;
        description: string;
        amount: number;
        category: string;
    }>;
    findAll(tenantId: string, filters?: {
        type?: 'REVENUE' | 'EXPENSE';
        month?: number;
        year?: number;
    }): Promise<{
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        date: Date;
        description: string;
        amount: number;
        category: string;
    }[]>;
    remove(id: string, tenantId: string): Promise<{
        success: boolean;
    }>;
    getDashboard(tenantId: string): Promise<{
        monthlyRevenue: number;
        monthlyExpense: number;
        netProfit: number;
        pendingCurrentMonthAmount: number;
        totalOverdueAmount: number;
        studentsOverdue: {
            studentId: string;
            name: string;
            phone: string | null;
            email: string | null;
            overdueCount: number;
            totalOverdueAmount: number;
            oldestDueDate: string;
        }[];
    }>;
}

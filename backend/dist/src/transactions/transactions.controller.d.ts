import { TransactionsService } from './transactions.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateTransactionDto } from './schemas/transaction.schema';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(dto: CreateTransactionDto, user: ActiveUserData): Promise<{
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
    findAll(user: ActiveUserData, type?: 'REVENUE' | 'EXPENSE', month?: string, year?: string): Promise<{
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
    getDashboard(user: ActiveUserData): Promise<{
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
    remove(id: string, user: ActiveUserData): Promise<{
        success: boolean;
    }>;
}

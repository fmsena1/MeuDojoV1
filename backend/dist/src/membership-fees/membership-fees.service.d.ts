import { PrismaService } from '../prisma/prisma.service';
import { CreateMembershipFeeDto, BulkGenerateMembershipFeesDto, PayMembershipFeeDto } from './schemas/membership-fee.schema';
export declare class MembershipFeesService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseDate;
    create(data: CreateMembershipFeeDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        studentId: string;
        notes: string | null;
        amount: number;
        dueDate: Date;
        paidAt: Date | null;
        transactionId: string | null;
    }>;
    bulkGenerate(data: BulkGenerateMembershipFeesDto, tenantId: string): Promise<{
        success: boolean;
        count: number;
        message: string;
    } | {
        success: boolean;
        count: number;
        message?: undefined;
    }>;
    findAll(tenantId: string, filters?: {
        status?: string;
        studentId?: string;
    }): Promise<{
        status: string;
        student: {
            name: string;
            email: string | null;
            id: string;
        };
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentId: string;
        notes: string | null;
        amount: number;
        dueDate: Date;
        paidAt: Date | null;
        transactionId: string | null;
    }[]>;
    pay(feeId: string, data: PayMembershipFeeDto, tenantId: string): Promise<{
        success: boolean;
    }>;
    remove(feeId: string, tenantId: string): Promise<{
        success: boolean;
    }>;
}

import { MembershipFeesService } from './membership-fees.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMembershipFeeDto, BulkGenerateMembershipFeesDto, PayMembershipFeeDto } from './schemas/membership-fee.schema';
export declare class MembershipFeesController {
    private readonly membershipFeesService;
    private readonly prisma;
    constructor(membershipFeesService: MembershipFeesService, prisma: PrismaService);
    create(dto: CreateMembershipFeeDto, user: ActiveUserData): Promise<{
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
    bulkGenerate(dto: BulkGenerateMembershipFeesDto, user: ActiveUserData): Promise<{
        success: boolean;
        count: number;
        message: string;
    } | {
        success: boolean;
        count: number;
        message?: undefined;
    }>;
    findAll(user: ActiveUserData, status?: string, studentId?: string): Promise<{
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
    pay(id: string, dto: PayMembershipFeeDto, user: ActiveUserData): Promise<{
        success: boolean;
    }>;
    remove(id: string, user: ActiveUserData): Promise<{
        success: boolean;
    }>;
}

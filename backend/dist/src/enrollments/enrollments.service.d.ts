import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './schemas/enrollment.schema';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateEnrollmentDto, tenantId: string): Promise<{
        student: {
            name: string;
        };
        class: {
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        classId: string;
        studentId: string;
    }>;
    findAll(tenantId: string): Promise<({
        student: {
            name: string;
            status: string;
        };
        class: {
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        classId: string;
        studentId: string;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        student: {
            name: string;
        };
        class: {
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        classId: string;
        studentId: string;
    }>;
    update(id: string, data: UpdateEnrollmentDto, tenantId: string): Promise<{
        student: {
            name: string;
        };
        class: {
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        classId: string;
        studentId: string;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        classId: string;
        studentId: string;
    }>;
}

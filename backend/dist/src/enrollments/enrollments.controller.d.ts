import { EnrollmentsService } from './enrollments.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './schemas/enrollment.schema';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    create(dto: CreateEnrollmentDto, user: ActiveUserData): Promise<{
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
    findAll(user: ActiveUserData): Promise<({
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
    findOne(id: string, user: ActiveUserData): Promise<{
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
    update(id: string, dto: UpdateEnrollmentDto, user: ActiveUserData): Promise<{
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
    remove(id: string, user: ActiveUserData): Promise<{
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

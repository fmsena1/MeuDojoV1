import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto, UpdateClassDto } from './schemas/class.schema';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateRelations;
    create(data: CreateClassDto, tenantId: string): Promise<({
        teacher: {
            name: string;
        };
        martialArt: {
            name: string;
        };
        schedules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            classId: string;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        martialArtId: string;
        teacherId: string;
    }) | null>;
    findAll(tenantId: string): Promise<({
        teacher: {
            name: string;
        };
        martialArt: {
            name: string;
        };
        _count: {
            enrollments: number;
        };
        schedules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            classId: string;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        martialArtId: string;
        teacherId: string;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        teacher: {
            name: string;
        };
        martialArt: {
            name: string;
        };
        enrollments: ({
            student: {
                name: string;
                id: string;
                status: string;
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
        })[];
        schedules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            classId: string;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        martialArtId: string;
        teacherId: string;
    }>;
    update(id: string, data: UpdateClassDto, tenantId: string): Promise<({
        teacher: {
            name: string;
        };
        martialArt: {
            name: string;
        };
        schedules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            classId: string;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        martialArtId: string;
        teacherId: string;
    }) | null>;
    remove(id: string, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        martialArtId: string;
        teacherId: string;
    }>;
}

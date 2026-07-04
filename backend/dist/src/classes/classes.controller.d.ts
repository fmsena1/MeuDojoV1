import { ClassesService } from './classes.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateClassDto, UpdateClassDto } from './schemas/class.schema';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(dto: CreateClassDto, user: ActiveUserData): Promise<({
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
    findAll(user: ActiveUserData): Promise<({
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
    findOne(id: string, user: ActiveUserData): Promise<{
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
    update(id: string, dto: UpdateClassDto, user: ActiveUserData): Promise<({
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
    remove(id: string, user: ActiveUserData): Promise<{
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

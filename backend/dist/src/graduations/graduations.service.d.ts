import { PrismaService } from '../prisma/prisma.service';
import { CreateGraduationDto, UpdateGraduationDto } from './schemas/graduation.schema';
export declare class GraduationsService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateMartialArtBelongsToTenant;
    create(data: CreateGraduationDto, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        order: number;
        martialArtId: string;
        color: string | null;
    }>;
    findAllByMartialArt(martialArtId: string, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        order: number;
        martialArtId: string;
        color: string | null;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        order: number;
        martialArtId: string;
        color: string | null;
    }>;
    update(id: string, data: UpdateGraduationDto, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        order: number;
        martialArtId: string;
        color: string | null;
    }>;
    remove(id: string, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        order: number;
        martialArtId: string;
        color: string | null;
    }>;
}

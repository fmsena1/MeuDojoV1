import { PrismaService } from '../prisma/prisma.service';
import { CreateMartialArtDto, UpdateMartialArtDto } from './schemas/martial-art.schema';
export declare class MartialArtsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateMartialArtDto, tenantId: string): Promise<{
        graduations: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            order: number;
            martialArtId: string;
            color: string | null;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    }>;
    findAll(tenantId: string): Promise<({
        graduations: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            order: number;
            martialArtId: string;
            color: string | null;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        graduations: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            order: number;
            martialArtId: string;
            color: string | null;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    }>;
    update(id: string, data: UpdateMartialArtDto, tenantId: string): Promise<{
        graduations: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            order: number;
            martialArtId: string;
            color: string | null;
        }[];
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    }>;
    remove(id: string, tenantId: string): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    }>;
}

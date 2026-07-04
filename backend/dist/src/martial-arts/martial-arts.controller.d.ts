import { MartialArtsService } from './martial-arts.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateMartialArtDto, UpdateMartialArtDto } from './schemas/martial-art.schema';
export declare class MartialArtsController {
    private readonly martialArtsService;
    constructor(martialArtsService: MartialArtsService);
    create(dto: CreateMartialArtDto, user: ActiveUserData): Promise<{
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
    findAll(user: ActiveUserData): Promise<({
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
    findOne(id: string, user: ActiveUserData): Promise<{
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
    update(id: string, dto: UpdateMartialArtDto, user: ActiveUserData): Promise<{
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
    remove(id: string, user: ActiveUserData): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    }>;
}

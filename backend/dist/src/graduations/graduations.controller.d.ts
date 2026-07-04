import { GraduationsService } from './graduations.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateGraduationDto, UpdateGraduationDto } from './schemas/graduation.schema';
export declare class GraduationsController {
    private readonly graduationsService;
    constructor(graduationsService: GraduationsService);
    create(dto: CreateGraduationDto, user: ActiveUserData): Promise<{
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
    findAllByMartialArt(martialArtId: string, user: ActiveUserData): Promise<{
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
    findOne(id: string, user: ActiveUserData): Promise<{
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
    update(id: string, dto: UpdateGraduationDto, user: ActiveUserData): Promise<{
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
    remove(id: string, user: ActiveUserData): Promise<{
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

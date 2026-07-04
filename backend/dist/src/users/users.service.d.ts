import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './schemas/create-user.schema';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<({
        tenant: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            slug: string;
        };
    } & {
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null>;
    createInternalUser(data: CreateInternalUserDto, tenantId: string): Promise<{
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        tenantId: string;
        createdAt: Date;
    }>;
    findAll(tenantId: string): Promise<{
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
    }[]>;
}

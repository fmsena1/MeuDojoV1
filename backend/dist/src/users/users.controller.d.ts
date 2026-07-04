import { UsersService } from './users.service';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { CreateInternalUserDto } from './schemas/create-user.schema';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateInternalUserDto, user: ActiveUserData): Promise<{
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        tenantId: string;
        createdAt: Date;
    }>;
    findAll(user: ActiveUserData): Promise<{
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
    }[]>;
}

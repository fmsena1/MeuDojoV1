import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './schemas/login.schema';
import { RegisterTenantDto } from './schemas/register-tenant.schema';
export declare class AuthService {
    private prisma;
    private usersService;
    private jwtService;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            tenant: {
                id: string;
                name: string;
                slug: string;
            };
        };
    }>;
    registerTenant(dto: RegisterTenantDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            tenant: {
                id: string;
                name: string;
                slug: string;
            };
        };
    }>;
}

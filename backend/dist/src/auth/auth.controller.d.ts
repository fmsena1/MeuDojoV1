import { AuthService } from './auth.service';
import { LoginDto } from './schemas/login.schema';
import { RegisterTenantDto } from './schemas/register-tenant.schema';
import type { ActiveUserData } from './decorators/active-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
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
    register(registerTenantDto: RegisterTenantDto): Promise<{
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
    getProfile(user: ActiveUserData): Promise<ActiveUserData>;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    usersService;
    jwtService;
    constructor(prisma, usersService, jwtService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('E-mail ou senha incorretos.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-mail ou senha incorretos.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenant: {
                    id: user.tenant.id,
                    name: user.tenant.name,
                    slug: user.tenant.slug,
                },
            },
        };
    }
    async registerTenant(dto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('E-mail já cadastrado.');
        }
        const slug = dto.academyName
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/[\s-]+/g, '-');
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { slug },
        });
        if (existingTenant) {
            throw new common_1.BadRequestException('Já existe uma academia cadastrada com este nome.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const result = await this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: dto.academyName,
                    slug,
                },
            });
            const user = await tx.user.create({
                data: {
                    name: dto.adminName,
                    email: dto.email,
                    password: hashedPassword,
                    role: client_1.Role.ADMIN,
                    tenantId: tenant.id,
                },
                include: {
                    tenant: true,
                },
            });
            return user;
        });
        const payload = {
            sub: result.id,
            email: result.email,
            role: result.role,
            tenantId: result.tenantId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role,
                tenant: {
                    id: result.tenant.id,
                    name: result.tenant.name,
                    slug: result.tenant.slug,
                },
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
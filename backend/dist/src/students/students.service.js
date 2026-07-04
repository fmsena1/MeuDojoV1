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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, tenantId) {
        let userId;
        if (data.createUserAccess) {
            if (!data.email) {
                throw new common_1.BadRequestException('E-mail é obrigatório para criar acesso ao sistema.');
            }
            if (!data.password) {
                throw new common_1.BadRequestException('Senha é obrigatória para criar acesso ao sistema.');
            }
            const existingUser = await this.prisma.user.findFirst({
                where: { email: data.email, deletedAt: null },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('O e-mail informado já está em uso por outro usuário.');
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: client_1.Role.STUDENT,
                    tenantId,
                },
            });
            userId = user.id;
        }
        return this.prisma.student.create({
            data: {
                tenantId,
                userId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                birthDate: data.birthDate,
                gender: data.gender,
                rg: data.rg,
                cpf: data.cpf,
                street: data.street,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                status: data.status || 'ACTIVE',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findAll(tenantId, search) {
        return this.prisma.student.findMany({
            where: {
                tenantId,
                deletedAt: null,
                ...(search
                    ? {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                            { cpf: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id, tenantId) {
        const student = await this.prisma.student.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Aluno não encontrado.');
        }
        return student;
    }
    async update(id, data, tenantId) {
        const student = await this.findOne(id, tenantId);
        let userId = student.userId;
        if (data.createUserAccess && !student.userId) {
            if (!data.email) {
                throw new common_1.BadRequestException('E-mail é obrigatório para criar acesso ao sistema.');
            }
            if (!data.password) {
                throw new common_1.BadRequestException('Senha é obrigatória para criar acesso ao sistema.');
            }
            const existingUser = await this.prisma.user.findFirst({
                where: { email: data.email, deletedAt: null },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('O e-mail informado já está em uso por outro usuário.');
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    name: data.name || student.name,
                    email: data.email,
                    password: hashedPassword,
                    role: client_1.Role.STUDENT,
                    tenantId,
                },
            });
            userId = user.id;
        }
        else if (student.userId) {
            const userUpdateData = {};
            if (data.name)
                userUpdateData.name = data.name;
            if (data.email && data.email !== student.email) {
                const existingUser = await this.prisma.user.findFirst({
                    where: {
                        email: data.email,
                        deletedAt: null,
                        NOT: { id: student.userId },
                    },
                });
                if (existingUser) {
                    throw new common_1.BadRequestException('O e-mail informado já está em uso por outro usuário.');
                }
                userUpdateData.email = data.email;
            }
            if (data.password) {
                userUpdateData.password = await bcrypt.hash(data.password, 10);
            }
            if (Object.keys(userUpdateData).length > 0) {
                await this.prisma.user.update({
                    where: { id: student.userId },
                    data: userUpdateData,
                });
            }
        }
        return this.prisma.student.update({
            where: { id },
            data: {
                userId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                birthDate: data.birthDate,
                gender: data.gender,
                rg: data.rg,
                cpf: data.cpf,
                street: data.street,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                status: data.status,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async remove(id, tenantId) {
        const student = await this.findOne(id, tenantId);
        const now = new Date();
        const deletedStudent = await this.prisma.student.update({
            where: { id },
            data: { deletedAt: now },
        });
        if (student.userId) {
            await this.prisma.user.update({
                where: { id: student.userId },
                data: { deletedAt: now },
            });
        }
        return deletedStudent;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map
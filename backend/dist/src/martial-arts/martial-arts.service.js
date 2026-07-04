"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MartialArtsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MartialArtsService = class MartialArtsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, tenantId) {
        return this.prisma.martialArt.create({
            data: {
                name: data.name,
                description: data.description,
                tenantId,
            },
            include: {
                graduations: {
                    where: { deletedAt: null },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.martialArt.findMany({
            where: {
                tenantId,
                deletedAt: null,
            },
            include: {
                graduations: {
                    where: { deletedAt: null },
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id, tenantId) {
        const martialArt = await this.prisma.martialArt.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                graduations: {
                    where: { deletedAt: null },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!martialArt) {
            throw new common_1.NotFoundException('Modalidade não encontrada.');
        }
        return martialArt;
    }
    async update(id, data, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.martialArt.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
            include: {
                graduations: {
                    where: { deletedAt: null },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.graduation.updateMany({
            where: { martialArtId: id, deletedAt: null },
            data: { deletedAt: new Date() },
        });
        return this.prisma.martialArt.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.MartialArtsService = MartialArtsService;
exports.MartialArtsService = MartialArtsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MartialArtsService);
//# sourceMappingURL=martial-arts.service.js.map
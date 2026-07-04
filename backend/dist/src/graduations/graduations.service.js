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
exports.GraduationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GraduationsService = class GraduationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateMartialArtBelongsToTenant(martialArtId, tenantId) {
        const martialArt = await this.prisma.martialArt.findFirst({
            where: { id: martialArtId, tenantId, deletedAt: null },
        });
        if (!martialArt) {
            throw new common_1.BadRequestException('Modalidade não encontrada ou não pertence a este tenant.');
        }
        return martialArt;
    }
    async create(data, tenantId) {
        await this.validateMartialArtBelongsToTenant(data.martialArtId, tenantId);
        return this.prisma.graduation.create({
            data: {
                martialArtId: data.martialArtId,
                tenantId,
                name: data.name,
                order: data.order ?? 0,
                color: data.color,
            },
        });
    }
    async findAllByMartialArt(martialArtId, tenantId) {
        await this.validateMartialArtBelongsToTenant(martialArtId, tenantId);
        return this.prisma.graduation.findMany({
            where: { martialArtId, tenantId, deletedAt: null },
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id, tenantId) {
        const graduation = await this.prisma.graduation.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!graduation) {
            throw new common_1.NotFoundException('Graduação não encontrada.');
        }
        return graduation;
    }
    async update(id, data, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.graduation.update({
            where: { id },
            data: {
                name: data.name,
                order: data.order,
                color: data.color,
            },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.graduation.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.GraduationsService = GraduationsService;
exports.GraduationsService = GraduationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GraduationsService);
//# sourceMappingURL=graduations.service.js.map
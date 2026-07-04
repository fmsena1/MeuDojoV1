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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EnrollmentsService = class EnrollmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, tenantId) {
        const student = await this.prisma.student.findFirst({
            where: { id: data.studentId, tenantId, deletedAt: null },
        });
        if (!student) {
            throw new common_1.BadRequestException('Aluno não encontrado ou não pertence a esta academia.');
        }
        const targetClass = await this.prisma.class.findFirst({
            where: { id: data.classId, tenantId, deletedAt: null },
        });
        if (!targetClass) {
            throw new common_1.BadRequestException('Turma não encontrada ou não pertence a esta academia.');
        }
        const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
                studentId: data.studentId,
                classId: data.classId,
                deletedAt: null,
            },
        });
        if (existingEnrollment) {
            throw new common_1.BadRequestException('O aluno já está matriculado nesta turma.');
        }
        return this.prisma.enrollment.create({
            data: {
                tenantId,
                studentId: data.studentId,
                classId: data.classId,
                status: data.status ?? 'ACTIVE',
            },
            include: {
                student: { select: { name: true } },
                class: { select: { name: true } },
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.enrollment.findMany({
            where: { tenantId, deletedAt: null },
            include: {
                student: { select: { name: true, status: true } },
                class: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, tenantId) {
        const enrollment = await this.prisma.enrollment.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                student: { select: { name: true } },
                class: { select: { name: true } },
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Matrícula não encontrada.');
        }
        return enrollment;
    }
    async update(id, data, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.enrollment.update({
            where: { id },
            data: {
                status: data.status,
            },
            include: {
                student: { select: { name: true } },
                class: { select: { name: true } },
            },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.enrollment.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                status: 'INACTIVE',
            },
        });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map
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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateRelations(martialArtId, teacherId, tenantId) {
        const martialArt = await this.prisma.martialArt.findFirst({
            where: { id: martialArtId, tenantId, deletedAt: null },
        });
        if (!martialArt) {
            throw new common_1.BadRequestException('Modalidade não encontrada ou não pertence a esta academia.');
        }
        const teacher = await this.prisma.teacher.findFirst({
            where: { id: teacherId, tenantId, deletedAt: null },
        });
        if (!teacher) {
            throw new common_1.BadRequestException('Professor não encontrado ou não pertence a esta academia.');
        }
    }
    async create(data, tenantId) {
        await this.validateRelations(data.martialArtId, data.teacherId, tenantId);
        return this.prisma.$transaction(async (tx) => {
            const newClass = await tx.class.create({
                data: {
                    tenantId,
                    martialArtId: data.martialArtId,
                    teacherId: data.teacherId,
                    name: data.name,
                    description: data.description,
                },
            });
            if (data.schedules && data.schedules.length > 0) {
                await tx.classSchedule.createMany({
                    data: data.schedules.map((schedule) => ({
                        classId: newClass.id,
                        dayOfWeek: schedule.dayOfWeek,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                    })),
                });
            }
            return tx.class.findUnique({
                where: { id: newClass.id },
                include: {
                    schedules: true,
                    martialArt: { select: { name: true } },
                    teacher: { select: { name: true } },
                },
            });
        });
    }
    async findAll(tenantId) {
        return this.prisma.class.findMany({
            where: { tenantId, deletedAt: null },
            include: {
                schedules: true,
                martialArt: { select: { name: true } },
                teacher: { select: { name: true } },
                _count: {
                    select: {
                        enrollments: {
                            where: { deletedAt: null, status: 'ACTIVE' },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id, tenantId) {
        const targetClass = await this.prisma.class.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                schedules: true,
                martialArt: { select: { name: true } },
                teacher: { select: { name: true } },
                enrollments: {
                    where: { deletedAt: null },
                    include: {
                        student: {
                            select: { id: true, name: true, status: true },
                        },
                    },
                },
            },
        });
        if (!targetClass) {
            throw new common_1.NotFoundException('Turma não encontrada.');
        }
        return targetClass;
    }
    async update(id, data, tenantId) {
        const existingClass = await this.findOne(id, tenantId);
        const mId = data.martialArtId ?? existingClass.martialArtId;
        const tId = data.teacherId ?? existingClass.teacherId;
        await this.validateRelations(mId, tId, tenantId);
        return this.prisma.$transaction(async (tx) => {
            await tx.class.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    martialArtId: data.martialArtId,
                    teacherId: data.teacherId,
                },
            });
            if (data.schedules) {
                await tx.classSchedule.deleteMany({
                    where: { classId: id },
                });
                if (data.schedules.length > 0) {
                    await tx.classSchedule.createMany({
                        data: data.schedules.map((schedule) => ({
                            classId: id,
                            dayOfWeek: schedule.dayOfWeek,
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
                        })),
                    });
                }
            }
            return tx.class.findUnique({
                where: { id },
                include: {
                    schedules: true,
                    martialArt: { select: { name: true } },
                    teacher: { select: { name: true } },
                },
            });
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.$transaction(async (tx) => {
            await tx.enrollment.updateMany({
                where: { classId: id, deletedAt: null },
                data: { deletedAt: new Date(), status: 'INACTIVE' },
            });
            return tx.class.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map
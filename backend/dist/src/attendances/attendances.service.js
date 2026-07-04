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
exports.AttendancesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendancesService = class AttendancesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseDate(dateStr) {
        const parsed = new Date(`${dateStr}T00:00:00.000Z`);
        if (isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException('Formato de data inválido.');
        }
        return parsed;
    }
    async saveBulk(data, tenantId) {
        const date = this.parseDate(data.date);
        const targetClass = await this.prisma.class.findFirst({
            where: { id: data.classId, tenantId, deletedAt: null },
        });
        if (!targetClass) {
            throw new common_1.BadRequestException('Turma não encontrada ou não pertence a esta academia.');
        }
        const studentIds = data.records.map((r) => r.studentId);
        const validStudentsCount = await this.prisma.student.count({
            where: {
                id: { in: studentIds },
                tenantId,
                deletedAt: null,
            },
        });
        if (validStudentsCount !== studentIds.length) {
            throw new common_1.BadRequestException('Um ou mais alunos enviados são inválidos.');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.attendance.deleteMany({
                where: {
                    classId: data.classId,
                    date,
                    tenantId,
                },
            });
            await tx.attendance.createMany({
                data: data.records.map((r) => ({
                    tenantId,
                    classId: data.classId,
                    studentId: r.studentId,
                    date,
                    status: r.status,
                    notes: r.notes || null,
                })),
            });
            return { success: true, count: data.records.length };
        });
    }
    async findByClassAndDate(classId, dateStr, tenantId) {
        const date = this.parseDate(dateStr);
        const targetClass = await this.prisma.class.findFirst({
            where: { id: classId, tenantId, deletedAt: null },
            include: {
                enrollments: {
                    where: { deletedAt: null, status: 'ACTIVE' },
                    include: {
                        student: { select: { id: true, name: true } },
                    },
                },
            },
        });
        if (!targetClass) {
            throw new common_1.BadRequestException('Turma não encontrada ou não pertence a esta academia.');
        }
        const attendances = await this.prisma.attendance.findMany({
            where: { classId, date, tenantId },
        });
        const list = targetClass.enrollments.map((en) => {
            const att = attendances.find((a) => a.studentId === en.studentId);
            return {
                studentId: en.studentId,
                name: en.student.name,
                status: att?.status || null,
                notes: att?.notes || null,
            };
        });
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    async findHistoryByStudent(studentId, tenantId) {
        const student = await this.prisma.student.findFirst({
            where: { id: studentId, tenantId, deletedAt: null },
        });
        if (!student) {
            throw new common_1.BadRequestException('Aluno não encontrado.');
        }
        const attendances = await this.prisma.attendance.findMany({
            where: { studentId, tenantId },
            include: {
                class: { select: { name: true } },
            },
            orderBy: { date: 'desc' },
        });
        const total = attendances.length;
        const present = attendances.filter((a) => a.status === 'PRESENT').length;
        const absent = attendances.filter((a) => a.status === 'ABSENT').length;
        const late = attendances.filter((a) => a.status === 'LATE').length;
        const justified = attendances.filter((a) => a.status === 'JUSTIFIED').length;
        const rate = total > 0 ? ((present + late + justified) / total) * 100 : 100;
        return {
            student: {
                id: student.id,
                name: student.name,
            },
            stats: {
                total,
                present,
                absent,
                late,
                justified,
                attendanceRate: Math.round(rate * 10) / 10,
            },
            history: attendances.map((a) => ({
                id: a.id,
                classId: a.classId,
                className: a.class.name,
                date: a.date.toISOString().split('T')[0],
                status: a.status,
                notes: a.notes,
            })),
        };
    }
};
exports.AttendancesService = AttendancesService;
exports.AttendancesService = AttendancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendancesService);
//# sourceMappingURL=attendances.service.js.map
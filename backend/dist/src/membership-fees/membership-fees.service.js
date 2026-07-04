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
exports.MembershipFeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MembershipFeesService = class MembershipFeesService {
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
    async create(data, tenantId) {
        const dueDate = this.parseDate(data.dueDate);
        const student = await this.prisma.student.findFirst({
            where: { id: data.studentId, tenantId, deletedAt: null },
        });
        if (!student) {
            throw new common_1.BadRequestException('Aluno não encontrado ou não pertence a esta academia.');
        }
        return this.prisma.membershipFee.create({
            data: {
                tenantId,
                studentId: data.studentId,
                amount: data.amount,
                dueDate,
                status: 'PENDING',
                notes: data.notes || null,
            },
        });
    }
    async bulkGenerate(data, tenantId) {
        const startOfMonth = new Date(data.year, data.month - 1, 1);
        const endOfMonth = new Date(data.year, data.month, 0, 23, 59, 59, 999);
        const dueDate = this.parseDate(data.dueDate);
        const activeStudents = await this.prisma.student.findMany({
            where: { tenantId, status: 'ACTIVE', deletedAt: null },
        });
        if (activeStudents.length === 0) {
            throw new common_1.BadRequestException('Não há alunos ativos cadastrados para gerar cobranças.');
        }
        const existingFees = await this.prisma.membershipFee.findMany({
            where: {
                tenantId,
                dueDate: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                deletedAt: null,
            },
            select: { studentId: true },
        });
        const existingStudentIds = new Set(existingFees.map((f) => f.studentId));
        const studentsToBill = activeStudents.filter((s) => !existingStudentIds.has(s.id));
        if (studentsToBill.length === 0) {
            return {
                success: true,
                count: 0,
                message: 'Todas as mensalidades para este mês já foram geradas.',
            };
        }
        await this.prisma.membershipFee.createMany({
            data: studentsToBill.map((student) => ({
                tenantId,
                studentId: student.id,
                amount: data.amount,
                dueDate,
                status: 'PENDING',
            })),
        });
        return { success: true, count: studentsToBill.length };
    }
    async findAll(tenantId, filters) {
        const where = { tenantId, deletedAt: null };
        const todayStr = new Date().toISOString().split('T')[0];
        const today = new Date(`${todayStr}T00:00:00.000Z`);
        if (filters?.status) {
            if (filters.status === 'OVERDUE') {
                where.status = 'PENDING';
                where.dueDate = { lt: today };
            }
            else if (filters.status === 'PENDING') {
                where.status = 'PENDING';
                where.dueDate = { gte: today };
            }
            else {
                where.status = filters.status;
            }
        }
        if (filters?.studentId) {
            where.studentId = filters.studentId;
        }
        const fees = await this.prisma.membershipFee.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { dueDate: 'desc' },
        });
        return fees.map((f) => {
            let status = f.status;
            if (f.status === 'PENDING' && f.dueDate < today) {
                status = 'OVERDUE';
            }
            return { ...f, status };
        });
    }
    async pay(feeId, data, tenantId) {
        const fee = await this.prisma.membershipFee.findFirst({
            where: { id: feeId, tenantId, deletedAt: null },
            include: { student: true },
        });
        if (!fee) {
            throw new common_1.BadRequestException('Mensalidade não encontrada ou não pertence a esta academia.');
        }
        if (fee.status === 'PAID') {
            throw new common_1.BadRequestException('Esta mensalidade já está paga.');
        }
        const paidAtDate = data.paidAt ? this.parseDate(data.paidAt) : new Date();
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    tenantId,
                    type: 'REVENUE',
                    category: 'MEMBERSHIP',
                    amount: fee.amount,
                    date: paidAtDate,
                    description: `Mensalidade do aluno ${fee.student.name}`,
                },
            });
            await tx.membershipFee.update({
                where: { id: feeId },
                data: {
                    status: 'PAID',
                    paidAt: paidAtDate,
                    transactionId: transaction.id,
                },
            });
            return { success: true };
        });
    }
    async remove(feeId, tenantId) {
        const fee = await this.prisma.membershipFee.findFirst({
            where: { id: feeId, tenantId, deletedAt: null },
        });
        if (!fee) {
            throw new common_1.BadRequestException('Mensalidade não encontrada.');
        }
        return this.prisma.$transaction(async (tx) => {
            if (fee.transactionId) {
                await tx.transaction.delete({
                    where: { id: fee.transactionId },
                });
            }
            await tx.membershipFee.delete({
                where: { id: feeId },
            });
            return { success: true };
        });
    }
};
exports.MembershipFeesService = MembershipFeesService;
exports.MembershipFeesService = MembershipFeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipFeesService);
//# sourceMappingURL=membership-fees.service.js.map
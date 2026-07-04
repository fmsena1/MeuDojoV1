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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
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
        const date = this.parseDate(data.date);
        return this.prisma.transaction.create({
            data: {
                tenantId,
                type: data.type,
                category: data.category.trim(),
                amount: data.amount,
                date,
                description: data.description.trim(),
            },
        });
    }
    async findAll(tenantId, filters) {
        const where = { tenantId, deletedAt: null };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.month && filters?.year) {
            const startOfMonth = new Date(filters.year, filters.month - 1, 1);
            const endOfMonth = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);
            where.date = {
                gte: startOfMonth,
                lte: endOfMonth,
            };
        }
        return this.prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
    async remove(id, tenantId) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { membershipFee: true },
        });
        if (!transaction) {
            throw new common_1.BadRequestException('Movimentação não encontrada.');
        }
        return this.prisma.$transaction(async (tx) => {
            if (transaction.membershipFee) {
                await tx.membershipFee.update({
                    where: { id: transaction.membershipFee.id },
                    data: {
                        status: 'PENDING',
                        paidAt: null,
                        transactionId: null,
                    },
                });
            }
            await tx.transaction.delete({
                where: { id },
            });
            return { success: true };
        });
    }
    async getDashboard(tenantId) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
        const todayStr = now.toISOString().split('T')[0];
        const today = new Date(`${todayStr}T00:00:00.000Z`);
        const revenues = await this.prisma.transaction.aggregate({
            where: {
                tenantId,
                type: 'REVENUE',
                date: { gte: startOfMonth, lte: endOfMonth },
                deletedAt: null,
            },
            _sum: { amount: true },
        });
        const expenses = await this.prisma.transaction.aggregate({
            where: {
                tenantId,
                type: 'EXPENSE',
                date: { gte: startOfMonth, lte: endOfMonth },
                deletedAt: null,
            },
            _sum: { amount: true },
        });
        const pendingCurrentMonth = await this.prisma.membershipFee.aggregate({
            where: {
                tenantId,
                status: 'PENDING',
                dueDate: { gte: startOfMonth, lte: endOfMonth },
                deletedAt: null,
            },
            _sum: { amount: true },
        });
        const totalOverdue = await this.prisma.membershipFee.aggregate({
            where: {
                tenantId,
                status: 'PENDING',
                dueDate: { lt: today },
                deletedAt: null,
            },
            _sum: { amount: true },
        });
        const overdueFees = await this.prisma.membershipFee.findMany({
            where: {
                tenantId,
                status: 'PENDING',
                dueDate: { lt: today },
                deletedAt: null,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });
        const studentOverdueMap = new Map();
        overdueFees.forEach((fee) => {
            const existing = studentOverdueMap.get(fee.studentId);
            const dueDateStr = fee.dueDate.toISOString().split('T')[0];
            if (existing) {
                existing.overdueCount += 1;
                existing.totalOverdueAmount += fee.amount;
                if (dueDateStr < existing.oldestDueDate) {
                    existing.oldestDueDate = dueDateStr;
                }
            }
            else {
                studentOverdueMap.set(fee.studentId, {
                    studentId: fee.studentId,
                    name: fee.student.name,
                    phone: fee.student.phone,
                    email: fee.student.email,
                    overdueCount: 1,
                    totalOverdueAmount: fee.amount,
                    oldestDueDate: dueDateStr,
                });
            }
        });
        const studentsOverdue = Array.from(studentOverdueMap.values()).sort((a, b) => b.totalOverdueAmount - a.totalOverdueAmount);
        return {
            monthlyRevenue: revenues._sum.amount || 0,
            monthlyExpense: expenses._sum.amount || 0,
            netProfit: (revenues._sum.amount || 0) - (expenses._sum.amount || 0),
            pendingCurrentMonthAmount: pendingCurrentMonth._sum.amount || 0,
            totalOverdueAmount: totalOverdue._sum.amount || 0,
            studentsOverdue,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  private parseDate(dateStr: string): Date {
    const parsed = new Date(`${dateStr}T00:00:00.000Z`);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Formato de data inválido.');
    }
    return parsed;
  }

  async create(data: CreateTransactionDto, tenantId: string) {
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

  async findAll(
    tenantId: string,
    filters?: { type?: 'REVENUE' | 'EXPENSE'; month?: number; year?: number },
  ) {
    const where: any = { tenantId, deletedAt: null };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.month && filters?.year) {
      const startOfMonth = new Date(filters.year, filters.month - 1, 1);
      const endOfMonth = new Date(
        filters.year,
        filters.month,
        0,
        23,
        59,
        59,
        999,
      );
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

  async remove(id: string, tenantId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { membershipFee: true },
    });

    if (!transaction) {
      throw new BadRequestException('Movimentação não encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Se estiver vinculada a uma mensalidade, reverte o pagamento dela
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

  async getDashboard(tenantId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const todayStr = now.toISOString().split('T')[0];
    const today = new Date(`${todayStr}T00:00:00.000Z`);

    // 1. Receitas do mês
    const revenues = await this.prisma.transaction.aggregate({
      where: {
        tenantId,
        type: 'REVENUE',
        date: { gte: startOfMonth, lte: endOfMonth },
        deletedAt: null,
      },
      _sum: { amount: true },
    });

    // 2. Despesas do mês
    const expenses = await this.prisma.transaction.aggregate({
      where: {
        tenantId,
        type: 'EXPENSE',
        date: { gte: startOfMonth, lte: endOfMonth },
        deletedAt: null,
      },
      _sum: { amount: true },
    });

    // 3. Contas pendentes no mês atual
    const pendingCurrentMonth = await this.prisma.membershipFee.aggregate({
      where: {
        tenantId,
        status: 'PENDING',
        dueDate: { gte: startOfMonth, lte: endOfMonth },
        deletedAt: null,
      },
      _sum: { amount: true },
    });

    // 4. Inadimplência total acumulada (cobranças pendentes com data de vencimento anterior a hoje)
    const totalOverdue = await this.prisma.membershipFee.aggregate({
      where: {
        tenantId,
        status: 'PENDING',
        dueDate: { lt: today },
        deletedAt: null,
      },
      _sum: { amount: true },
    });

    // 5. Lista detalhada de alunos inadimplentes (com cobranças vencidas)
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

    // Agrupa mensalidades vencidas por aluno para não repetir
    const studentOverdueMap = new Map<
      string,
      {
        studentId: string;
        name: string;
        phone: string | null;
        email: string | null;
        overdueCount: number;
        totalOverdueAmount: number;
        oldestDueDate: string;
      }
    >();

    overdueFees.forEach((fee) => {
      const existing = studentOverdueMap.get(fee.studentId);
      const dueDateStr = fee.dueDate.toISOString().split('T')[0];
      if (existing) {
        existing.overdueCount += 1;
        existing.totalOverdueAmount += fee.amount;
        if (dueDateStr < existing.oldestDueDate) {
          existing.oldestDueDate = dueDateStr;
        }
      } else {
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

    const studentsOverdue = Array.from(studentOverdueMap.values()).sort(
      (a, b) => b.totalOverdueAmount - a.totalOverdueAmount,
    );

    return {
      monthlyRevenue: revenues._sum.amount || 0,
      monthlyExpense: expenses._sum.amount || 0,
      netProfit: (revenues._sum.amount || 0) - (expenses._sum.amount || 0),
      pendingCurrentMonthAmount: pendingCurrentMonth._sum.amount || 0,
      totalOverdueAmount: totalOverdue._sum.amount || 0,
      studentsOverdue,
    };
  }
}

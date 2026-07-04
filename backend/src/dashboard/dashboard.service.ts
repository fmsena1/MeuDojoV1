import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const todayStr = now.toISOString().split('T')[0];
    const today = new Date(`${todayStr}T00:00:00.000Z`);

    // 1. Consultas Básicas (Contagens)
    const [totalStudents, totalTeachers, totalClasses, pendingFees] = await Promise.all([
      this.prisma.student.count({
        where: { tenantId, status: 'ACTIVE', deletedAt: null },
      }),
      this.prisma.teacher.count({
        where: { tenantId, status: 'ACTIVE', deletedAt: null },
      }),
      this.prisma.class.count({
        where: { tenantId, deletedAt: null },
      }),
      this.prisma.membershipFee.count({
        where: { tenantId, status: 'PENDING', deletedAt: null },
      }),
    ]);

    // 2. Receita do mês corrente
    const revenueAggregate = await this.prisma.transaction.aggregate({
      where: {
        tenantId,
        type: 'REVENUE',
        date: { gte: startOfMonth, lte: endOfMonth },
        deletedAt: null,
      },
      _sum: { amount: true },
    });
    const monthlyRevenue = revenueAggregate._sum.amount || 0;

    // 3. Lista de mensalidades atrasadas (as 5 mais antigas)
    const overdueFees = await this.prisma.membershipFee.findMany({
      where: {
        tenantId,
        status: 'PENDING',
        dueDate: { lt: today },
        deletedAt: null,
      },
      include: {
        student: {
          select: { name: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    const overdueFeesList = overdueFees.map((fee) => ({
      id: fee.id,
      studentName: fee.student.name,
      amount: fee.amount,
      dueDate: fee.dueDate.toISOString().split('T')[0],
    }));

    // 4. Histórico Financeiro dos últimos 6 meses
    const financeHistory = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const revAgg = await this.prisma.transaction.aggregate({
        where: { tenantId, type: 'REVENUE', date: { gte: mStart, lte: mEnd }, deletedAt: null },
        _sum: { amount: true },
      });
      const expAgg = await this.prisma.transaction.aggregate({
        where: { tenantId, type: 'EXPENSE', date: { gte: mStart, lte: mEnd }, deletedAt: null },
        _sum: { amount: true },
      });

      const rawMonthName = mStart.toLocaleString('pt-BR', { month: 'short' });
      const monthName = rawMonthName.charAt(0).toUpperCase() + rawMonthName.slice(1).replace('.', '');

      financeHistory.push({
        month: monthName,
        receitas: revAgg._sum.amount || 0,
        despesas: expAgg._sum.amount || 0,
      });
    }

    // 5. Histórico de Frequência (últimos 7 dias distintos com chamada)
    const attendanceGroups = await this.prisma.attendance.groupBy({
      by: ['date'],
      where: {
        tenantId,
        status: 'PRESENT',
      },
      _count: {
        id: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 7,
    });

    const attendanceHistory = attendanceGroups
      .map((att) => {
        const dateObj = new Date(att.date);
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        return {
          date: `${day}/${month}`,
          presentes: att._count.id,
        };
      })
      .reverse();

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      pendingFees,
      monthlyRevenue,
      overdueFeesList,
      financeHistory,
      attendanceHistory,
    };
  }
}

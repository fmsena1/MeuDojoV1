import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const [totalStudents, totalTeachers, totalClasses, pendingFees] = await Promise.all([
      // 1. Total de alunos ativos no tenant
      this.prisma.student.count({
        where: { tenantId, status: 'ACTIVE', deletedAt: null },
      }),
      // 2. Total de professores ativos no tenant
      this.prisma.teacher.count({
        where: { tenantId, status: 'ACTIVE', deletedAt: null },
      }),
      // 3. Total de turmas no tenant
      this.prisma.class.count({
        where: { tenantId, deletedAt: null },
      }),
      // 4. Mensalidades pendentes no tenant
      this.prisma.membershipFee.count({
        where: { tenantId, status: 'PENDING', deletedAt: null },
      }),
    ]);

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      pendingFees,
    };
  }
}

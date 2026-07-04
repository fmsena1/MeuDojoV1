import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMembershipFeeDto,
  BulkGenerateMembershipFeesDto,
  PayMembershipFeeDto,
} from './schemas/membership-fee.schema';

@Injectable()
export class MembershipFeesService {
  constructor(private prisma: PrismaService) {}

  private parseDate(dateStr: string): Date {
    const parsed = new Date(`${dateStr}T00:00:00.000Z`);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Formato de data inválido.');
    }
    return parsed;
  }

  async create(data: CreateMembershipFeeDto, tenantId: string) {
    const dueDate = this.parseDate(data.dueDate);

    // Valida se o aluno pertence ao tenant
    const student = await this.prisma.student.findFirst({
      where: { id: data.studentId, tenantId, deletedAt: null },
    });

    if (!student) {
      throw new BadRequestException(
        'Aluno não encontrado ou não pertence a esta academia.',
      );
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

  async bulkGenerate(data: BulkGenerateMembershipFeesDto, tenantId: string) {
    const startOfMonth = new Date(data.year, data.month - 1, 1);
    const endOfMonth = new Date(data.year, data.month, 0, 23, 59, 59, 999);
    const dueDate = this.parseDate(data.dueDate);

    // Busca estudantes ativos
    const activeStudents = await this.prisma.student.findMany({
      where: { tenantId, status: 'ACTIVE', deletedAt: null },
    });

    if (activeStudents.length === 0) {
      throw new BadRequestException(
        'Não há alunos ativos cadastrados para gerar cobranças.',
      );
    }

    // Busca mensalidades já geradas para este período
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
    const studentsToBill = activeStudents.filter(
      (s) => !existingStudentIds.has(s.id),
    );

    if (studentsToBill.length === 0) {
      return {
        success: true,
        count: 0,
        message: 'Todas as mensalidades para este mês já foram geradas.',
      };
    }

    // Cria as mensalidades em lote
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

  async findAll(
    tenantId: string,
    filters?: { status?: string; studentId?: string },
  ) {
    const where: any = { tenantId, deletedAt: null };

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(`${todayStr}T00:00:00.000Z`);

    if (filters?.status) {
      if (filters.status === 'OVERDUE') {
        where.status = 'PENDING';
        where.dueDate = { lt: today };
      } else if (filters.status === 'PENDING') {
        where.status = 'PENDING';
        where.dueDate = { gte: today };
      } else {
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

  async pay(feeId: string, data: PayMembershipFeeDto, tenantId: string) {
    const fee = await this.prisma.membershipFee.findFirst({
      where: { id: feeId, tenantId, deletedAt: null },
      include: { student: true },
    });

    if (!fee) {
      throw new BadRequestException(
        'Mensalidade não encontrada ou não pertence a esta academia.',
      );
    }

    if (fee.status === 'PAID') {
      throw new BadRequestException('Esta mensalidade já está paga.');
    }

    const paidAtDate = data.paidAt ? this.parseDate(data.paidAt) : new Date();

    return this.prisma.$transaction(async (tx) => {
      // Cria a transação de caixa correspondente (Receita)
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

      // Atualiza o status da mensalidade e vincula à transação
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

  async remove(feeId: string, tenantId: string) {
    const fee = await this.prisma.membershipFee.findFirst({
      where: { id: feeId, tenantId, deletedAt: null },
    });

    if (!fee) {
      throw new BadRequestException('Mensalidade não encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Se houver transação de caixa atrelada, exclui ela
      if (fee.transactionId) {
        await tx.transaction.delete({
          where: { id: fee.transactionId },
        });
      }

      // Exclui a mensalidade
      await tx.membershipFee.delete({
        where: { id: feeId },
      });

      return { success: true };
    });
  }
}

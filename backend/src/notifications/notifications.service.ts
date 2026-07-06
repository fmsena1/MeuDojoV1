import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  private async checkAndGenerateOverdueNotifications(
    userId: string,
    tenantId: string,
    role: string,
  ) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (role === 'STUDENT') {
      // 1. Busca o estudante associado ao usuário
      const student = await this.prisma.student.findFirst({
        where: { userId, tenantId, deletedAt: null },
      });

      if (!student) return;

      // 2. Busca mensalidades pendentes vencidas
      const overdueFees = await this.prisma.membershipFee.findMany({
        where: {
          studentId: student.id,
          status: 'PENDING',
          dueDate: { lt: today },
          deletedAt: null,
        },
      });

      // 3. Cria notificações para o estudante se não existirem (Atrasadas)
      for (const fee of overdueFees) {
        const exists = await this.prisma.notification.findFirst({
          where: { userId, membershipFeeId: fee.id, title: 'Mensalidade em Atraso' },
        });

        if (!exists) {
          const dueDateStr = fee.dueDate.toLocaleDateString('pt-BR');
          await this.prisma.notification.create({
            data: {
              tenantId,
              userId,
              membershipFeeId: fee.id,
              title: 'Mensalidade em Atraso',
              content: `Sua mensalidade com vencimento em ${dueDateStr} no valor de R$ ${fee.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} está pendente de pagamento.`,
              type: 'ALERT',
            },
          });
        }
      }

      // 4. Busca mensalidades pendentes a vencer nos próximos 3 dias ou hoje
      const threeDaysAhead = new Date(today);
      threeDaysAhead.setDate(threeDaysAhead.getDate() + 3);

      const upcomingFees = await this.prisma.membershipFee.findMany({
        where: {
          studentId: student.id,
          status: 'PENDING',
          dueDate: { gte: today, lte: threeDaysAhead },
          deletedAt: null,
        },
      });

      // 5. Cria notificações preventivas de faturas a vencer
      for (const fee of upcomingFees) {
        const exists = await this.prisma.notification.findFirst({
          where: { userId, membershipFeeId: fee.id, title: 'Mensalidade a Vencer' },
        });

        if (!exists) {
          const daysLeft = Math.ceil((fee.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const label = daysLeft === 0 ? 'vence hoje' : `vencerá em ${daysLeft} dia(s)`;
          const dueDateStr = fee.dueDate.toLocaleDateString('pt-BR');

          await this.prisma.notification.create({
            data: {
              tenantId,
              userId,
              membershipFeeId: fee.id,
              title: 'Mensalidade a Vencer',
              content: `Sua mensalidade no valor de R$ ${fee.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ${label} (${dueDateStr}).`,
              type: 'INFO',
            },
          });
        }
      }
    } else if (role === 'ADMIN' || role === 'RECEPTIONIST') {
      // 1. Busca mensalidades pendentes vencidas de todos os alunos do tenant
      const overdueFees = await this.prisma.membershipFee.findMany({
        where: {
          tenantId,
          status: 'PENDING',
          dueDate: { lt: today },
          deletedAt: null,
        },
        include: {
          student: true,
        },
      });

      // 2. Cria notificações para o administrador/recepcionista
      for (const fee of overdueFees) {
        const exists = await this.prisma.notification.findFirst({
          where: { userId, membershipFeeId: fee.id, title: 'Inadimplência Detectada' },
        });

        if (!exists) {
          const dueDateStr = fee.dueDate.toLocaleDateString('pt-BR');
          await this.prisma.notification.create({
            data: {
              tenantId,
              userId,
              membershipFeeId: fee.id,
              title: 'Inadimplência Detectada',
              content: `O aluno ${fee.student.name} está com a mensalidade de R$ ${fee.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} vencida desde ${dueDateStr}.`,
              type: 'WARNING',
            },
          });
        }
      }
    }
  }

  async findAll(userId: string, tenantId: string, role: string) {
    // Roda a checagem automática
    await this.checkAndGenerateOverdueNotifications(userId, tenantId, role);

    return this.prisma.notification.findMany({
      where: { userId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId, tenantId },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string, tenantId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        tenantId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}

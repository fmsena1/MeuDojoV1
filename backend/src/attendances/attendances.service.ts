import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkCreateAttendanceDto } from './schemas/attendance.schema';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  private parseDate(dateStr: string): Date {
    // Retorna a data no formato YYYY-MM-DDT00:00:00.000Z
    const parsed = new Date(`${dateStr}T00:00:00.000Z`);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Formato de data inválido.');
    }
    return parsed;
  }

  async saveBulk(data: BulkCreateAttendanceDto, tenantId: string) {
    const date = this.parseDate(data.date);

    // Valida se a turma pertence ao tenant
    const targetClass = await this.prisma.class.findFirst({
      where: { id: data.classId, tenantId, deletedAt: null },
    });
    if (!targetClass) {
      throw new BadRequestException(
        'Turma não encontrada ou não pertence a esta academia.',
      );
    }

    // Valida se todos os estudantes enviados pertencem ao tenant
    const studentIds = data.records.map((r) => r.studentId);
    const validStudentsCount = await this.prisma.student.count({
      where: {
        id: { in: studentIds },
        tenantId,
        deletedAt: null,
      },
    });

    if (validStudentsCount !== studentIds.length) {
      throw new BadRequestException(
        'Um ou mais alunos enviados são inválidos.',
      );
    }

    // Executa em transação: limpa chamadas do dia para a turma e insere as novas
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

  async findByClassAndDate(classId: string, dateStr: string, tenantId: string) {
    const date = this.parseDate(dateStr);

    // Valida a turma
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
      throw new BadRequestException(
        'Turma não encontrada ou não pertence a esta academia.',
      );
    }

    // Busca presenças já salvas
    const attendances = await this.prisma.attendance.findMany({
      where: { classId, date, tenantId },
    });

    // Mapeia os alunos matriculados ativos acoplando a presença se existir
    const list = targetClass.enrollments.map((en) => {
      const att = attendances.find((a) => a.studentId === en.studentId);
      return {
        studentId: en.studentId,
        name: en.student.name,
        status: att?.status || null, // null significa que a chamada não foi feita para este aluno ainda
        notes: att?.notes || null,
      };
    });

    // Ordena por nome do aluno
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findHistoryByStudent(studentId: string, tenantId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, tenantId, deletedAt: null },
    });

    if (!student) {
      throw new BadRequestException('Aluno não encontrado.');
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
    const justified = attendances.filter(
      (a) => a.status === 'JUSTIFIED',
    ).length;

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
        attendanceRate: Math.round(rate * 10) / 10, // arredonda para 1 casa decimal
      },
      history: attendances.map((a) => ({
        id: a.id,
        classId: a.classId,
        className: a.class.name,
        date: a.date.toISOString().split('T')[0], // AAAA-MM-DD
        status: a.status,
        notes: a.notes,
      })),
    };
  }
}

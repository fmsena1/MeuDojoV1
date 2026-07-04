import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
} from './schemas/enrollment.schema';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEnrollmentDto, tenantId: string) {
    // Valida se o aluno existe e pertence ao tenant
    const student = await this.prisma.student.findFirst({
      where: { id: data.studentId, tenantId, deletedAt: null },
    });
    if (!student) {
      throw new BadRequestException(
        'Aluno não encontrado ou não pertence a esta academia.',
      );
    }

    // Valida se a turma existe e pertence ao tenant
    const targetClass = await this.prisma.class.findFirst({
      where: { id: data.classId, tenantId, deletedAt: null },
    });
    if (!targetClass) {
      throw new BadRequestException(
        'Turma não encontrada ou não pertence a esta academia.',
      );
    }

    // Verifica se já existe uma matrícula para o mesmo aluno nesta turma
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: data.studentId,
        classId: data.classId,
        deletedAt: null,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('O aluno já está matriculado nesta turma.');
    }

    return this.prisma.enrollment.create({
      data: {
        tenantId,
        studentId: data.studentId,
        classId: data.classId,
        status: data.status ?? 'ACTIVE',
      },
      include: {
        student: { select: { name: true } },
        class: { select: { name: true } },
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.enrollment.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        student: { select: { name: true, status: true } },
        class: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        student: { select: { name: true } },
        class: { select: { name: true } },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Matrícula não encontrada.');
    }

    return enrollment;
  }

  async update(id: string, data: UpdateEnrollmentDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.enrollment.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        student: { select: { name: true } },
        class: { select: { name: true } },
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.enrollment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }
}

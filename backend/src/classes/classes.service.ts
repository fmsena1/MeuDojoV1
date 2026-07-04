import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto, UpdateClassDto } from './schemas/class.schema';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  private async validateRelations(
    martialArtId: string,
    teacherId: string,
    tenantId: string,
  ) {
    const martialArt = await this.prisma.martialArt.findFirst({
      where: { id: martialArtId, tenantId, deletedAt: null },
    });
    if (!martialArt) {
      throw new BadRequestException(
        'Modalidade não encontrada ou não pertence a esta academia.',
      );
    }

    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, tenantId, deletedAt: null },
    });
    if (!teacher) {
      throw new BadRequestException(
        'Professor não encontrado ou não pertence a esta academia.',
      );
    }
  }

  async create(data: CreateClassDto, tenantId: string) {
    await this.validateRelations(data.martialArtId, data.teacherId, tenantId);

    // Criação da turma e horários em transação
    return this.prisma.$transaction(async (tx) => {
      const newClass = await tx.class.create({
        data: {
          tenantId,
          martialArtId: data.martialArtId,
          teacherId: data.teacherId,
          name: data.name,
          description: data.description,
        },
      });

      if (data.schedules && data.schedules.length > 0) {
        await tx.classSchedule.createMany({
          data: data.schedules.map((schedule) => ({
            classId: newClass.id,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })),
        });
      }

      return tx.class.findUnique({
        where: { id: newClass.id },
        include: {
          schedules: true,
          martialArt: { select: { name: true } },
          teacher: { select: { name: true } },
        },
      });
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.class.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        schedules: true,
        martialArt: { select: { name: true } },
        teacher: { select: { name: true } },
        _count: {
          select: {
            enrollments: {
              where: { deletedAt: null, status: 'ACTIVE' },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const targetClass = await this.prisma.class.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        schedules: true,
        martialArt: { select: { name: true } },
        teacher: { select: { name: true } },
        enrollments: {
          where: { deletedAt: null },
          include: {
            student: {
              select: { id: true, name: true, status: true },
            },
          },
        },
      },
    });

    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada.');
    }

    return targetClass;
  }

  async update(id: string, data: UpdateClassDto, tenantId: string) {
    const existingClass = await this.findOne(id, tenantId);

    const mId = data.martialArtId ?? existingClass.martialArtId;
    const tId = data.teacherId ?? existingClass.teacherId;
    await this.validateRelations(mId, tId, tenantId);

    return this.prisma.$transaction(async (tx) => {
      // Atualiza dados básicos
      await tx.class.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          martialArtId: data.martialArtId,
          teacherId: data.teacherId,
        },
      });

      // Se passou novos horários, remove os antigos e cadastra de novo
      if (data.schedules) {
        await tx.classSchedule.deleteMany({
          where: { classId: id },
        });

        if (data.schedules.length > 0) {
          await tx.classSchedule.createMany({
            data: data.schedules.map((schedule) => ({
              classId: id,
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            })),
          });
        }
      }

      return tx.class.findUnique({
        where: { id },
        include: {
          schedules: true,
          martialArt: { select: { name: true } },
          teacher: { select: { name: true } },
        },
      });
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.$transaction(async (tx) => {
      // Soft-delete nas matrículas vinculadas a essa turma
      await tx.enrollment.updateMany({
        where: { classId: id, deletedAt: null },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });

      // Soft-delete na turma
      return tx.class.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }
}

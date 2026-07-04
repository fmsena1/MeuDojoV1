import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMartialArtDto,
  UpdateMartialArtDto,
} from './schemas/martial-art.schema';

@Injectable()
export class MartialArtsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMartialArtDto, tenantId: string) {
    return this.prisma.martialArt.create({
      data: {
        name: data.name,
        description: data.description,
        tenantId,
      },
      include: {
        graduations: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.martialArt.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        graduations: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const martialArt = await this.prisma.martialArt.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        graduations: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!martialArt) {
      throw new NotFoundException('Modalidade não encontrada.');
    }

    return martialArt;
  }

  async update(id: string, data: UpdateMartialArtDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.martialArt.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        graduations: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    // Soft delete também nas graduações
    await this.prisma.graduation.updateMany({
      where: { martialArtId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return this.prisma.martialArt.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

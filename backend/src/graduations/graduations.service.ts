import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGraduationDto,
  UpdateGraduationDto,
} from './schemas/graduation.schema';

@Injectable()
export class GraduationsService {
  constructor(private prisma: PrismaService) {}

  private async validateMartialArtBelongsToTenant(
    martialArtId: string,
    tenantId: string,
  ) {
    const martialArt = await this.prisma.martialArt.findFirst({
      where: { id: martialArtId, tenantId, deletedAt: null },
    });

    if (!martialArt) {
      throw new BadRequestException(
        'Modalidade não encontrada ou não pertence a este tenant.',
      );
    }

    return martialArt;
  }

  async create(data: CreateGraduationDto, tenantId: string) {
    await this.validateMartialArtBelongsToTenant(data.martialArtId, tenantId);

    return this.prisma.graduation.create({
      data: {
        martialArtId: data.martialArtId,
        tenantId,
        name: data.name,
        order: data.order ?? 0,
        color: data.color,
      },
    });
  }

  async findAllByMartialArt(martialArtId: string, tenantId: string) {
    await this.validateMartialArtBelongsToTenant(martialArtId, tenantId);

    return this.prisma.graduation.findMany({
      where: { martialArtId, tenantId, deletedAt: null },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const graduation = await this.prisma.graduation.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!graduation) {
      throw new NotFoundException('Graduação não encontrada.');
    }

    return graduation;
  }

  async update(id: string, data: UpdateGraduationDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.graduation.update({
      where: { id },
      data: {
        name: data.name,
        order: data.order,
        color: data.color,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.graduation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

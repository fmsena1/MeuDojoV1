import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './schemas/create-user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { tenant: true },
    });
  }

  async createInternalUser(data: CreateInternalUserDto, tenantId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });

    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado no sistema.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        tenantId: tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

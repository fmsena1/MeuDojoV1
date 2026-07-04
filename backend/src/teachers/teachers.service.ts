import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './schemas/create-teacher.schema';
import { UpdateTeacherDto } from './schemas/update-teacher.schema';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTeacherDto, tenantId: string) {
    let userId: string | undefined;

    if (data.createUserAccess) {
      if (!data.email) {
        throw new BadRequestException(
          'E-mail é obrigatório para criar acesso ao sistema.',
        );
      }
      if (!data.password) {
        throw new BadRequestException(
          'Senha é obrigatória para criar acesso ao sistema.',
        );
      }

      // Verificar se o e-mail já existe na tabela de usuários
      const existingUser = await this.prisma.user.findFirst({
        where: { email: data.email, deletedAt: null },
      });

      if (existingUser) {
        throw new BadRequestException(
          'O e-mail informado já está em uso por outro usuário.',
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: Role.TEACHER,
          tenantId,
        },
      });

      userId = user.id;
    }

    return this.prisma.teacher.create({
      data: {
        tenantId,
        userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        rg: data.rg,
        cpf: data.cpf,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        bio: data.bio,
        specialties: data.specialties,
        graduation: data.graduation,
        status: data.status || 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, search?: string) {
    return this.prisma.teacher.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search, mode: 'insensitive' } },
                { specialties: { contains: search, mode: 'insensitive' } },
                { graduation: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado.');
    }

    return teacher;
  }

  async update(id: string, data: UpdateTeacherDto, tenantId: string) {
    const teacher = await this.findOne(id, tenantId);

    let userId = teacher.userId;

    // Se o usuário quer ativar o acesso ao sistema agora e o professor ainda não possui userId
    if (data.createUserAccess && !teacher.userId) {
      if (!data.email) {
        throw new BadRequestException(
          'E-mail é obrigatório para criar acesso ao sistema.',
        );
      }
      if (!data.password) {
        throw new BadRequestException(
          'Senha é obrigatória para criar acesso ao sistema.',
        );
      }

      const existingUser = await this.prisma.user.findFirst({
        where: { email: data.email, deletedAt: null },
      });

      if (existingUser) {
        throw new BadRequestException(
          'O e-mail informado já está em uso por outro usuário.',
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: data.name || teacher.name,
          email: data.email,
          password: hashedPassword,
          role: Role.TEACHER,
          tenantId,
        },
      });

      userId = user.id;
    } else if (teacher.userId) {
      // Se ele já possui userId, podemos atualizar o e-mail ou a senha se informados
      const userUpdateData: any = {};
      if (data.name) userUpdateData.name = data.name;
      if (data.email && data.email !== teacher.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            email: data.email,
            deletedAt: null,
            NOT: { id: teacher.userId },
          },
        });

        if (existingUser) {
          throw new BadRequestException(
            'O e-mail informado já está em uso por outro usuário.',
          );
        }
        userUpdateData.email = data.email;
      }
      if (data.password) {
        userUpdateData.password = await bcrypt.hash(data.password, 10);
      }

      if (Object.keys(userUpdateData).length > 0) {
        await this.prisma.user.update({
          where: { id: teacher.userId },
          data: userUpdateData,
        });
      }
    }

    return this.prisma.teacher.update({
      where: { id },
      data: {
        userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        rg: data.rg,
        cpf: data.cpf,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        bio: data.bio,
        specialties: data.specialties,
        graduation: data.graduation,
        status: data.status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string, tenantId: string) {
    const teacher = await this.findOne(id, tenantId);

    const now = new Date();

    // Executa soft delete no professor
    const deletedTeacher = await this.prisma.teacher.update({
      where: { id },
      data: { deletedAt: now },
    });

    // Se houver usuário associado, executa soft delete no usuário também
    if (teacher.userId) {
      await this.prisma.user.update({
        where: { id: teacher.userId },
        data: { deletedAt: now },
      });
    }

    return deletedTeacher;
  }
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './schemas/create-student.schema';
import { UpdateStudentDto } from './schemas/update-student.schema';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStudentDto, tenantId: string) {
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
          role: Role.STUDENT,
          tenantId,
        },
      });

      userId = user.id;
    }

    return this.prisma.student.create({
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
        status: data.status || 'ACTIVE',
        monthlyFee: data.monthlyFee ?? 0,
        paymentDay: data.paymentDay ?? 10,
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
    return this.prisma.student.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search, mode: 'insensitive' } },
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
    const student = await this.prisma.student.findFirst({
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

    if (!student) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    return student;
  }

  async update(id: string, data: UpdateStudentDto, tenantId: string) {
    const student = await this.findOne(id, tenantId);

    let userId = student.userId;

    // Se o usuário quer ativar o acesso ao sistema agora e o aluno ainda não possui userId
    if (data.createUserAccess && !student.userId) {
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
          name: data.name || student.name,
          email: data.email,
          password: hashedPassword,
          role: Role.STUDENT,
          tenantId,
        },
      });

      userId = user.id;
    } else if (student.userId) {
      // Se ele já possui userId, podemos atualizar o e-mail ou a senha se informados
      const userUpdateData: any = {};
      if (data.name) userUpdateData.name = data.name;
      if (data.email && data.email !== student.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            email: data.email,
            deletedAt: null,
            NOT: { id: student.userId },
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
          where: { id: student.userId },
          data: userUpdateData,
        });
      }
    }

    return this.prisma.student.update({
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
        status: data.status,
        monthlyFee: data.monthlyFee,
        paymentDay: data.paymentDay,
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
    const student = await this.findOne(id, tenantId);

    const now = new Date();

    // Executa soft delete no aluno
    const deletedStudent = await this.prisma.student.update({
      where: { id },
      data: { deletedAt: now },
    });

    // Se houver usuário associado, executa soft delete no usuário também
    if (student.userId) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: { deletedAt: now },
      });
    }

    return deletedStudent;
  }
}

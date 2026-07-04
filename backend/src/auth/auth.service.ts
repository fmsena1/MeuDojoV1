import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './schemas/login.schema';
import { RegisterTenantDto } from './schemas/register-tenant.schema';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
        },
      },
    };
  }

  async registerTenant(dto: RegisterTenantDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    const slug = dto.academyName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
      .replace(/[\s-]+/g, '-'); // substitui espaços e hífens por um único hífen

    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });
    if (existingTenant) {
      throw new BadRequestException(
        'Já existe uma academia cadastrada com este nome.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.academyName,
          slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name: dto.adminName,
          email: dto.email,
          password: hashedPassword,
          role: Role.ADMIN,
          tenantId: tenant.id,
        },
        include: {
          tenant: true,
        },
      });

      return user;
    });

    const payload = {
      sub: result.id,
      email: result.email,
      role: result.role,
      tenantId: result.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
        },
      },
    };
  }
}

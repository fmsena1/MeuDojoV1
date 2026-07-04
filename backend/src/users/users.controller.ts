import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import {
  createInternalUserSchema,
  CreateInternalUserDto,
} from './schemas/create-user.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(createInternalUserSchema))
  async create(
    @Body() createUserDto: CreateInternalUserDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.usersService.createInternalUser(createUserDto, user.tenantId);
  }

  @Get()
  async findAll(@ActiveUser() user: ActiveUserData) {
    return this.usersService.findAll(user.tenantId);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createTeacherSchema,
  CreateTeacherDto,
} from './schemas/create-teacher.schema';
import {
  updateTeacherSchema,
  UpdateTeacherDto,
} from './schemas/update-teacher.schema';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(createTeacherSchema))
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.teachersService.create(createTeacherDto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Query('search') search?: string,
  ) {
    return this.teachersService.findAll(user.tenantId, search);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.teachersService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(updateTeacherSchema))
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.teachersService.update(id, updateTeacherDto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.teachersService.remove(id, user.tenantId);
  }
}

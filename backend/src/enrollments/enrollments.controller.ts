import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
} from './schemas/enrollment.schema';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(createEnrollmentSchema))
  async create(
    @Body() dto: CreateEnrollmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.enrollmentsService.create(dto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findAll(@ActiveUser() user: ActiveUserData) {
    return this.enrollmentsService.findAll(user.tenantId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.enrollmentsService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(updateEnrollmentSchema))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.enrollmentsService.update(id, dto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.enrollmentsService.remove(id, user.tenantId);
  }
}

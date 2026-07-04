import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MembershipFeesService } from './membership-fees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';
import {
  createMembershipFeeSchema,
  CreateMembershipFeeDto,
  bulkGenerateMembershipFeesSchema,
  BulkGenerateMembershipFeesDto,
  payMembershipFeeSchema,
  PayMembershipFeeDto,
} from './schemas/membership-fee.schema';

@Controller('membership-fees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipFeesController {
  constructor(
    private readonly membershipFeesService: MembershipFeesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(createMembershipFeeSchema))
  async create(
    @Body() dto: CreateMembershipFeeDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.membershipFeesService.create(dto, user.tenantId);
  }

  @Post('bulk')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(bulkGenerateMembershipFeesSchema))
  async bulkGenerate(
    @Body() dto: BulkGenerateMembershipFeesDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.membershipFeesService.bulkGenerate(dto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.STUDENT)
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
  ) {
    let targetStudentId = studentId;

    if (user.role === Role.STUDENT) {
      const student = await this.prisma.student.findUnique({
        where: { userId: user.id },
      });
      targetStudentId = student?.id || 'none';
    }

    return this.membershipFeesService.findAll(user.tenantId, {
      status,
      studentId: targetStudentId,
    });
  }

  @Post(':id/pay')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(payMembershipFeeSchema))
  async pay(
    @Param('id') id: string,
    @Body() dto: PayMembershipFeeDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.membershipFeesService.pay(id, dto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.membershipFeesService.remove(id, user.tenantId);
  }
}

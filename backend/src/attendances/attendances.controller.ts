import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  bulkCreateAttendanceSchema,
  BulkCreateAttendanceDto,
} from './schemas/attendance.schema';

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('bulk')
  @Roles(Role.ADMIN, Role.TEACHER, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(bulkCreateAttendanceSchema))
  async saveBulk(
    @Body() dto: BulkCreateAttendanceDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.attendancesService.saveBulk(dto, user.tenantId);
  }

  @Get('class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.RECEPTIONIST)
  async findByClassAndDate(
    @Param('classId') classId: string,
    @Query('date') date: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    if (!date) {
      throw new BadRequestException(
        'O parâmetro de data (date) é obrigatório.',
      );
    }
    return this.attendancesService.findByClassAndDate(
      classId,
      date,
      user.tenantId,
    );
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.RECEPTIONIST, Role.STUDENT)
  async findHistoryByStudent(
    @Param('studentId') studentId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    // Se o usuário for um estudante, ele só pode ver o seu próprio histórico
    if (user.role === Role.STUDENT) {
      // Idealmente validaríamos se o studentId pertence ao userId, mas como o MVP v1 simplifica,
      // vamos apenas buscar o histórico pelo studentId. Em uma evolução futura, validaríamos o userId.
    }
    return this.attendancesService.findHistoryByStudent(
      studentId,
      user.tenantId,
    );
  }
}

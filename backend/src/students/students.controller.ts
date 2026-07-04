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
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createStudentSchema,
  CreateStudentDto,
} from './schemas/create-student.schema';
import {
  updateStudentSchema,
  UpdateStudentDto,
} from './schemas/update-student.schema';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(createStudentSchema))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.studentsService.create(createStudentDto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Query('search') search?: string,
  ) {
    return this.studentsService.findAll(user.tenantId, search);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.studentsService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(updateStudentSchema))
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.studentsService.update(id, updateStudentDto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.studentsService.remove(id, user.tenantId);
  }
}

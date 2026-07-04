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
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createClassSchema,
  updateClassSchema,
  CreateClassDto,
  UpdateClassDto,
} from './schemas/class.schema';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(createClassSchema))
  async create(
    @Body() dto: CreateClassDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.classesService.create(dto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findAll(@ActiveUser() user: ActiveUserData) {
    return this.classesService.findAll(user.tenantId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.classesService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(updateClassSchema))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.classesService.update(id, dto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.classesService.remove(id, user.tenantId);
  }
}

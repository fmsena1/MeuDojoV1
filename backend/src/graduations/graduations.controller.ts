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
import { GraduationsService } from './graduations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createGraduationSchema,
  updateGraduationSchema,
  CreateGraduationDto,
  UpdateGraduationDto,
} from './schemas/graduation.schema';

@Controller('graduations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GraduationsController {
  constructor(private readonly graduationsService: GraduationsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(createGraduationSchema))
  async create(
    @Body() dto: CreateGraduationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.graduationsService.create(dto, user.tenantId);
  }

  @Get('by-martial-art/:martialArtId')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findAllByMartialArt(
    @Param('martialArtId') martialArtId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.graduationsService.findAllByMartialArt(
      martialArtId,
      user.tenantId,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.graduationsService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(updateGraduationSchema))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGraduationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.graduationsService.update(id, dto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.graduationsService.remove(id, user.tenantId);
  }
}

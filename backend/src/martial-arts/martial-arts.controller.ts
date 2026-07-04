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
import { MartialArtsService } from './martial-arts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createMartialArtSchema,
  updateMartialArtSchema,
  CreateMartialArtDto,
  UpdateMartialArtDto,
} from './schemas/martial-art.schema';

@Controller('martial-arts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MartialArtsController {
  constructor(private readonly martialArtsService: MartialArtsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(createMartialArtSchema))
  async create(
    @Body() dto: CreateMartialArtDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.martialArtsService.create(dto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findAll(@ActiveUser() user: ActiveUserData) {
    return this.martialArtsService.findAll(user.tenantId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TEACHER)
  async findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.martialArtsService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(updateMartialArtSchema))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMartialArtDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.martialArtsService.update(id, dto, user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.martialArtsService.remove(id, user.tenantId);
  }
}

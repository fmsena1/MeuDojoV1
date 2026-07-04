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
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createTransactionSchema,
  CreateTransactionDto,
} from './schemas/transaction.schema';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  async create(
    @Body() dto: CreateTransactionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.transactionsService.create(dto, user.tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Query('type') type?: 'REVENUE' | 'EXPENSE',
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const parsedMonth = month ? parseInt(month, 10) : undefined;
    const parsedYear = year ? parseInt(year, 10) : undefined;

    return this.transactionsService.findAll(user.tenantId, {
      type,
      month: parsedMonth,
      year: parsedYear,
    });
  }

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async getDashboard(@ActiveUser() user: ActiveUserData) {
    return this.transactionsService.getDashboard(user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.transactionsService.remove(id, user.tenantId);
  }
}

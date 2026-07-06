import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/decorators/active-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.findAll(user.id, user.tenantId, user.role);
  }

  @Patch('read-all')
  async markAllAsRead(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.markAllAsRead(user.id, user.tenantId);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.notificationsService.markAsRead(id, user.id, user.tenantId);
  }
}

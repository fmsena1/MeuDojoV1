import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema, LoginDto } from './schemas/login.schema';
import {
  registerTenantSchema,
  RegisterTenantDto,
} from './schemas/register-tenant.schema';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ActiveUser } from './decorators/active-user.decorator';
import type { ActiveUserData } from './decorators/active-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerTenantSchema))
  async register(@Body() registerTenantDto: RegisterTenantDto) {
    return this.authService.registerTenant(registerTenantDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@ActiveUser() user: ActiveUserData) {
    return user;
  }
}

import { Module } from '@nestjs/common';
import { MembershipFeesService } from './membership-fees.service';
import { MembershipFeesController } from './membership-fees.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembershipFeesController],
  providers: [MembershipFeesService],
  exports: [MembershipFeesService],
})
export class MembershipFeesModule {}

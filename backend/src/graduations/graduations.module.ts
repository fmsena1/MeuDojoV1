import { Module } from '@nestjs/common';
import { GraduationsService } from './graduations.service';
import { GraduationsController } from './graduations.controller';

@Module({
  controllers: [GraduationsController],
  providers: [GraduationsService],
  exports: [GraduationsService],
})
export class GraduationsModule {}

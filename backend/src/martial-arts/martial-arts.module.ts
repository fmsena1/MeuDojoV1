import { Module } from '@nestjs/common';
import { MartialArtsService } from './martial-arts.service';
import { MartialArtsController } from './martial-arts.controller';

@Module({
  controllers: [MartialArtsController],
  providers: [MartialArtsService],
  exports: [MartialArtsService],
})
export class MartialArtsModule {}

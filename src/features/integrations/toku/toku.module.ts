import { Module } from '@nestjs/common';
import { TokuService } from './toku.service';
import { TokuController } from './toku.controller';

@Module({
  controllers: [TokuController],
  providers: [TokuService],
})
export class TokuModule {}

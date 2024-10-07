import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerResolver } from './manager.resolver';

@Module({
  providers: [ManagerResolver, ManagerService],
})
export class ManagerModule {}

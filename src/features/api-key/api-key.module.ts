import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { AccessKeyGuard } from 'src/shared/guards/accessKey.guard';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService,AccessKeyGuard],
  exports:[ApiKeyService]
})
export class ApiKeyModule {}

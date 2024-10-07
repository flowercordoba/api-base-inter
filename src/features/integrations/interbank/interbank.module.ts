import { Module } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { InterbankController } from './interbank.controller';
import { EmailModule } from 'src/shared/modules/email/email.module';

@Module({
  controllers: [InterbankController],
  providers: [InterbankService],
  imports:[EmailModule]

})
export class InterbankModule {}

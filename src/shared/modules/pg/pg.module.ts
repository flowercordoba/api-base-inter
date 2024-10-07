import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/features/api-key/entities/api-key.entity';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { Interbank } from 'src/features/integrations/interbank/entities/interbank.entity';
import { Invoice } from 'src/features/invoices/entities/invoice.entity';
import { PaymentProvider } from 'src/features/provider/entities/provider.entity';
import { Permission } from 'src/features/role/entities/permission.entity';
import { Role } from 'src/features/role/entities/roles.entity';
import { RevokedToken } from 'src/features/user/entities/revokedToken.entity';
import { User } from 'src/features/user/entities/user.entity';

import { envs } from 'src/shared/config';


@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DATABASE_HOST,
      port: 16751,
      username:  envs.DATABASE_USERNAME,
      password: envs.DATABASE_PASSWORD,
      database: envs.DATABASE_NAME,
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 10,
        connectionTimeoutMillis: 2000,
        idleTimeoutMillis: 30000,
      },

    }),

    TypeOrmModule.forFeature([
      User,
      RevokedToken,
      Role,
      Permission,
      ApiKey,
      PaymentProvider ,
      Invoice,
      Interbank,
      Customer
    ])



  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class PgModule { }

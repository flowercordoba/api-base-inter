import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { RolesService } from '../role/role.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/shared/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule,AuthService,JwtStrategy],
  providers: [AuthService, RolesService,JwtStrategy],
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '24h' },
          secret: envs.JWT_ACCESS_TOKEN_SECRET,
        };
      },
    }),
    
    // 

  ],
  
})
export class AuthModule {}

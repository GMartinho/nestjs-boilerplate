import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentModule } from 'src/env/environment.module';
import { Environment } from 'src/env/environment';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [Environment],
      useFactory: async (env: Environment) => ({
        secret: env.jwtSecret,
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}

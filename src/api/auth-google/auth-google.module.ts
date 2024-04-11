import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService],
})
export class AuthGoogleModule {}

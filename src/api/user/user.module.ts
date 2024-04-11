import { Module, Provider } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileStorageModule } from 'src/file-storage/file-storage.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    FileStorageModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository]
})
export class UserModule {}

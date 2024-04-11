import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { Database } from 'src/database/database';
import { UserEntity } from './entity/user.entity';
import { UserProviderOptions } from 'src/app.shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly database: Database) {}

  async create(user: Prisma.UserAccountCreateInput): Promise<UserEntity> {
    return this.database.userAccount.create({
      data: user,
    });
  }

  async findMany() {
    return this.database.userAccount.findMany();
  }

  async findById(id: string): Promise<UserEntity> {
    return this.database.userAccount.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.database.userAccount.findFirst({
      where: {
        email,
      },
    });
  }

  async findByProvider(provider: UserProviderOptions, providerKey: string): Promise<UserEntity> {
    return this.database.userAccount.findFirst({
      where: {
        providers: {
          some: {
            provider,
            providerKey,
          },
        },
      },
    });
  }

  async upsert(user: Partial<UserEntity>) {
    return this.database.userAccount.upsert({
      where: {
        email: user.email,
      },
      update: user as UpdateUserRequestDto,
      create: user as CreateUserRequestDto,
    });
  }

  async update(id: string, updateUserDto: UpdateUserRequestDto) {
    return this.database.userAccount.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.database.userAccount.delete({
      where: {
        id,
      },
    });
  }
}
